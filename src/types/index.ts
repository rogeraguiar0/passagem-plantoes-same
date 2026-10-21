// Sidebar

import type { Session } from "@supabase/supabase-js"
import type { getShiftKey } from "../utils/date"
import type { toEntry } from "../services/entries"

export interface SidebarProps {
  page: string
  setPage: React.Dispatch<React.SetStateAction<string>>
}

// Status Field

export interface StatusFieldProps {
  value: string
  onChange: (status: string) => void
}

// Dialog

export interface DialogProps {
  dialog: DialogContent
}

export interface DialogEntryDetailProps {
  entry: ReturnType<typeof toEntry>
}

export interface DialogContent {
  isOpen: boolean
  title?: string
  children?: React.ReactNode
  onClose?: () => void
}

// Sector

export interface Sector {
  id: string
  name: string
  created_at: string
}

// Health Insurance

export interface HealthInsurance {
  id: string
  name: string
  created_at: string
}

// Doctor

export interface Doctor {
  id: string
  name: string
  created_at: string
}

// Collaborator

export interface Collaborator {
  id: string,
  name: string
}

// Shift Entry


import type { Database } from "../types/database"

type EntryType = Database["public"]["Enums"]["entry_type"]
type EntryStatus = Database["public"]["Enums"]["entry_status"]

export interface EntryFilters {
  term: string
  date: string // "2026-10-21" ou ""
  type: EntryType | ""
  status: EntryStatus | ""
  collaboratorId: string
  sectorId: string
  healthInsuranceId: string
  doctorId: string
}

export const EMPTY_FILTERS: EntryFilters = {
  term: "",
  date: "",
  type: "",
  status: "",
  collaboratorId: "",
  sectorId: "",
  healthInsuranceId: "",
  doctorId: "",
}

export interface Entry {
  id: string
  type: string
  status: string
  priority: number
  collaborator_id: string
  sector_id: string
  health_insurance_id: string
  doctor_id: string
  ocurred_at: string
  description: string
  created_at: string
}

export interface FilteredEntry {
  id: string;
  type: "internacao" | "atendimento" | "aviso" | "outros";
  status: "pending" | "concluded";
  priority: number;
  created_at: string;
  description: string;
  colaborator: string;
  sector: string | undefined;
  healthInsurance: string | undefined;
  doctor: string | undefined;
  observations: {
    id: string;
    content: string;
    createdAt: string;
    colaborator: string;
  }[];
}


export interface ShiftEntry {
  id: string
  createdAt: string
  type: string
  priority: number
  colaborator: string
  sector: string
  healthInsurance?: string
  doctor?: string
  description: string
  status: string
  observations?: Observation[]
}

export interface Observation {
  id: string
  colaborator: string
  createdAt: string
  content: string
}

export interface UpdateEntry {
  id?: string
  type?: "internacao" | "atendimento" | "aviso" | "outros"
  priority?: number
  description?: string
  status?: "pending" | "concluded"
}

// Card

export interface CardProps {
  entry: ReturnType<typeof toEntry>
  setDialog: React.Dispatch<React.SetStateAction<DialogContent>>
  onChanged: () => void
}

// AllShifts

export interface AllShiftsProps {
  setDialog: React.Dispatch<React.SetStateAction<DialogContent>>
}

// LastShift

export interface LastShiftProps {
  setDialog: React.Dispatch<React.SetStateAction<DialogContent>>
}

// Context

export interface AuthContextValue {
  session: Session | null
  loading: boolean
  signIn: (keyword: string) => Promise<string | null> // devolve a mensagem de erro, ou null
  signOut: () => Promise<void>
}

export interface PackageContextValue {
  loading: boolean
  collaborators: Collaborator[]
  actualShiftCollaborators: Collaborator[]
  sectors: Sector[]
  healthInsurances: HealthInsurance[]
  lastShiftEntries: ReturnType<typeof toEntry>[]
}
