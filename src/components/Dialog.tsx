import { useEffect, useRef, type ReactNode } from 'react'

type DialogProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

export function Dialog({ open, onClose, title, children, footer }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose} // dispara com Esc e com close()
      onClick={(e) => {
        // clique no backdrop (fora do conteúdo) fecha
        if (e.target === ref.current) onClose()
      }}
      className="m-auto w-full max-w-lg rounded-2xl bg-white p-0 shadow-xl backdrop:bg-black/50"
    >
      <div className="flex flex-col gap-4 p-6">
        <header className="flex items-start justify-between gap-4">
          <h2 className="text-title-3 text-grey-0">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded p-1 text-grey-2 hover:text-grey-0"
          >
            ✕
          </button>
        </header>

        <div className="text-text-2 text-grey-1">{children}</div>

        {footer && <footer className="flex justify-end gap-2">{footer}</footer>}
      </div>
    </dialog>
  )
}