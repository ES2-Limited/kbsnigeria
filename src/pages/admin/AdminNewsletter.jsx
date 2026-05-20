// Admin newsletter manager.

import DOMPurify from 'dompurify'
import { Eye, Send, Trash2, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import RichTextEditor from '../../components/ui/RichTextEditor'
import { supabase } from '../../lib/supabase'
import { formatAdminDate } from './_helpers'

function AdminNewsletter() {
  const [activeTab, setActiveTab] = useState('compose')
  const [subscribers, setSubscribers] = useState([])
  const [loadingSubscribers, setLoadingSubscribers] = useState(true)
  const [sending, setSending] = useState(false)
  const [adding, setAdding] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [deliveryCount, setDeliveryCount] = useState(null)
  const [error, setError] = useState('')
  const [subscriberForm, setSubscriberForm] = useState({ email: '', name: '' })
  const [bannerFile, setBannerFile] = useState(null)
  const [newsletterForm, setNewsletterForm] = useState({
    bannerUrl: '',
    body: '<p></p>',
    subject: '',
  })

  const loadSubscribers = async () => {
    setLoadingSubscribers(true)
    const { data, error: requestError } = await supabase
      .from('newsletter_subscribers')
      .select('id, name, email, confirmed, subscribed_at')
      .order('subscribed_at', { ascending: false })

    if (requestError) {
      setError(requestError.message)
      setSubscribers([])
    } else {
      setSubscribers(data ?? [])
      setError('')
    }

    setLoadingSubscribers(false)
  }

  useEffect(() => {
    loadSubscribers()
  }, [])

  const handleSubscriberChange = (event) => {
    const { name, value } = event.target
    setSubscriberForm((current) => ({ ...current, [name]: value }))
  }

  const handleNewsletterChange = (event) => {
    const { name, value } = event.target
    setNewsletterForm((current) => ({ ...current, [name]: value }))
  }

  const handleAddSubscriber = async (event) => {
    event.preventDefault()
    setAdding(true)
    setError('')

    const { error: requestError } = await supabase.from('newsletter_subscribers').insert({
      confirmed: true,
      email: subscriberForm.email,
      name: subscriberForm.name,
    })

    if (requestError) {
      setError(requestError.message)
      setAdding(false)
      return
    }

    setSubscriberForm({ email: '', name: '' })
    setAdding(false)
    loadSubscribers()
  }

  const handleRemoveSubscriber = async (subscriberId) => {
    if (!window.confirm('Remove this subscriber?')) {
      return
    }

    const { error: requestError } = await supabase.from('newsletter_subscribers').delete().eq('id', subscriberId)

    if (requestError) {
      setError(requestError.message)
      return
    }

    loadSubscribers()
  }

  const handleSend = async () => {
    setSending(true)
    setError('')

    let bannerUrl = newsletterForm.bannerUrl

    if (bannerFile) {
      const filePath = `${Date.now()}-${bannerFile.name.replace(/\s+/g, '-')}`
      const uploadResult = await supabase.storage.from('newsletter-banners').upload(filePath, bannerFile)

      if (uploadResult.error) {
        setError(uploadResult.error.message)
        setSending(false)
        return
      }

      const { data: publicUrlData } = supabase.storage.from('newsletter-banners').getPublicUrl(filePath)
      bannerUrl = publicUrlData.publicUrl
    }

    const { data, error: requestError } = await supabase.functions.invoke('send-newsletter', {
      body: {
        bannerUrl: bannerUrl || null,
        body: DOMPurify.sanitize(newsletterForm.body),
        subject: newsletterForm.subject,
      },
    })

    if (requestError) {
      setError(requestError.message)
      setSending(false)
      return
    }

    setDeliveryCount(data?.recipientCount ?? 0)
    setSending(false)
  }

  const previewHtml = useMemo(
    () => DOMPurify.sanitize(newsletterForm.body),
    [newsletterForm.body],
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-body text-sm font-semibold uppercase tracking-wide text-kbs-cyan">Newsletter</p>
          <h1 className="font-display text-4xl text-kbs-navy">Newsletter & Subscribers</h1>
        </div>
        <Badge variant="cyan">{subscribers.length} Subscribers</Badge>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          className={`rounded-full px-5 py-3 font-body text-sm transition-colors duration-200 ${
            activeTab === 'compose' ? 'bg-kbs-cyan text-white' : 'bg-surface-grey text-text-medium'
          }`}
          onClick={() => setActiveTab('compose')}
          type="button"
        >
          Compose
        </button>
        <button
          className={`rounded-full px-5 py-3 font-body text-sm transition-colors duration-200 ${
            activeTab === 'subscribers' ? 'bg-kbs-cyan text-white' : 'bg-surface-grey text-text-medium'
          }`}
          onClick={() => setActiveTab('subscribers')}
          type="button"
        >
          Subscribers
        </button>
      </div>

      {error ? <p className="font-body text-sm text-error">{error}</p> : null}

      {activeTab === 'compose' ? (
        <div className="space-y-6">
          <Card className="space-y-5">
            <Input label="Subject Line" name="subject" onChange={handleNewsletterChange} required value={newsletterForm.subject} />
            <div>
              <label className="mb-2 block font-body text-sm font-medium text-text-dark" htmlFor="newsletter-banner">Optional Banner Image</label>
              <input
                accept="image/jpeg,image/png,image/webp"
                className="w-full rounded-xl border border-kbs-lavender px-4 py-3 font-body text-text-dark"
                id="newsletter-banner"
                onChange={(event) => setBannerFile(event.target.files?.[0] ?? null)}
                type="file"
              />
            </div>
            <RichTextEditor content={newsletterForm.body} onChange={(body) => setNewsletterForm((current) => ({ ...current, body }))} />
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setPreviewOpen(true)} variant="secondary">
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </Button>
              <Button loading={sending} onClick={handleSend} variant="primary">
                <Send className="h-4 w-4" />
                <span>Send Newsletter</span>
              </Button>
            </div>
            {deliveryCount !== null ? <p className="font-body text-sm text-success">Delivered to {deliveryCount} subscribers.</p> : null}
          </Card>

          <Modal onClose={() => setPreviewOpen(false)} open={previewOpen} title="Newsletter Preview">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </Modal>
        </div>
      ) : null}

      {activeTab === 'subscribers' ? (
        <div className="space-y-6">
          <Card className="space-y-5">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-kbs-navy" />
              <h2 className="font-body text-lg font-semibold text-text-dark">Manual Add Subscriber</h2>
            </div>
            <form className="grid gap-5 md:grid-cols-[1fr_1fr_auto] md:items-end" onSubmit={handleAddSubscriber}>
              <Input label="Name" name="name" onChange={handleSubscriberChange} required value={subscriberForm.name} />
              <Input label="Email" name="email" onChange={handleSubscriberChange} required type="email" value={subscriberForm.email} />
              <Button loading={adding} type="submit" variant="primary">Add Subscriber</Button>
            </form>
          </Card>

          {loadingSubscribers ? <div className="h-40 animate-pulse rounded-3xl bg-surface-grey" /> : null}

          {!loadingSubscribers ? (
            <Card className="overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-surface-grey font-body text-sm">
                  <thead className="bg-surface-grey/60 text-left text-text-medium">
                    <tr>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Confirmed</th>
                      <th className="px-6 py-4 font-medium">Join Date</th>
                      <th className="px-6 py-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-grey">
                    {subscribers.map((subscriber) => (
                      <tr key={subscriber.id}>
                        <td className="px-6 py-4 text-text-dark">{subscriber.name}</td>
                        <td className="px-6 py-4 text-text-medium">{subscriber.email}</td>
                        <td className="px-6 py-4">
                          <Badge variant={subscriber.confirmed ? 'cyan' : 'navy'}>{subscriber.confirmed ? 'Confirmed' : 'Pending'}</Badge>
                        </td>
                        <td className="px-6 py-4 text-text-medium">{formatAdminDate(subscriber.subscribed_at)}</td>
                        <td className="px-6 py-4">
                          <button className="text-error transition-colors duration-200 hover:text-error/80" onClick={() => handleRemoveSubscriber(subscriber.id)} type="button">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default AdminNewsletter
