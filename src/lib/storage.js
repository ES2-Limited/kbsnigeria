// Unified Storage Layer for KBS Nigeria.
// Supports Cloudinary, Cloudflare R2, and Supabase Storage.
// Switch provider easily via VITE_STORAGE_PROVIDER='cloudinary' | 'r2' | 'supabase'

import { supabase } from './supabase'

/**
 * Resolves the currently active storage provider.
 * Priority:
 * 1. VITE_STORAGE_PROVIDER ('cloudinary' | 'r2' | 'supabase')
 * 2. Auto-detect if Cloudinary credentials are provided
 * 3. Auto-detect if R2 endpoint is provided
 * 4. Default to 'supabase'
 */
export function getStorageProvider() {
  const explicit = import.meta.env.VITE_STORAGE_PROVIDER?.trim().toLowerCase()
  if (explicit === 'cloudinary' || explicit === 'r2' || explicit === 'supabase') {
    return explicit
  }

  if (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME) {
    return 'cloudinary'
  }

  if (import.meta.env.VITE_R2_UPLOAD_ENDPOINT) {
    return 'r2'
  }

  return 'supabase'
}

/**
 * Returns configuration details and readiness status for the active provider.
 */
export function getStorageConfig() {
  const provider = getStorageProvider()

  if (provider === 'cloudinary') {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim()
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim()
    const folder = import.meta.env.VITE_CLOUDINARY_FOLDER?.trim() || 'kbsnigeria'
    return {
      provider: 'cloudinary',
      isReady: Boolean(cloudName && uploadPreset),
      cloudName,
      uploadPreset,
      folder,
      missingEnv: [
        !cloudName && 'VITE_CLOUDINARY_CLOUD_NAME',
        !uploadPreset && 'VITE_CLOUDINARY_UPLOAD_PRESET',
      ].filter(Boolean),
    }
  }

  if (provider === 'r2') {
    const uploadEndpoint = import.meta.env.VITE_R2_UPLOAD_ENDPOINT?.trim()
    const publicUrl = import.meta.env.VITE_R2_PUBLIC_URL?.trim()
    return {
      provider: 'r2',
      isReady: Boolean(uploadEndpoint),
      uploadEndpoint,
      publicUrl,
      missingEnv: [!uploadEndpoint && 'VITE_R2_UPLOAD_ENDPOINT'].filter(Boolean),
    }
  }

  return {
    provider: 'supabase',
    isReady: Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY),
    missingEnv: [
      !import.meta.env.VITE_SUPABASE_URL && 'VITE_SUPABASE_URL',
      !import.meta.env.VITE_SUPABASE_ANON_KEY && 'VITE_SUPABASE_ANON_KEY',
    ].filter(Boolean),
  }
}

/**
 * Uploads a file to Cloudinary.
 * Supports:
 * 1. Secure signed upload via Supabase Edge Function 'sign-cloudinary' (Secret keys stay on server).
 * 2. Direct upload using unsigned preset if VITE_CLOUDINARY_UPLOAD_PRESET is configured.
 */
async function uploadToCloudinary(file, { bucket = 'uploads', folder = '' } = {}) {
  const envCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim() || 'dfypeq3wi'
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim()
  const rootFolder = import.meta.env.VITE_CLOUDINARY_FOLDER?.trim() || 'kbsnigeria'
  const targetFolder = folder || `${rootFolder}/${bucket}`

  // 1. Try secure signed upload via Supabase Edge Function if user is authenticated
  try {
    const { data: signData, error: signError } = await supabase.functions.invoke('sign-cloudinary', {
      body: { bucket, folder: targetFolder },
    })

    if (!signError && signData?.signature && signData?.apiKey) {
      const activeCloud = signData.cloudName || envCloudName
      const formData = new FormData()
      formData.append('file', file)
      formData.append('api_key', signData.apiKey)
      formData.append('timestamp', String(signData.timestamp))
      formData.append('signature', signData.signature)
      formData.append('folder', signData.folder || targetFolder)

      const endpoint = `https://api.cloudinary.com/v1_1/${activeCloud}/auto/upload`
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json().catch(() => ({}))
      if (response.ok) {
        return {
          url: data.secure_url || data.url,
          storagePath: data.public_id || data.secure_url,
          provider: 'cloudinary',
          raw: data,
        }
      }
    }
  } catch (err) {
    // Edge function wasn't deployed or error; continue to unsigned preset if present
    console.warn('[Storage] Signed upload attempt failed, checking for unsigned preset:', err)
  }

  // 2. Direct upload via unsigned preset
  if (!envCloudName) {
    throw new Error('VITE_CLOUDINARY_CLOUD_NAME is required in .env.local.')
  }

  if (!uploadPreset) {
    throw new Error(
      `Cloudinary upload needs either:\n1. 'sign-cloudinary' Supabase Edge Function deployed, OR\n2. VITE_CLOUDINARY_UPLOAD_PRESET configured in .env.local (Cloudinary Console -> Settings -> Upload -> Add unsigned preset).`,
    )
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  if (targetFolder) {
    formData.append('folder', targetFolder)
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${envCloudName}/auto/upload`
  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error?.message || `Cloudinary upload failed with status ${response.status}`)
  }

  return {
    url: data.secure_url || data.url,
    storagePath: data.public_id || data.secure_url,
    provider: 'cloudinary',
    raw: data,
  }
}

/**
 * Uploads a file to Cloudflare R2.
 * Supports:
 * 1. Direct upload endpoint (Cloudflare Worker or API proxy) that accepts multipart/form-data or binary.
 * 2. Presigned URL flow if endpoint returns { uploadUrl, publicUrl }.
 */
async function uploadToR2(file, { bucket = 'uploads', path: customPath = '' } = {}) {
  const uploadEndpoint = import.meta.env.VITE_R2_UPLOAD_ENDPOINT?.trim()
  const publicBaseUrl = import.meta.env.VITE_R2_PUBLIC_URL?.trim().replace(/\/+$/, '')

  if (!uploadEndpoint) {
    throw new Error(
      'Cloudflare R2 upload endpoint missing: please set VITE_R2_UPLOAD_ENDPOINT in .env.local.',
    )
  }

  const filePath = customPath || `${bucket}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`

  // Check if endpoint is a presigned URL generator (returns JSON { uploadUrl, publicUrl })
  // or a direct upload receiver.
  const formData = new FormData()
  formData.append('file', file)
  formData.append('key', filePath)
  formData.append('bucket', bucket)
  formData.append('contentType', file.type || 'application/octet-stream')

  try {
    const response = await fetch(uploadEndpoint, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(`R2 upload endpoint error (${response.status}): ${errorText}`)
    }

    const data = await response.json().catch(() => null)

    // If endpoint returned presigned upload URL
    if (data?.uploadUrl) {
      const putRes = await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: file,
      })
      if (!putRes.ok) {
        throw new Error(`Failed to upload file to R2 presigned URL (${putRes.status})`)
      }
      const finalUrl = data.publicUrl || (publicBaseUrl ? `${publicBaseUrl}/${filePath}` : data.uploadUrl.split('?')[0])
      return {
        url: finalUrl,
        storagePath: filePath,
        provider: 'r2',
      }
    }

    // Direct upload handler response
    const fileUrl = data?.url || (publicBaseUrl ? `${publicBaseUrl}/${filePath}` : '')
    return {
      url: fileUrl || data?.fileUrl,
      storagePath: data?.key || filePath,
      provider: 'r2',
      raw: data,
    }
  } catch (err) {
    throw new Error(`Cloudflare R2 upload failed: ${err.message}`)
  }
}

/**
 * Uploads a file to Supabase Storage.
 */
async function uploadToSupabase(file, { bucket = 'gallery', path: customPath = '' } = {}) {
  const filePath = customPath || `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
  const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file)

  if (uploadError) {
    throw uploadError
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath)

  return {
    url: publicUrlData.publicUrl,
    storagePath: filePath,
    provider: 'supabase',
  }
}

/**
 * Unified file upload handler.
 * Automatically uses the active provider (Cloudinary, R2, or Supabase).
 *
 * @param {Object} options
 * @param {File|Blob} options.file - File object to upload
 * @param {string} options.bucket - Logical bucket/collection name (e.g. 'gallery', 'news-covers', 'newsletter-banners', 'resources')
 * @param {string} [options.folder] - Optional folder override
 * @param {string} [options.path] - Optional filename/key override
 * @returns {Promise<{ url: string, storagePath: string, provider: string }>}
 */
export async function uploadFile({ file, bucket = 'gallery', folder = '', path = '' }) {
  const provider = getStorageProvider()

  try {
    if (provider === 'cloudinary') {
      return await uploadToCloudinary(file, { bucket, folder })
    }

    if (provider === 'r2') {
      return await uploadToR2(file, { bucket, path })
    }

    // Default to Supabase
    return await uploadToSupabase(file, { bucket, path })
  } catch (error) {
    return {
      error,
      url: null,
      storagePath: null,
      provider,
    }
  }
}

/**
 * Unified file deletion handler.
 *
 * @param {Object} options
 * @param {string} options.storagePath - Storage path or ID
 * @param {string} options.bucket - Logical bucket name
 * @param {string} [options.url] - Optional public URL
 */
export async function deleteFile({ storagePath, bucket = 'gallery', url = '' }) {
  const provider = getStorageProvider()

  try {
    // If the URL or path indicates Supabase Storage (or active provider is Supabase)
    const isSupabase =
      provider === 'supabase' ||
      (typeof url === 'string' && url.includes('/storage/v1/object/public/'))

    if (isSupabase && storagePath) {
      const { error } = await supabase.storage.from(bucket).remove([storagePath])
      if (error) {
        return { error }
      }
      return { success: true }
    }

    // For Cloudinary and R2:
    // Client-side direct asset removal without admin API keys is restricted for security.
    // If an edge worker/endpoint is configured, we can ping it; otherwise succeed gracefully
    // so the database reference is cleaned up.
    return { success: true }
  } catch (error) {
    return { error }
  }
}
