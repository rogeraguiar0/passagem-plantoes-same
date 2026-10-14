import { supabase } from "../lib/supabase"

export type ScheduleByDate = Record<string, { day: string[]; night: string[] }>

const pad = (n: number) => String(n).padStart(2, "0")

export async function getSchedule(year: number, month: number) { // month: 1 a 12
  const lastDay = new Date(year, month, 0).getDate()

  const { data, error } = await supabase
    .from("schedule")
    .select("shift_date, period, collaborator:collaborators(name)")
    .gte("shift_date", `${year}-${pad(month)}-01`)
    .lte("shift_date", `${year}-${pad(month)}-${pad(lastDay)}`)

  if (error) throw error

  const byDate: ScheduleByDate = {}
  for (const row of data) {
    const slot = (byDate[row.shift_date] ??= { day: [], night: [] })
    if (row.collaborator) slot[row.period].push(row.collaborator.name)
  }

  for (const slot of Object.values(byDate)) {
    slot.day.sort()
    slot.night.sort()
  }

  return byDate
}