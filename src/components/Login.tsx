import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Input } from "./Input"
import Logo from "../assets/logo.png"

export function Login() {
  const { signIn } = useAuth()
  const [keyword, setKeyword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const message = await signIn(keyword)
    if (message) setError(message)

    setSubmitting(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-zinc-100">
      <form onSubmit={handleSubmit} className="flex w-full max-w-90 flex-col gap-8 bg-white p-6 rounded-lg border border-gray-3">
        <img src={Logo} alt="Logo Santa Casa" width={180} className="self-center" />

        <h1 className="text-1 font-bold">Lançamento de Plantões</h1>

        <div className="space-y-2 w-full">
          <Input placeholder="Digite a senha aqui" label="Palavra Chave" type="password" autoComplete="current-password" value={keyword} onChange={(e) => setKeyword(e.target.value)} autoFocus />

          {error && <p role="alert" className="caption-1 text-alert">{error}</p>}

          <button
            type="submit"
            disabled={submitting || keyword === ""}
            className="rounded-lg bg-brand px-2 py-1 text-white disabled:opacity-50 w-full"
          >
            {submitting ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
    </main>
  )
}