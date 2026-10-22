import { supabase } from "../lib/supabase";
import type { EntryFilters, NewEntryInput, UpdateEntry } from "../types";
import { previousShift, shiftRange, type ShiftKey } from "../utils/date";
import { getCollaboratorsOnShift } from "./schedule";

export const ENTRY_SELECT = `
  id, type, status, priority, occurred_at, description, description_text,
  collaborator:collaborators(name),
  sector:sectors(name),
  health_insurance:health_insurances(name),
  doctor:doctors(name),
  observations(id, content, created_at, collaborator:collaborators(name))
`

import type { QueryData } from "@supabase/supabase-js"

const entriesQuery = supabase.from("entries").select(ENTRY_SELECT)
type EntryRow = QueryData<typeof entriesQuery>[number]

export function toEntry(row: EntryRow) {
  return {
    id: row.id,
    type: row.type,
    status: row.status,
    priority: row.priority,
    created_at: row.occurred_at,
    description: row.description,
    descriptionText: row.description_text,
    colaborator: row.collaborator?.name,
    sector: row.sector?.name,
    healthInsurance: row.health_insurance?.name,
    doctor: row.doctor?.name,
    observations: row.observations.map((o) => ({
      id: o.id,
      content: o.content,
      createdAt: o.created_at,
      colaborator: o.collaborator?.name,
    })),
  }
}

export async function getShiftEntries(key: ShiftKey) {
  const { start, end } = shiftRange(key)

  const { error, data } = await supabase
    .from("entries")
    .select(ENTRY_SELECT)
    .gte("created_at", start)
    .lt("created_at", end)
    .order("occurred_at", { ascending: false })
    .order("created_at", { referencedTable: "observations", ascending: true })

  if (error) throw error

  return data.map(toEntry)
}

export const PAGE_SIZE = 20

export async function getEntriesPage(filters: Partial<EntryFilters>, page: number) {

  const escapeLike = (value: string) => value.replace(/[\\%_]/g, "\\$&")
  const from = page * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase.from("entries").select(ENTRY_SELECT, { count: "exact" })

  const term = filters.term?.trim()
  if (term) query = query.ilike("description", `%${escapeLike(term)}%`)
  if (filters.type) query = query.eq("type", filters.type)
  if (filters.status) query = query.eq("status", filters.status)
  if (filters.collaboratorId) query = query.eq("collaborator_id", filters.collaboratorId)
  if (filters.sectorId) query = query.eq("sector_id", filters.sectorId)
  if (filters.healthInsuranceId) query = query.eq("health_insurance_id", filters.healthInsuranceId)
  if (filters.doctorId) query = query.eq("doctor_id", filters.doctorId)

  if (filters.date) {
    const start = new Date(`${filters.date}T00:00:00-03:00`)
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000)
    query = query.gte("occurred_at", start.toISOString()).lt("occurred_at", end.toISOString())
  }

  const { data, count, error } = await query
    .order("occurred_at", { ascending: false })
    .order("created_at", { ascending: false }) // desempate, mantém a paginação estável
    .order("created_at", { referencedTable: "observations", ascending: true })
    .range(from, to)

  if (error) throw error
  return { entries: data.map(toEntry), total: count ?? 0 }
}

export async function getLastShift(current: ShiftKey) {
  const key = previousShift(current)

  const [entries, team] = await Promise.all([
    getShiftEntries(key),
    getCollaboratorsOnShift(key)
  ])

  return { key, entries, team }
}

export async function postObservation(content: string, collaborator_id: string, entry_id: string) {
  const { data, error } = await supabase
    .from("observations")
    .insert({
      collaborator_id,
      entry_id,
      content
    })

  if (error) throw error

  return data
}

export async function createEntry(input: NewEntryInput) {
  const { error } = await supabase.from("entries").insert({
    type: input.type,
    priority: input.priority,
    collaborator_id: input.collaboratorId,
    sector_id: input.sectorId,
    health_insurance_id: input.healthInsuranceId,
    occurred_at: input.occurredAt,
    description: input.description,
  })

  if (error) throw error
}

export async function updateEntry(entry: UpdateEntry) {
  const { data, error } = await supabase
    .from("entries")
    .update({ ...entry })
    .eq("id", entry.id!)
    .select("id")

  if (error) throw error

  return data
}

export async function getEntryById(id: string) {
  const { data, error } = await supabase
    .from("entries")
    .select(ENTRY_SELECT)
    .eq("id", id)
    .order("created_at", { referencedTable: "observations", ascending: true })
    .single()

  if (error) throw error

  return toEntry(data)
}