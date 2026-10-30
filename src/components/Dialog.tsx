import { useEffect, useRef } from 'react'
import type { DialogProps } from '../types'
import { X } from 'lucide-react'

export function Dialog({ dialog }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  const closeDialog = () => {
    dialog.onClose?.()
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (dialog.isOpen && !el.open) el.showModal()
    if (!dialog.isOpen && el.open) el.close()
  }, [dialog.isOpen])

  return (
    <dialog
      ref={ref}
      onClose={dialog.onClose}
      onClick={(e) => {
        if (e.target === ref.current) closeDialog()
      }}
      className="animated-dialog m-auto rounded-2xl bg-white p-0 shadow-xl"
    >
      <div className="flex flex-col min-h-133 max-h-[90vh] max-w-[80vw]">
        <header className="p-4 gap-4 flex items-center justify-between border-b border-gray-3">
          {dialog.title && <h2 className="text-1 font-bold whitespace-nowrap">{dialog.title}</h2>}
          <button
            type="button"
            onClick={closeDialog}
            aria-label="Fechar"
            className="cursor-pointer"
          >
            <X />
          </button>
        </header>

        <div className="text-2 p-4 overflow-y-auto">{dialog.children}</div>
      </div>
    </dialog>
  )
}