import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type Collaborator, type HealthInsurance, type Sector, type PackageContextValue } from "../types";
import { getCollaborators } from "../services/collaborator";
import { getSectors } from "../services/sectors";
import { getHealthInsurance } from "../services/healthInsurance";
import { getLastShift, toEntry } from "../services/entries";
import { getShiftKey } from "../utils/date";

const PackageContext = createContext<PackageContextValue | null>(null)

export function PackageProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [actualShiftCollaborators, setActualShiftCollaborators] = useState<Collaborator[]>([])
  const [sectors, setSectors] = useState<Sector[]>([])
  const [healthInsurances, setHealthInsurances] = useState<HealthInsurance[]>([])
  const [lastShiftEntries, setLastShiftEntries] = useState<ReturnType<typeof toEntry>[]>([])

  useEffect(() => {
    const shiftKey = getShiftKey()

    try {
      getLastShift(shiftKey).then((data) => {
        setLastShiftEntries(data.entries)
        setActualShiftCollaborators(data.team)
      })
      getCollaborators().then((data) => setCollaborators(data))
      getSectors().then((data) => setSectors(data))
      getHealthInsurance().then((data) => setHealthInsurances(data))
    } catch {
      throw new Error("Erro ao iniciar aplicação")
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <PackageContext.Provider
      value={{ loading, collaborators, actualShiftCollaborators, sectors, healthInsurances, lastShiftEntries }}
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
