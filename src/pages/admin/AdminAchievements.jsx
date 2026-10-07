// Admin achievements manager.

import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import { invalidateQueryCache } from '../../lib/queryCache'
import { supabase } from '../../lib/supabase'

const emptyForm = {
  category: '',
  description: '',
  featured: false,
  image_url: '',
  sort_order: 0,
  title: '',
  year: '',
}

function AdminAchievements() {
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
      .from('achievements')
      .select('id, title, category, year, description, image_url, featured, sort_order, created_at')
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
      category: item.category || '',
      description: item.description || '',
      featured: item.featured,
      image_url: item.image_url || '',
      sort_order: item.sort_order ?? 0,
      title: item.title,
      year: item.year ?? '',
    })
    setShowForm(true)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      category: formData.category || null,
      description: formData.description || null,
      featured: formData.featured,
      image_url: formData.image_url || null,
      sort_order: Number(formData.sort_order) || 0,
      title: formData.title,
      year: formData.year ? Number(formData.year) : null,
    }

    const request = editingId
      ? supabase.from('achievements').update(payload).eq('id', editingId)
      : supabase.from('achievements').insert(payload)

    const { error: requestError } = await request

    if (requestError) {
      setError(requestError.message)
      setSaving(false)
      return
    }

    setSaving(false)
    invalidateQueryCache('achievements')
    invalidateQueryCache('admin')
    resetForm()
    loadItems()
  }

  const handleDelete = async (itemId) => {
    if (!window.confirm('Delete this achievement?')) {
      return
    }

    const { error: requestError } = await supabase.from('achievements').delete().eq('id', itemId)

    if (requestError) {
      setError(requestError.message)
      return
    }

    invalidateQueryCache('achievements')
    invalidateQueryCache('admin')
    loadItems()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-body text-sm font-semibold uppercase tracking-wide text-brand-primary">Achievements</p>
          <h1 className="font-display text-4xl text-text-primary">Manage Outcomes</h1>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingId(null); setFormData(emptyForm) }} variant="primary">
          <Plus className="h-4 w-4" />
          <span>Add Achievement</span>
        </Button>
      </div>

      {error ? <p className="font-body text-sm text-error">{error}</p> : null}

      {showForm ? (
        <form className="space-y-6" onSubmit={handleSave}>
          <Card className="space-y-5">
            <h2 className="font-body text-lg font-semibold text-text-primary">
              {editingId ? 'Edit Achievement' : 'New Achievement'}
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Title" name="title" onChange={handleChange} required value={formData.title} />
              <Input label="Category" name="category" onChange={handleChange} placeholder="Academics, Sports" value={formData.category} />
            </div>
            <div>
              <label className="mb-2 block font-body text-sm font-medium text-text-primary" htmlFor="achievement-description">Description</label>
              <textarea
                className="min-h-24 w-full rounded-xl border border-brand-gray/30 px-4 py-3 font-body text-text-primary outline-none transition-all duration-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-accent/20"
                id="achievement-description"
                name="description"
                onChange={handleChange}
                value={formData.description}
              />
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <Input label="Year" name="year" onChange={handleChange} type="number" value={formData.year} />
              <Input label="Image URL" name="image_url" onChange={handleChange} value={formData.image_url} />
              <Input label="Sort Order" name="sort_order" onChange={handleChange} type="number" value={formData.sort_order} />
            </div>
            <label className="flex items-center gap-3 font-body text-sm text-text-primary">
              <input checked={formData.featured} name="featured" onChange={handleChange} type="checkbox" />
              Featured on homepage
            </label>
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
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Year</th>
                  <th className="px-6 py-4 font-medium">Featured</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray/30">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-text-primary">{item.title}</td>
                    <td className="px-6 py-4 text-text-secondary">{item.category || '—'}</td>
                    <td className="px-6 py-4 text-text-secondary">{item.year || '—'}</td>
                    <td className="px-6 py-4">
                      <Badge variant={item.featured ? 'cyan' : 'navy'}>{item.featured ? 'Yes' : 'No'}</Badge>
                    </td>
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

export default AdminAchievements
