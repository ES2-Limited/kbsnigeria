// Animated placeholder mosaic shown when the gallery has no images yet.

import { motion } from 'framer-motion'
import { Image as ImageIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

const tileGradients = [
  'from-brand-gray/40 to-brand-accent/20',
  'from-brand-primary/10 to-brand-purple/20',
  'from-brand-accent/20 to-brand-gray/30',
  'from-brand-purple/20 to-brand-primary/10',
  'from-brand-gray/30 to-brand-accent/30',
  'from-brand-accent/10 to-brand-gray/40',
]

const tileHeights = ['h-56', 'h-40', 'h-48', 'h-40', 'h-56', 'h-44']

function GalleryPlaceholderGrid({ prefersReducedMotion }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {tileGradients.map((gradient, i) => (
        <motion.div
          key={i}
          className={cn(
            'group relative overflow-hidden rounded-2xl bg-gradient-to-br cursor-pointer',
            gradient,
            tileHeights[i],
          )}
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
          whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
        >
          <div className="flex h-full items-center justify-center text-brand-gray">
            <ImageIcon className="h-8 w-8 opacity-60" />
          </div>
          {/* CSS overlay on hover */}
          <div className="absolute inset-0 bg-brand-primary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </motion.div>
      ))}
    </div>
  )
}

export default GalleryPlaceholderGrid
