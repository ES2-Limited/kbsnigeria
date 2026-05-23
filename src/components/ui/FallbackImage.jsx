import { useEffect, useState } from 'react'

function FallbackImage({ src, fallbackSrc = '/kbs-logo.png', alt, onError, ...props }) {
  const [currentSrc, setCurrentSrc] = useState(src)

  useEffect(() => {
    setCurrentSrc(src)
  }, [src])

  const handleError = (event) => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
    }

    if (typeof onError === 'function') {
      onError(event)
    }
  }

  return <img alt={alt} src={currentSrc} onError={handleError} {...props} />
}

export default FallbackImage
