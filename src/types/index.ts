// Sidebar

export interface SidebarProps {
  page: string
  setPage: React.Dispatch<React.SetStateAction<string>>
}

// Shift Entry

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
}

// Card

export interface CardProps {
  entry: ShiftEntry
}