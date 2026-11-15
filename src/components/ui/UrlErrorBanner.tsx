// Assisted by Codex (SI) — reviewed by pendiente
// Assisted by Antigravity (SI) — reviewed by Luissmont
import { CircleAlert, X } from 'lucide-react'

interface UrlErrorBannerProps {
  message: string
  onDismiss: () => void
}

export function UrlErrorBanner({ message, onDismiss }: UrlErrorBannerProps) {
  return (
    <aside
      aria-label="Coordinate error alert"
      className="pointer-events-auto flex items-center justify-between gap-3 rounded-xl bg-red-950/80 backdrop-blur-md border border-red-500/40 px-4 py-2.5 shadow-[0_4px_24px_rgba(239,68,68,0.2)] text-xs font-mono text-red-200"
    >
      <div className="flex items-center gap-2.5">
        <CircleAlert aria-hidden="true" className="h-4 w-4 text-red-400 shrink-0" />
        <span>
          <strong className="font-semibold text-red-300">URL Coordinate Error:</strong> {message} (Reverted to default field)
        </span>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="rounded-lg p-1 text-red-400 hover:text-red-100 hover:bg-red-900/50 transition-colors cursor-pointer"
        aria-label="Dismiss error notification"
      >
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
    </aside>
  )
}

