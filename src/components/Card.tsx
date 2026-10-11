import type { CardProps } from "../types";

export function Card({ entry }: CardProps) {
  const handlePriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "text-text"
      case 2:
        return "text-alert"
      default:
        return "text-success"
    }
  }

  const handlePriorityText = (priority: number) => {
    switch (priority) {
      case 1:
        return "Normal"
      case 2:
        return "Alta"
      default:
        return "Baixa"
    }
  }

  return (
    <div className="flex gap-4 items-center">
      <p className="caption-2 w-fit whitespace-nowrap">{new Date(entry.createdAt).toLocaleString()}</p>

      <div className="flex gap-8 p-4 border border-gray-3 rounded-lg flex-1 max-w-2xl caption-1 h-50">
        <div className="flex justify-between flex-col gap-2 flex-1">
          <div>
            <h3 className="text-2 font-bold">Tipo: {entry.type}</h3>
            <p>Prioridade: <span className={handlePriorityColor(entry.priority)}>{handlePriorityText(entry.priority)}</span></p>
            <p>Plantonista: {entry.colaborator}</p>
          </div>
          <div>
            {entry.healthInsurance && <p>Convênio: {entry.healthInsurance}</p>}
            <p className="caption-1">Setor: {entry.sector}</p>
            {entry.doctor && <p className="caption-1">Médico: {entry.doctor}</p>}
          </div>
        </div>
        <div className="flex-2">
          <p className="caption-1">{entry.description}</p>
        </div>
      </div>
    </div>
  )
}