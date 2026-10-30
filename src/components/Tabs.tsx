import { useId, useRef, type KeyboardEvent } from "react"
import type { TabsProps } from "../types"

export function Tabs<T extends string>({ label, tabs, value, onChange }: TabsProps<T>) {
  const baseId = useId()
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({})

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    const last = tabs.length - 1
    const next =
      e.key === "ArrowRight" ? (index === last ? 0 : index + 1)
        : e.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
          : e.key === "Home" ? 0
            : e.key === "End" ? last
              : null

    if (next === null) return
    e.preventDefault()
    onChange(tabs[next].id)
    buttons.current[tabs[next].id]?.focus()
  }

  return (
    <div className="flex flex-col gap-8 h-full">
      <div role="tablist" aria-label={label} className="flex gap-4 border-b border-gray-3">
        {tabs.map((tab, i) => {
          const selected = tab.id === value
          return (
            <button
              key={tab.id}
              ref={(el) => { buttons.current[tab.id] = el }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={`-mb-px cursor-pointer border-b-2 px-1 pb-2 text-2 transition-colors ${selected ? "border-brand font-bold text-black" : "border-transparent text-gray-1 hover:text-black"
                }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={tab.id !== value}
        >
          {tab.panel}
        </div>
      ))}
    </div>
  )
}