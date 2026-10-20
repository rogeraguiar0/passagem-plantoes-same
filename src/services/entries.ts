import { supabase } from "../lib/supabase";
import type { Collaborator, Entry, ShiftEntry, UpdateEntry } from "../types";
import { previousShift, shiftRange, type ShiftKey } from "../utils/date";
import { getCollaboratorsOnShift } from "./schedule";

export const ENTRY_SELECT = `
  id, type, status, priority, occurred_at, description,
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