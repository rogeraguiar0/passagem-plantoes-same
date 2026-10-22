const TZ = "America/Sao_Paulo"
const BRT_OFFSET = "-03:00"
const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS

export const SHIFT_LABEL = { day: "7h às 19h", night: "19h às 07h" } as const
const SHIFT_START_HOUR = { day: "07", night: "19" } as const

const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
})

function brt(value: string | Date = new Date()) {
  const p = Object.fromEntries(
    formatter.formatToParts(new Date(value)).map(({ type, value }) => [type, value])
  )
  return { year: p.year, month: p.month, day: p.day, hour: p.hour, minute: p.minute }
}

const addDays = (isoDate: string, days: number) =>
  new Date(Date.parse(`${isoDate}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10)

export function formatDateTime(value: string | Date) {
  const { year, month, day, hour, minute } = brt(value)
  return `${day}/${month}/${year} às ${hour}h${minute === "00" ? "" : minute}`
}

export function getShiftKey(value: string | Date = new Date()) {
  const { year, month, day, hour } = brt(value)
  const period: "day" | "night" = Number(hour) >= 7 && Number(hour) < 19 ? "day" : "night"

  const date = `${year}-${month}-${day}`
  return { shiftDate: Number(hour) < 7 ? addDays(date, -1) : date, period }
}

export type ShiftKey = ReturnType<typeof getShiftKey>

export function formatShiftKey({ shiftDate, period }: ShiftKey) {
  const [year, month, day] = shiftDate.split("-")
  return `${day}/${month}/${year} - ${SHIFT_LABEL[period]}`
}

export function getShift(value: string | Date, withDate = false) {
  const key = getShiftKey(value)
  return withDate ? formatShiftKey(key) : SHIFT_LABEL[key.period]
}

export function previousShift({ shiftDate, period }: ShiftKey): ShiftKey {
  return period === "night"
    ? { shiftDate, period: "day" }
    : { shiftDate: addDays(shiftDate, -1), period: "night" }
}

export function shiftRange({ shiftDate, period }: ShiftKey) {
  const start = Date.parse(`${shiftDate}T${SHIFT_START_HOUR[period]}:00:00${BRT_OFFSET}`)
  return {
    start: new Date(start).toISOString(),
    end: new Date(start + 12 * HOUR_MS).toISOString(),
  }
}

export function currentTime() {
  const { hour, minute } = brt()
  return `${hour}:${minute}`
}

export function buildOccurredAt(time: string, now = new Date()) {
  const { year, month, day } = brt(now)
  const chosen = Date.parse(`${year}-${month}-${day}T${time}:00${BRT_OFFSET}`)
  const isFuture = chosen > now.getTime() + 60_000
  return new Date(isFuture ? chosen - DAY_MS : chosen).toISOString()
}