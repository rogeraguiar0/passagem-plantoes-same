import { LogOut, MessageCircleQuestionMark } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { Schedule } from "../components/Schedule"

export function Options() {
  const { signOut } = useAuth()

  return (
    <div className="flex h-full flex-col gap-4 p-4 w-full">
      <h1 className="text-2xl font-bold">Opções e Escala</h1>

      <section className="w-full space-y-2 px-8 pb-8">
        <Schedule />
      </section>

      <div className="pb-4">
        <p className="text-2">Tem alguma sugestão ou está com algum problema/dúvida?</p>
        <p className="caption-1">Entre em contato!</p>
        <a className="px-2 py-1 mt-2 bg-brand hover:bg-brand-opacity transition-colors text-white cursor-pointer rounded flex gap-2 items-center w-fit">
          <MessageCircleQuestionMark />
          <span className="caption-1 text-white">Whatsapp</span>
        </a>
      </div>

      <div className="pb-4 space-y-2">
        <p className="caption-1">Deseja sair do sistema?</p>
        <button onClick={signOut} className="flex cursor-pointer items-center gap-2 text-alert">
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>

    </div>
  )
}