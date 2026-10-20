export function formatDateTime(value: string | Date) {
  const d = new Date(value)
  const date = d.toLocaleDateString('pt-BR')
  const hour = String(d.getHours()).padStart(2, '0')
  const minutes = d.getMinutes()
  const time = minutes
    ? `${hour}h${String(minutes).padStart(2, '0')}`
    : `${hour}h`
  return `${date} às ${time}`
}

export function getShift(value: string | Date, withDate = false) {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(value))

  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)!.value)

  const hour = get("hour")
  const isDay = hour >= 7 && hour < 19
  const shift = isDay ? "7h às 19h" : "19h às 07h"

  if (!withDate) return shift

  const start = new Date(Date.UTC(get("year"), get("month") - 1, get("day")))
  if (hour < 7) start.setUTCDate(start.getUTCDate() - 1)

  const date = start.toLocaleDateString("pt-BR", { timeZone: "UTC" })

  return `${date} - ${shift}`
}

export function getShiftKey(value: string | Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(value))

  const get = (type: string) => parts.find((p) => p.type === type)!.value

  const hour = Number(get("hour"))
  const period: "day" | "night" = hour >= 7 && hour < 19 ? "day" : "night"

  const start = new Date(Date.UTC(Number(get("year")), Number(get("month")) - 1, Number(get("day"))))
  if (hour < 7) start.setUTCDate(start.getUTCDate() - 1)

  return { shiftDate: start.toISOString().slice(0, 10), period }
}

export type ShiftKey = ReturnType<typeof getShiftKey>

// Plantão que terminou logo antes do informado
export function previousShift({ shiftDate, period }: ShiftKey): ShiftKey {
  // o anterior do noturno do dia D é o diurno do dia D
  if (period === "night") return { shiftDate, period: "day" }

  // o anterior do diurno do dia D é o noturno do dia D-1
  const d = new Date(`${shiftDate}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - 1)
  return { shiftDate: d.toISOString().slice(0, 10), period: "night" }
}

// Intervalo de tempo (início e fim) de um plantão, para filtrar occurred_at
export function shiftRange({ shiftDate, period }: ShiftKey) {
  const startHour = period === "day" ? "07" : "19"
  const start = new Date(`${shiftDate}T${startHour}:00:00-03:00`)
  const end = new Date(start.getTime() + 12 * 60 * 60 * 1000)

  return { start: start.toISOString(), end: end.toISOString() }
}