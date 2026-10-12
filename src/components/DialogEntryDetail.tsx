import { useState } from "react";
import type { DialogEntryDetailProps } from "../types";
import { formatDateTime } from "../utils/date";
import { Select } from "./Select";
import { Input } from "./Input";

export function DialogEntryDetail({ entry }: DialogEntryDetailProps) {
  const [collaboratorToComment, setColaboratorToComment] = useState("");

  const handleCollaboratorChange = (value: string) => {
    setColaboratorToComment(value)
  }

  const handlePriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "text-text text-sm"
      case 2:
        return "text-alert text-sm"
      default:
        return "text-success text-sm"
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

  const handleStatusChange = (status: string) => {
    // API ROUTE
    // Chamada para atualizar o status do lançamento no backend
    console.log(`Status atualizado para: ${status}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-4">
        <p className={handlePriorityColor(entry.priority)}>
          {handlePriorityText(entry.priority)}
        </p>
        <Select onChange={(e) => handleCollaboratorChange(e.target.value)} options={[{ value: "", label: "Quem está aí?" }, { value: "Marina", label: "Marina" }, { value: "Marcilene", label: "Marcilene" }, { value: "Camila", label: "Camila" }, { value: "Letícia", label: "Letícia" }, { value: "Róger", label: "Róger" }]} />
      </div>

      <div className="flex justify-between gap-12">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between gap-4">
            <div className="flex flex-col">
              <p className="caption-1">Plantonista</p>
              <p>{entry.colaborator}</p>
            </div>
            {entry.sector && (
              <div className="flex flex-col">
                <p className="caption-1">Setor</p>
                <p>{entry.sector}</p>
              </div>
            )}
            {entry.healthInsurance && (
              <div className="flex flex-col">
                <p className="caption-1">Convênio</p>
                <p>{entry.healthInsurance}</p>
              </div>)}
            {entry.doctor && (
              <div className="flex flex-col">
                <p className="caption-1">Médico</p>
                <p>{entry.doctor}</p>
              </div>
            )}
          </div>

          <div>
            <p className="caption-1">Descrição</p>
            <p>{entry.description}</p>
          </div>
        </div>
        {entry.observations && entry.observations.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-4">
              <p className="caption-1">Observações</p>
              {entry.observations.map((observation) => (
                <div key={observation.id} className="flex flex-col">
                  <p className="caption-2">{observation.colaborator} - {formatDateTime(observation.createdAt)}</p>
                  <p className="caption-1">{observation.content}</p>
                </div>
              ))}
            </div>
            {collaboratorToComment !== "" && <Input placeholder="Insira sua observação..." />}
          </div>
        )}
      </div>
      <div>

      </div>
    </div>
  )
}