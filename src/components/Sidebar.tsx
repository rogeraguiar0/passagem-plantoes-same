import type { SidebarProps } from "../types"
import { Info } from "lucide-react"
import Logo from "../assets/logo.png"

export function Sidebar({ setPage }: SidebarProps) {
  return (
    <div className="flex flex-col justify-between h-screen md:w-fit border-r border-gray-3">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center border-b border-gray-3">
          <img width="320px" className="p-6" src={Logo} alt="Logo da Santa Casa" />
        </div>

        <nav className="flex flex-col gap-8 items-start caption-1 p-6">
          <div className="flex flex-col gap-2 items-start">
            <button onClick={() => setPage("lastShift")}>Último Plantão</button>
            <button onClick={() => setPage("allShifts")}>Todos os Plantões</button>
            <button onClick={() => setPage("dashboard")}>Dashboard</button>
          </div>
          <button onClick={() => setPage("options")}>Opções</button>
        </nav>
      </div>

      <span className="p-6 max-w-64">
        <Info className="text-gray-2 inline pr-1" />
        <p className="inline text-sm caption-2">
          Esse sistema é um protótipo e não representa a versão final do produto
        </p>
      </span>
    </div>
  )
}