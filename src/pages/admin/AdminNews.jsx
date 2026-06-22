// Admin news manager.

import DOMPurify from 'dompurify'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import RichTextEditor from '../../components/ui/RichTextEditor'
import { slugify } from '../../lib/slugify'
import { invalidateQueryCache } from '../../lib/queryCache'
import { supabase } from '../../lib/supabase'
import { formatAdminDate } from './_helpers'

function AdminNews() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const isCreateMode = location.pathname.endsWith('/new')
  const isEditMode = Boolean(id)
  const isFormMode = isCreateMode || isEditMode

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(!isFormMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [coverFile, setCoverFile] = useState(null)
  const [formData, setFormData] = useState({
    body: '<p></p>',
    cover_url: '',
    excerpt: '',
    published_at: null,
    slug: '',
    status: 'draft',
    title: '',
  })

  const pageTitle = useMemo(() => {
    if (isCreateMode) {
      return 'Create News Post'
    }

    if (isEditMode) {
      return 'Edit News Post'
    }

    return 'Manage News'
  }, [isCreateMode, isEditMode])

  const loadPosts = async () => {
    setLoading(true)
    const { data, error: requestError } = await supabase
      .from('news_posts')
      .select('id, title, slug, status, created_at, published_at')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (requestError) {
      setError(requestError.message)
      setPosts([])
    } else {
      setPosts(data ?? [])
      setError('')
    }

    setLoading(false)
  }

  useEffect(() => {
    if (!isFormMode) {
      loadPosts()
      return
    }

    if (isEditMode) {
      const loadPost = async () => {
        const { data, error: requestError } = await supabase
          .from('news_posts')
          .select('id, title, slug, excerpt, body, cover_url, status, published_at')
          .eq('id', id)
          .single()

        if (requestError) {
          setError(requestError.message)
          return
        }

        setFormData({
          body: data.body || '<p></p>',
          cover_url: data.cover_url || '',
          excerpt: data.excerpt || '',
          published_at: data.published_at,
          slug: data.slug,
          status: data.status,
          title: data.title,
        })
      }

      loadPost()
    }
  }, [id, isEditMode, isFormMode])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
      ...(name === 'title' ? { slug: slugify(value) } : {}),
    }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    let coverUrl = formData.cover_url

    if (coverFile) {
      const filePath = `${Date.now()}-${coverFile.name.replace(/\s+/g, '-')}`
      const uploadResult = await supabase.storage.from('news-covers').upload(filePath, coverFile)

      if (uploadResult.error) {
        setError(uploadResult.error.message)
        setSaving(false)
        return
      }

      const { data: publicUrlData } = supabase.storage.from('news-covers').getPublicUrl(filePath)
      coverUrl = publicUrlData.publicUrl
    }

    const payload = {
      body: DOMPurify.sanitize(formData.body),
      cover_url: coverUrl || null,
      excerpt: formData.excerpt,
      published_at:
        formData.status === 'published'
          ? formData.published_at || new Date().toISOString()
          : null,
      slug: formData.slug,
      status: formData.status,
      title: formData.title,
    }

    const request = isEditMode
      ? supabase.from('news_posts').update(payload).eq('id', id)
      : supabase.from('news_posts').insert(payload)

    const { error: requestError } = await request

    if (requestError) {
      setError(requestError.message)
      setSaving(false)
      return
    }

    setSaving(false)
    invalidateQueryCache('news')
    invalidateQueryCache('admin')
    navigate('/admin/news')
  }

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this news post?')) {
      return
    }

    const { error: requestError } = await supabase.from('news_posts').delete().eq('id', postId)

    if (requestError) {
      setError(requestError.message)
      return
    }

    invalidateQueryCache('news')
    invalidateQueryCache('admin')
    loadPosts()
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-body text-sm font-semibold uppercase tracking-wide text-brand-primary">News Manager</p>
            <h1 className="font-display text-4xl text-text-primary">{pageTitle}</h1>
          </div>
          <Button as="link" to="/admin/news" variant="secondary">Back to List</Button>
        </div>

        <form className="space-y-6" onSubmit={handleSave}>
          <Card className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Title" name="title" onChange={handleChange} required value={formData.title} />
              <Input helpText="Generated from the title." label="Slug" name="slug" onChange={handleChange} required value={formData.slug} />
            </div>
            <Input label="Excerpt" name="excerpt" onChange={handleChange} value={formData.excerpt} />
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-body text-sm font-medium text-text-primary" htmlFor="news-cover-upload">Cover Image</label>
                <input
                  accept="image/jpeg,image/png,image/webp"
                  className="w-full rounded-xl border border-brand-gray/30 px-4 py-3 font-body text-text-primary"
                  id="news-cover-upload"
                  onChange={(event) => setCoverFile(event.target.files?.[0] ?? null)}
                  type="file"
                />
              </div>
              <div>
                <label className="mb-2 block font-body text-sm font-medium text-text-primary" htmlFor="news-status">Status</label>
                <select
                  className="w-full rounded-xl border border-brand-gray/30 px-4 py-3 font-body text-text-primary outline-none transition-all duration-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-accent/20"
                  id="news-status"
                  name="status"
                  onChange={handleChange}
                  value={formData.status}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            {formData.cover_url ? <img alt="Current news cover" className="h-56 w-full rounded-2xl object-cover" src={formData.cover_url} /> : null}
          </Card>

          <Card className="space-y-5">
            <h2 className="font-body text-lg font-semibold text-text-primary">Post Body</h2>
            <RichTextEditor content={formData.body} onChange={(body) => setFormData((current) => ({ ...current, body }))} />
          </Card>

          {error ? <p className="font-body text-sm text-error">{error}</p> : null}

          <Button loading={saving} size="lg" type="submit" variant="primary">
            Save Post
          </Button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-body text-sm font-semibold uppercase tracking-wide text-brand-primary">News Manager</p>
          <h1 className="font-display text-4xl text-text-primary">Manage News</h1>
        </div>
        <Button as="link" to="/admin/news/new" variant="primary">
          <Plus className="h-4 w-4" />
          <span>Create Post</span>
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
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray/30">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4 text-text-primary">{post.title}</td>
                    <td className="px-6 py-4">
                      <Badge variant={post.status === 'published' ? 'cyan' : 'navy'}>{post.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{formatAdminDate(post.published_at ?? post.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link className="text-brand-primary transition-colors duration-200 hover:text-brand-purple" to={`/admin/news/${post.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button className="text-error transition-colors duration-200 hover:text-error/80" onClick={() => handleDelete(post.id)} type="button">
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

export default AdminNews
