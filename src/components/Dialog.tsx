import { useEffect, useRef } from 'react'
import type { DialogProps } from '../types'
import { X } from 'lucide-react'

export function Dialog({ dialog }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  const closeDialog = () => {
    dialog.onClose && dialog.onClose()
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
      onClose={dialog.onClose} // dispara com Esc e com close()
      onClick={(e) => {
        // clique no backdrop (fora do conteúdo) fecha
        if (e.target === ref.current) closeDialog()
      }}
      className="m-auto w-fit max-w-4xl rounded-2xl bg-white p-0 shadow-xl backdrop:bg-black/50"
    >
      <div className="flex flex-col">
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

        <div className="text-2 p-4">{dialog.children}</div>
      </div>
    </dialog>
  )
}