// Sidebar

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
  entry: ShiftEntry
}

export interface DialogContent {
  isOpen: boolean
  title?: string
  children?: React.ReactNode
  onClose?: () => void
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
  status: string
  observations?: Observation[]
}

export interface Observation {
  id: string
  colaborator: string
  createdAt: string
  content: string
}

// Card

export interface CardProps {
  entry: ShiftEntry
  setDialog: React.Dispatch<React.SetStateAction<DialogContent>>
}

// AllShifts

export interface AllShiftsProps {
  setDialog: React.Dispatch<React.SetStateAction<DialogContent>>
}

// LastShift

export interface LastShiftProps {
  setDialog: React.Dispatch<React.SetStateAction<DialogContent>>
}