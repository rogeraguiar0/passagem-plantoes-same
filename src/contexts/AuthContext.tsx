import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"

type AuthContextValue = {
  session: Session | null
  loading: boolean
  signIn: (keyword: string) => Promise<string | null> // devolve a mensagem de erro, ou null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // sessão salva no navegador (se existir)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // login, logout e renovação automática do token
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  const signIn = async (keyword: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_SHARED_EMAIL,
      password: keyword,
    })

    if (!error) return null
    return error.code === "invalid_credentials"
      ? "Palavra-chave incorreta."
      : "Não foi possível entrar. Tente novamente."
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>")
  return ctx
}