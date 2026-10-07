// Admin testimonials manager.

import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import { invalidateQueryCache } from '../../lib/queryCache'
import { supabase } from '../../lib/supabase'
import { formatAdminDate } from './_helpers'

const emptyForm = {
  featured: false,
  name: '',
  photo_url: '',
  quote: '',
  role: '',
  sort_order: 0,
  tier: '',
  video_url: '',
}

function AdminTestimonials() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)

  const loadItems = async () => {
    setLoading(true)
    const { data, error: requestError } = await supabase
      .from('testimonials')
      .select('id, name, role, quote, video_url, photo_url, tier, featured, sort_order, created_at')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (requestError) {
      setError(requestError.message)
      setItems([])
    } else {
      setItems(data ?? [])
      setError('')
    }

    setLoading(false)
  }

  useEffect(() => {
    loadItems()
  }, [])

  const resetForm = () => {
    setFormData(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({
      featured: item.featured,
      name: item.name,
      photo_url: item.photo_url || '',
      quote: item.quote,
      role: item.role || '',
      sort_order: item.sort_order ?? 0,
      tier: item.tier || '',
      video_url: item.video_url || '',
    })
    setShowForm(true)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      featured: formData.featured,
      name: formData.name,
      photo_url: formData.photo_url || null,
      quote: formData.quote,
      role: formData.role || null,
      sort_order: Number(formData.sort_order) || 0,
      tier: formData.tier || null,
      video_url: formData.video_url || null,
    }

    const request = editingId
      ? supabase.from('testimonials').update(payload).eq('id', editingId)
      : supabase.from('testimonials').insert(payload)

    const { error: requestError } = await request

    if (requestError) {
      setError(requestError.message)
      setSaving(false)
      return
    }

    setSaving(false)
    invalidateQueryCache('testimonials')
    invalidateQueryCache('admin')
    resetForm()
    loadItems()
  }

  const handleDelete = async (itemId) => {
    if (!window.confirm('Delete this testimonial?')) {
      return
    }

    const { error: requestError } = await supabase.from('testimonials').delete().eq('id', itemId)

    if (requestError) {
      setError(requestError.message)
      return
    }

    invalidateQueryCache('testimonials')
    invalidateQueryCache('admin')
    loadItems()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-body text-sm font-semibold uppercase tracking-wide text-brand-primary">Testimonials</p>
          <h1 className="font-display text-4xl text-text-primary">Manage Testimonials</h1>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingId(null); setFormData(emptyForm) }} variant="primary">
          <Plus className="h-4 w-4" />
          <span>Add Testimonial</span>
        </Button>
      </div>

      {error ? <p className="font-body text-sm text-error">{error}</p> : null}

      {showForm ? (
        <form className="space-y-6" onSubmit={handleSave}>
          <Card className="space-y-5">
            <h2 className="font-body text-lg font-semibold text-text-primary">
              {editingId ? 'Edit Testimonial' : 'New Testimonial'}
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Name" name="name" onChange={handleChange} required value={formData.name} />
              <Input label="Role" name="role" onChange={handleChange} placeholder="Parent, Primary student" value={formData.role} />
            </div>
            <div>
              <label className="mb-2 block font-body text-sm font-medium text-text-primary" htmlFor="testimonial-quote">Quote</label>
              <textarea
                className="min-h-28 w-full rounded-xl border border-brand-gray/30 px-4 py-3 font-body text-text-primary outline-none transition-all duration-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-accent/20"
                id="testimonial-quote"
                name="quote"
                onChange={handleChange}
                required
                value={formData.quote}
              />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Photo URL" name="photo_url" onChange={handleChange} value={formData.photo_url} />
              <Input label="Video URL (optional)" name="video_url" onChange={handleChange} value={formData.video_url} />
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <Input label="Tier" name="tier" onChange={handleChange} placeholder="parent, student" value={formData.tier} />
              <Input label="Sort Order" name="sort_order" onChange={handleChange} type="number" value={formData.sort_order} />
              <label className="flex items-center gap-3 pt-8 font-body text-sm text-text-primary">
                <input checked={formData.featured} name="featured" onChange={handleChange} type="checkbox" />
                Featured on homepage
              </label>
            </div>
            <div className="flex gap-3">
              <Button loading={saving} type="submit" variant="primary">Save</Button>
              <Button onClick={resetForm} type="button" variant="secondary">Cancel</Button>
            </div>
          </Card>
        </form>
      ) : null}

      {loading ? <div className="h-40 animate-pulse rounded-3xl bg-bg-light" /> : null}

      {!loading ? (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-gray/30 font-body text-sm">
              <thead className="bg-bg-light/60 text-left text-text-secondary">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Featured</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray/30">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-text-primary">{item.name}</td>
                    <td className="px-6 py-4 text-text-secondary">{item.role || '—'}</td>
                    <td className="px-6 py-4">
                      <Badge variant={item.featured ? 'cyan' : 'navy'}>{item.featured ? 'Yes' : 'No'}</Badge>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{formatAdminDate(item.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button className="text-brand-primary transition-colors duration-200 hover:text-brand-purple" onClick={() => handleEdit(item)} type="button">
                          <Pencil className="h-4 w-4" />
                        </button>
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

export default AdminTestimonials
