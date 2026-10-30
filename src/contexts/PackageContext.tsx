// src/contexts/PackageContext.tsx
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import type { Collaborator, HealthInsurance, Sector, PackageContextValue } from "../types"
import { getCollaborators } from "../services/collaborator"
import { getSectors } from "../services/sectors"
import { getHealthInsurance } from "../services/healthInsurance"
import { getCollaboratorsOnShift } from "../services/schedule"
import { getLastShift, getShiftEntries, toEntry } from "../services/entries"
import { getShiftKey } from "../utils/date"

const PackageContext = createContext<PackageContextValue | null>(null)

export function PackageProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [sectors, setSectors] = useState<Sector[]>([])
  const [healthInsurances, setHealthInsurances] = useState<HealthInsurance[]>([])

  const [lastShiftEntries, setLastShiftEntries] = useState<ReturnType<typeof toEntry>[]>([])
  const [lastShiftCollaborators, setLastShiftCollaborators] = useState<Collaborator[]>([])
  const [currentShiftEntries, setCurrentShiftEntries] = useState<ReturnType<typeof toEntry>[]>([])
  const [currentShiftCollaborators, setCurrentShiftCollaborators] = useState<Collaborator[]>([])

  const fetchShiftData = useCallback(async () => {
    const shiftKey = getShiftKey()
    const [lastEntries, currentEntries, currentCollaborators] = await Promise.all([
      getLastShift(shiftKey),
      getShiftEntries(shiftKey),
      getCollaboratorsOnShift(shiftKey),
    ])
    setLastShiftEntries(lastEntries.entries)
    setLastShiftCollaborators(lastEntries.team)
    setCurrentShiftEntries(currentEntries)
    setCurrentShiftCollaborators(currentCollaborators)
  }, [])

  const reload = useCallback(async () => {
    try {
      await fetchShiftData()
    } catch {
    }
  }, [fetchShiftData])

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const [c, s, h] = await Promise.all([
        getCollaborators(),
        getSectors(),
        getHealthInsurance(),
        fetchShiftData(),
      ])
      setCollaborators(c)
      setSectors(s)
      setHealthInsurances(h)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [fetchShiftData])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  return (
    <PackageContext.Provider
      value={{
        loading, error, retry: loadAll, reload,
        collaborators, sectors, healthInsurances,
        lastShiftEntries, lastShiftCollaborators,
        currentShiftEntries, currentShiftCollaborators,
      }}
    >
      {children}
    </PackageContext.Provider>
  )
}

export function usePackage() {
  const ctx = useContext(PackageContext)
  if (!ctx) throw new Error("usePackage deve ser usado dentro de <PackageProvider>")
  return ctx
}