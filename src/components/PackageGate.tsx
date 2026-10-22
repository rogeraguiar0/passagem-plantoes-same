import type { ReactNode } from "react"
import { usePackage } from "../contexts/PackageContext"

export function PackageGate({ children }: { children: ReactNode }) {
  const { loading, error, retry } = usePackage()

  if (loading) return <p className="p-4">Carregando...</p>
  if (error) {
    return (
      <div role="alert" className="flex flex-col items-start gap-2 p-4">
        <p className="text-alert">Não foi possível carregar os dados.</p>
        <button type="button" onClick={retry} className="cursor-pointer underline">Tentar de novo</button>
      </div>
    )
  }
  return <>{children}</>
}