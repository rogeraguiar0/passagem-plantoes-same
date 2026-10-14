import type { ReactNode } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Login } from "./Login"

export function AuthGate({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) return <p className="p-4">Carregando...</p>
  if (!session) return <Login />
  return <>{children}</>
}
