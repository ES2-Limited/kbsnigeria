// Admin site media manager (hero video, etc.).

import { Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import { invalidateQueryCache } from '../../lib/queryCache'
import { supabase } from '../../lib/supabase'
import { formatAdminDate } from './_helpers'

const KNOWN_KEYS = [
  { key: 'hero_tour_video', label: 'Homepage School Tour Video', type: 'video' },
]

function AdminMedia() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState(null)
  const [error, setError] = useState('')
  const [forms, setForms] = useState({})

  const loadItems = async () => {
    setLoading(true)
    const { data, error: requestError } = await supabase
      .from('site_media')
      .select('id, key, type, embed_url, poster_url, caption, updated_at')
      .order('key', { ascending: true })

    if (requestError) {
      setError(requestError.message)
      setItems([])
    } else {
      const rows = data ?? []
      setItems(rows)
      const nextForms = {}
      for (const known of KNOWN_KEYS) {
        const existing = rows.find((row) => row.key === known.key)
        nextForms[known.key] = {
          caption: existing?.caption || '',
          embed_url: existing?.embed_url || '',
          poster_url: existing?.poster_url || '',
          type: existing?.type || known.type,
        }
      }
      setForms(nextForms)
      setError('')
    }

    setLoading(false)
  }

  useEffect(() => {
    loadItems()
  }, [])

  const handleChange = (key, field, value) => {
    setForms((current) => ({
      ...current,
      [key]: { ...current[key], [field]: value },
    }))
  }

  const handleSave = async (key) => {
    setSavingKey(key)
    setError('')

    const form = forms[key]
    const existing = items.find((item) => item.key === key)

    const payload = {
      caption: form.caption || null,
      embed_url: form.embed_url || null,
      key,
      poster_url: form.poster_url || null,
      type: form.type || 'video',
    }

    const request = existing
      ? supabase.from('site_media').update(payload).eq('id', existing.id)
      : supabase.from('site_media').insert(payload)

    const { error: requestError } = await request

    if (requestError) {
      setError(requestError.message)
      setSavingKey(null)
      return
    }

    setSavingKey(null)
    invalidateQueryCache('site_media')
    invalidateQueryCache('admin')
    loadItems()
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-body text-sm font-semibold uppercase tracking-wide text-brand-primary">Site Media</p>
        <h1 className="font-display text-4xl text-text-primary">Manage Media</h1>
        <p className="mt-2 font-body text-sm text-text-secondary">
          Configure homepage video and other embeddable media assets.
        </p>
      </div>

      {error ? <p className="font-body text-sm text-error">{error}</p> : null}
      {loading ? <div className="h-40 animate-pulse rounded-3xl bg-bg-light" /> : null}

      {!loading ? (
        <div className="space-y-6">
          {KNOWN_KEYS.map((known) => {
            const existing = items.find((item) => item.key === known.key)
            const form = forms[known.key] || {}

            return (
              <Card className="space-y-5" key={known.key}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-body text-lg font-semibold text-text-primary">{known.label}</h2>
                    <p className="font-body text-xs text-text-secondary">
                      Key: <code className="rounded bg-bg-light px-1">{known.key}</code>
                      {existing ? ` · Updated ${formatAdminDate(existing.updated_at)}` : ''}
                    </p>
                  </div>
                </div>
                <Input
                  label="Embed URL (YouTube, Vimeo, or MP4)"
                  onChange={(event) => handleChange(known.key, 'embed_url', event.target.value)}
                  value={form.embed_url || ''}
                />
                <Input
                  label="Poster Image URL"
                  onChange={(event) => handleChange(known.key, 'poster_url', event.target.value)}
                  value={form.poster_url || ''}
                />
                <Input
                  label="Caption"
                  onChange={(event) => handleChange(known.key, 'caption', event.target.value)}
                  value={form.caption || ''}
                />
                <Button loading={savingKey === known.key} onClick={() => handleSave(known.key)} variant="primary">
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </Button>
              </Card>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default AdminMedia
