// Resource list item with file icon and download action.

import { Download, File, FileSpreadsheet, FileText } from 'lucide-react'
import Badge from './Badge'
import Button from './Button'
import { cn } from '../../lib/cn'

const categoryVariantMap = {
  'Term Dates': 'cyan',
  Circulars: 'purple',
  'Forms & Documents': 'navy',
}

function getFileIcon(fileType) {
  const normalizedType = fileType?.toLowerCase()

  if (normalizedType === 'pdf') {
    return FileText
  }

  if (normalizedType === 'docx' || normalizedType === 'doc') {
    return FileText
  }

  if (normalizedType === 'xlsx' || normalizedType === 'xls') {
    return FileSpreadsheet
  }

  return File
}

function ResourceItem({ category, className, date, downloadUrl, fileType, title }) {
  const FileIcon = getFileIcon(fileType)

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-2xl border border-surface-grey bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-grey text-kbs-navy">
          <FileIcon className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h3 className="font-body text-lg font-semibold text-text-dark">{title}</h3>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-body text-sm text-text-medium">{date}</span>
            <Badge variant={categoryVariantMap[category] ?? 'navy'}>{category}</Badge>
          </div>
        </div>
      </div>
      <Button as="a" href={downloadUrl} rel="noreferrer" target="_blank" variant="secondary">
        <Download className="h-4 w-4" />
        <span>Download</span>
      </Button>
    </div>
  )
}

export default ResourceItem
