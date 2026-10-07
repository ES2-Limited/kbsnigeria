// Admin events manager.

import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import { slugify } from '../../lib/slugify'
import { invalidateQueryCache } from '../../lib/queryCache'
import { supabase } from '../../lib/supabase'
import { formatAdminDate } from './_helpers'

function AdminEvents() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const isCreateMode = location.pathname.endsWith('/new')
  const isEditMode = Boolean(id)
  const isFormMode = isCreateMode || isEditMode

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(!isFormMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    cta_label: '',
    cta_url: '',
    description: '',
    event_date: '',
    featured: false,
    slug: '',
    status: 'draft',
    title: '',
    type: '',
  })

  const pageTitle = useMemo(() => {
    if (isCreateMode) return 'Create Event'
    if (isEditMode) return 'Edit Event'
    return 'Manage Events'
  }, [isCreateMode, isEditMode])

  const loadEvents = async () => {
    setLoading(true)
    const { data, error: requestError } = await supabase
      .from('events')
      .select('id, title, slug, type, event_date, status, featured, created_at')
      .order('event_date', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (requestError) {
      setError(requestError.message)
      setEvents([])
    } else {
      setEvents(data ?? [])
      setError('')
    }

    setLoading(false)
  }

  useEffect(() => {
    if (!isFormMode) {
      loadEvents()
      return
    }

    if (isEditMode) {
      const loadEvent = async () => {
        const { data, error: requestError } = await supabase
          .from('events')
          .select('id, title, slug, type, event_date, description, cta_label, cta_url, featured, status')
          .eq('id', id)
          .single()

        if (requestError) {
          setError(requestError.message)
          return
        }

        setFormData({
          cta_label: data.cta_label || '',
          cta_url: data.cta_url || '',
          description: data.description || '',
          event_date: data.event_date ? data.event_date.slice(0, 16) : '',
          featured: data.featured,
          slug: data.slug,
          status: data.status,
          title: data.title,
          type: data.type || '',
        })
      }

      loadEvent()
    }
  }, [id, isEditMode, isFormMode])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' ? { slug: slugify(value) } : {}),
    }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      cta_label: formData.cta_label || null,
      cta_url: formData.cta_url || null,
      description: formData.description || null,
      event_date: formData.event_date ? new Date(formData.event_date).toISOString() : null,
      featured: formData.featured,
      slug: formData.slug,
      status: formData.status,
      title: formData.title,
      type: formData.type || null,
    }

    const request = isEditMode
      ? supabase.from('events').update(payload).eq('id', id)
      : supabase.from('events').insert(payload)

    const { error: requestError } = await request

    if (requestError) {
      setError(requestError.message)
      setSaving(false)
      return
    }

    setSaving(false)
    invalidateQueryCache('events')
    invalidateQueryCache('admin')
    navigate('/admin/events')
  }

  const handleDelete = async (eventId) => {
    if (!window.confirm('Delete this event?')) {
      return
    }

    const { error: requestError } = await supabase.from('events').delete().eq('id', eventId)

    if (requestError) {
      setError(requestError.message)
      return
    }

    invalidateQueryCache('events')
    invalidateQueryCache('admin')
    loadEvents()
  }

  if (isFormMode) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-body text-sm font-semibold uppercase tracking-wide text-brand-primary">Events Manager</p>
            <h1 className="font-display text-4xl text-text-primary">{pageTitle}</h1>
          </div>
          <Button as="link" to="/admin/events" variant="secondary">Back to List</Button>
        </div>

        <form className="space-y-6" onSubmit={handleSave}>
          <Card className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Title" name="title" onChange={handleChange} required value={formData.title} />
              <Input helpText="Generated from the title." label="Slug" name="slug" onChange={handleChange} required value={formData.slug} />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Event Type" name="type" onChange={handleChange} placeholder="Open Day, Exhibition" value={formData.type} />
              <Input label="Event Date" name="event_date" onChange={handleChange} type="datetime-local" value={formData.event_date} />
            </div>
            <div>
              <label className="mb-2 block font-body text-sm font-medium text-text-primary" htmlFor="event-description">Description</label>
              <textarea
                className="min-h-28 w-full rounded-xl border border-brand-gray/30 px-4 py-3 font-body text-text-primary outline-none transition-all duration-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-accent/20"
                id="event-description"
                name="description"
                onChange={handleChange}
                value={formData.description}
              />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="CTA Label" name="cta_label" onChange={handleChange} placeholder="Register Interest" value={formData.cta_label} />
              <Input label="CTA URL" name="cta_url" onChange={handleChange} placeholder="https:// or /contact" value={formData.cta_url} />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-body text-sm font-medium text-text-primary" htmlFor="event-status">Status</label>
                <select
                  className="w-full rounded-xl border border-brand-gray/30 px-4 py-3 font-body text-text-primary outline-none transition-all duration-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-accent/20"
                  id="event-status"
                  name="status"
                  onChange={handleChange}
                  value={formData.status}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <label className="flex items-center gap-3 pt-8 font-body text-sm text-text-primary">
                <input checked={formData.featured} name="featured" onChange={handleChange} type="checkbox" />
                Featured on homepage
              </label>
            </div>
          </Card>

          {error ? <p className="font-body text-sm text-error">{error}</p> : null}

          <Button loading={saving} size="lg" type="submit" variant="primary">
            Save Event
          </Button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-body text-sm font-semibold uppercase tracking-wide text-brand-primary">Events Manager</p>
          <h1 className="font-display text-4xl text-text-primary">Manage Events</h1>
        </div>
        <Button as="link" to="/admin/events/new" variant="primary">
          <Plus className="h-4 w-4" />
          <span>Create Event</span>
        </Button>
      </div>

      {error ? <p className="font-body text-sm text-error">{error}</p> : null}
      {loading ? <div className="h-40 animate-pulse rounded-3xl bg-bg-light" /> : null}

      {!loading ? (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-gray/30 font-body text-sm">
              <thead className="bg-bg-light/60 text-left text-text-secondary">
                <tr>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray/30">
                {events.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-text-primary">{item.title}</td>
                    <td className="px-6 py-4 text-text-secondary">{item.type || '—'}</td>
                    <td className="px-6 py-4 text-text-secondary">{formatAdminDate(item.event_date ?? item.created_at)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={item.status === 'published' ? 'cyan' : 'navy'}>{item.status}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link className="text-brand-primary transition-colors duration-200 hover:text-brand-purple" to={`/admin/events/${item.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button className="text-error transition-colors duration-200 hover:text-error/80" onClick={() => handleDelete(item.id)} type="button">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}
    </div>
  )
}

export default AdminEvents
