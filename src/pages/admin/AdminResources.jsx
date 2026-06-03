// Admin resources manager.

import { Trash2, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import { supabase } from '../../lib/supabase'
import { formatAdminDate, getPublicStoragePath } from './_helpers'

function AdminResources() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [file, setFile] = useState(null)
  const [formData, setFormData] = useState({ category: 'Term Dates', title: '' })

  const loadResources = async () => {
    setLoading(true)
    const { data, error: requestError } = await supabase
      .from('resources')
      .select('id, title, category, file_url, file_name, uploaded_at')
      .order('uploaded_at', { ascending: false })

    if (requestError) {
      setError(requestError.message)
      setResources([])
    } else {
      setResources(data ?? [])
      setError('')
    }

    setLoading(false)
  }

  useEffect(() => {
    loadResources()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleUpload = async (event) => {
    event.preventDefault()

    if (!file) {
      setError('Please choose a file to upload.')
      return
    }

    if (file.size > 25 * 1024 * 1024) {
      setError('Files must be 25MB or smaller.')
      return
    }

    setSaving(true)
    setError('')

    const filePath = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const uploadResult = await supabase.storage.from('resources').upload(filePath, file)

    if (uploadResult.error) {
      setError(uploadResult.error.message)
      setSaving(false)
      return
    }

    const { data: publicUrlData } = supabase.storage.from('resources').getPublicUrl(filePath)
    const insertResult = await supabase.from('resources').insert({
      category: formData.category,
      file_name: file.name,
      file_url: publicUrlData.publicUrl,
      title: formData.title,
    })

    if (insertResult.error) {
      setError(insertResult.error.message)
      setSaving(false)
      return
    }

    setFormData({ category: 'Term Dates', title: '' })
    setFile(null)
    setSaving(false)
    loadResources()
  }

  const handleDelete = async (resource) => {
    if (!window.confirm('Delete this resource?')) {
      return
    }

    const storagePath = getPublicStoragePath(resource.file_url, 'resources')

    if (storagePath) {
      const storageResult = await supabase.storage.from('resources').remove([storagePath])
      if (storageResult.error) {
        setError(storageResult.error.message)
        return
      }
    }

    const deleteResult = await supabase.from('resources').delete().eq('id', resource.id)
    if (deleteResult.error) {
      setError(deleteResult.error.message)
      return
    }

    loadResources()
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-body text-sm font-semibold uppercase tracking-wide text-brand-primary">Resources Manager</p>
        <h1 className="font-display text-4xl text-text-primary">Manage Downloadable Resources</h1>
      </div>

      <Card className="space-y-5">
        <form className="grid gap-5 md:grid-cols-[1fr_220px_1fr_auto] md:items-end" onSubmit={handleUpload}>
          <Input label="Title" name="title" onChange={handleChange} required value={formData.title} />
          <div>
            <label className="mb-2 block font-body text-sm font-medium text-text-primary" htmlFor="resource-category">Category</label>
            <select
              className="w-full rounded-xl border border-brand-gray/30 px-4 py-3 font-body text-text-primary outline-none transition-all duration-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-accent/20"
              id="resource-category"
              name="category"
              onChange={handleChange}
              value={formData.category}
            >
              <option value="Term Dates">Term Dates</option>
              <option value="Circulars">Circulars</option>
              <option value="Forms & Documents">Forms & Documents</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block font-body text-sm font-medium text-text-primary" htmlFor="resource-file">File</label>
            <input
              accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="w-full rounded-xl border border-brand-gray/30 px-4 py-3 font-body text-text-primary"
              id="resource-file"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              required
              type="file"
            />
          </div>
          <Button loading={saving} type="submit" variant="primary">
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </Button>
        </form>
        {error ? <p className="font-body text-sm text-error">{error}</p> : null}
      </Card>

      {loading ? <div className="h-40 animate-pulse rounded-3xl bg-bg-light" /> : null}

      {!loading ? (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-gray/30 font-body text-sm">
              <thead className="bg-bg-light/60 text-left text-text-secondary">
                <tr>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray/30">
                {resources.map((resource) => (
                  <tr key={resource.id}>
                    <td className="px-6 py-4 text-text-primary">{resource.title}</td>
                    <td className="px-6 py-4 text-text-secondary">{resource.category}</td>
                    <td className="px-6 py-4 text-text-secondary">{formatAdminDate(resource.uploaded_at)}</td>
                    <td className="px-6 py-4">
                      <button className="text-error transition-colors duration-200 hover:text-error/80" onClick={() => handleDelete(resource)} type="button">
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
  )
}

export default AdminResources
