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