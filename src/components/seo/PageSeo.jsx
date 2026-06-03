// Shared page SEO metadata.

import { Helmet } from 'react-helmet-async'
import { DEFAULT_OG_IMAGE, SITE_URL } from '../../lib/site'

function toAbsoluteUrl(pathOrUrl) {
  if (!pathOrUrl) {
    return DEFAULT_OG_IMAGE
  }

  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl
  }

  return `${SITE_URL}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`
}

function PageSeo({ canonicalPath = '/', description, image, title, type = 'website' }) {
  const canonicalUrl = toAbsoluteUrl(canonicalPath)
  const ogImage = toAbsoluteUrl(image)

  return (
    <Helmet>
      <title>{title}</title>
      <meta content={description} name="description" />
      <link href={canonicalUrl} rel="canonical" />
      <meta content="index, follow" name="robots" />
      <meta content={title} property="og:title" />
      <meta content={description} property="og:description" />
      <meta content={ogImage} property="og:image" />
      <meta content={canonicalUrl} property="og:url" />
      <meta content={type} property="og:type" />
      <meta content="summary_large_image" name="twitter:card" />
      <meta content={title} name="twitter:title" />
      <meta content={description} name="twitter:description" />
      <meta content={ogImage} name="twitter:image" />
    </Helmet>
  )
}

export default PageSeo
