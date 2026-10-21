import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react"
import { getSchedule, type ScheduleByDate } from "../services/schedule"

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const pad = (n: number) => String(n).padStart(2, "0")

// "2026-10-14", sempre no fuso de Brasília
const todayKey = () =>
  new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })

export function Schedule() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [schedule, setSchedule] = useState<ScheduleByDate>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)

    getSchedule(year, month)
      .then((data) => !cancelled && setSchedule(data))
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [year, month])

  const changeMonth = (delta: number) => {
    const d = new Date(year, month - 1 + delta, 1)
    setYear(d.getFullYear())
    setMonth(d.getMonth() + 1)
  }

  const firstWeekday = new Date(year, month - 1, 1).getDay() // 0 = domingo
  const daysInMonth = new Date(year, month, 0).getDate()
  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  })
  const today = todayKey()

  return (
    <section className="w-full flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <button type="button" onClick={() => changeMonth(-1)} aria-label="Mês anterior" className="cursor-pointer rounded p-1 hover:bg-gray-100">
          <ChevronLeft />
        </button>
        <h2 className="text-1 font-bold capitalize">{monthLabel}</h2>
        <button type="button" onClick={() => changeMonth(1)} aria-label="Próximo mês" className="cursor-pointer rounded p-1 hover:bg-gray-100">
          <ChevronRight />
        </button>
      </header>

      <div className="flex gap-4 caption-1">
        <span className="flex items-center gap-1"><Sun className="h-4 w-4 text-amber-600" /> Diurno (07h às 19h)</span>
        <span className="flex items-center gap-1"><Moon className="h-4 w-4 text-indigo-600" /> Noturno (19h às 07h)</span>
      </div>

      {error && <p role="alert" className="text-alert">Não foi possível carregar a escala.</p>}
      {!loading && !error && Object.keys(schedule).length === 0 && (
        <p className="caption-1">Escala não cadastrada para este mês.</p>
      )}

      <div className={`grid grid-cols-7 gap-1 transition-opacity ${loading ? "opacity-50" : ""}`}>
        {WEEKDAYS.map((w) => (
          <div key={w} className="pb-1 text-center caption-1 font-bold">{w}</div>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />

          const key = `${year}-${pad(month)}-${pad(day)}`
          const slot = schedule[key]
          const isToday = key === today

          return (
            <div
              key={key}
              className={`flex flex-1 min-h-28 flex-col gap-1 rounded-lg border p-1.5 ${i % 2 == 0 ? "bg-zinc-50" : "bg-zinc-100"} ${isToday ? "border-brand ring-2 ring-brand" : "border-gray-3"
                }`}
            >
              <span className={`text-sm font-bold ${isToday ? "text-brand" : ""}`}>{day}</span>

              {slot?.day.length ? (
                <div className="flex items-start gap-1 rounded bg-amber-50 px-1 py-0.5 text-xs text-amber-800">
                  <Sun className="mt-0.5 h-3 w-3 shrink-0" />
                  <span>{slot.day.join(", ")}</span>
                </div>
              ) : null}

              {slot?.night.length ? (
                <div className="flex items-start gap-1 rounded bg-indigo-50 px-1 py-0.5 text-xs text-indigo-800">
                  <Moon className="mt-0.5 h-3 w-3 shrink-0" />
                  <span>{slot.night.join(", ")}</span>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}