// Admin gallery manager.

import { Trash2, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import Card from '../../components/ui/Card'
import { invalidateQueryCache } from '../../lib/queryCache'
import { supabase } from '../../lib/supabase'

function AdminGallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const loadImages = async () => {
    setLoading(true)
    const { data, error: requestError } = await supabase
      .from('gallery_images')
      .select('id, storage_path, url, caption, uploaded_at')
      .order('uploaded_at', { ascending: false })
      .limit(200)

    if (requestError) {
      setError(requestError.message)
      setImages([])
    } else {
      setImages(data ?? [])
      setError('')
    }

    setLoading(false)
  }

  useEffect(() => {
    loadImages()
  }, [])

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files ?? [])

    if (files.length === 0) {
      return
    }

    const invalidFile = files.find(
      (file) => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024,
    )

    if (invalidFile) {
      setError('Only JPG, PNG, and WEBP files up to 10MB are allowed.')
      return
    }

    setUploading(true)
    setError('')

    for (const file of files) {
      const filePath = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      const uploadResult = await supabase.storage.from('gallery').upload(filePath, file)

      if (uploadResult.error) {
        setError(uploadResult.error.message)
        setUploading(false)
        return
      }

      const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(filePath)
      const insertResult = await supabase.from('gallery_images').insert({
        caption: file.name,
        storage_path: filePath,
        url: publicUrlData.publicUrl,
      })

      if (insertResult.error) {
        setError(insertResult.error.message)
        setUploading(false)
        return
      }
    }

    setUploading(false)
    event.target.value = ''
    invalidateQueryCache('gallery')
    invalidateQueryCache('admin')
    loadImages()
  }

  const handleDelete = async (image) => {
    if (!window.confirm('Delete this gallery image?')) {
      return
    }

    setError('')
    const storageResult = await supabase.storage.from('gallery').remove([image.storage_path])

    if (storageResult.error) {
      setError(storageResult.error.message)
      return
    }

    const deleteResult = await supabase.from('gallery_images').delete().eq('id', image.id)

    if (deleteResult.error) {
      setError(deleteResult.error.message)
      return
    }

    invalidateQueryCache('gallery')
    invalidateQueryCache('admin')
    loadImages()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-body text-sm font-semibold uppercase tracking-wide text-brand-primary">Gallery Manager</p>
          <h1 className="font-display text-4xl text-text-primary">Manage Gallery Images</h1>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-primary px-6 py-3 font-body text-sm font-medium text-white shadow-md transition-colors duration-200 hover:bg-brand-secondary">
          <Upload className="h-4 w-4" />
          <span>{uploading ? 'Uploading...' : 'Upload Images'}</span>
          <input accept="image/jpeg,image/png,image/webp" className="hidden" multiple onChange={handleUpload} type="file" />
        </label>
      </div>

      {error ? <p className="font-body text-sm text-error">{error}</p> : null}

      {loading ? <div className="h-40 bg-gradient-to-r from-brand-gray/20 via-brand-gray/40 to-brand-gray/20 bg-[length:200%_100%] animate-shimmer rounded-3xl" /> : null}

      {!loading ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image) => (
            <Card className="space-y-4 p-4" key={image.id}>
              <img alt={image.caption || 'Gallery image'} className="h-48 w-full rounded-2xl object-cover" src={image.url} />
              <div className="flex items-start justify-between gap-4">
                <p className="font-body text-sm text-text-secondary">{image.caption || 'Untitled image'}</p>
                <button aria-label={`Delete image "${image.caption || 'Untitled image'}"`} className="text-error transition-colors duration-200 hover:text-error/80" onClick={() => handleDelete(image)} type="button">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default AdminGallery
