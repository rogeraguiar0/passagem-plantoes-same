import { useState } from "react";
import type { DialogEntryDetailProps } from "../types";
import { formatDateTime } from "../utils/date";
import { Select } from "./Select";
import { Check, SendHorizontal, User, X } from "lucide-react";

export function DialogEntryDetail({ entry }: DialogEntryDetailProps) {
  const [collaboratorToComment, setColaboratorToComment] = useState("")

  const handleCollaboratorChange = (value: string) => {
    setColaboratorToComment(value)
  }

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

  const [statusValue, setStatusValue] = useState(entry.status)

  const handleStatusChange = () => {
    // API ROUTE
    // Chamada para atualizar o status do lançamento no backend
    console.log(`Status atualizado para: ${statusValue}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-4">
        <p className={handlePriorityColor(entry.priority)}>
          {handlePriorityText(entry.priority)}
        </p>
        <Select onChange={(e) => handleCollaboratorChange(e.target.value)} options={[{ value: "", label: "Quem está aí?" }, { value: "Marina", label: "Marina" }, { value: "Marcilene", label: "Marcilene" }, { value: "Camila", label: "Camila" }, { value: "Letícia", label: "Letícia" }, { value: "Róger", label: "Róger" }, { value: "Julia", label: "Julia" }, { value: "Yasnaia", label: "Yasnaia" }]} />
      </div>

      <div className="flex justify-between gap-12">
        <div className="flex flex-4 flex-col gap-8">
          <div className="flex items-center gap-8">
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
            <p className="caption-1 text-black">{entry.description}</p>
          </div>
        </div>
        <div className="flex flex-2 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="caption-1">Observações</p>
            {entry.observations && entry.observations.length > 0 ?
              (entry.observations.map((observation) => (
                <div key={observation.id} className="flex flex-col gap-1">
                  <p className="caption-1 text-black">{observation.content}</p>
                  <p className="caption-2">
                    <User className="w-4 h-4 inline pr-0.5 pb-0.5" />
                    <span className="text-gray-0">
                      {observation.colaborator}
                    </span>
                    - {formatDateTime(observation.createdAt)}
                  </p>
                </div>
              )))
              : (
                <p className="caption-2">Sem observações no momento...</p>
              )}
          </div>
          {collaboratorToComment !== "" && (
            <div className="slide-down-in w-full flex gap-2">
              <textarea
                className="w-full text-black caption-1 rounded-lg border bg-white px-2 py-1 text-grey-0 outline-none placeholder:text-gray-2 disabled:cursor-not-allowed disabled:bg-grey-3/30 resize-none h-14"
                placeholder="Insira sua observação..."
                id="observation"
                name="observation"
              />
              <button className="cursor-pointer hover:bg-brand-opacity transition-colors p-1.75 rounded-lg bg-brand text-white h-fit">
                <SendHorizontal className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
      {collaboratorToComment !== "" && (
        <div className="slide-down-in space-y-2">
          <p className="caption-1">Status do lançamento</p>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <div className="relative">
                <input
                  className="h-5 w-5 shrink-0 cursor-pointer appearance-none rounded border border-gray-400 bg-white bg-center bg-no-repeat checked:border-alert checked:bg-alert"
                  checked={statusValue === "pending"}
                  onChange={() => setStatusValue("pending")}
                  type="radio"
                  name="status"
                  id="pending"
                />
                <X className="cursor-pointer text-white w-4 h-4 absolute pointer-events-none top-0.5 left-0.5" />
              </div>
              <label className="cursor-pointer text-2" htmlFor="pending">Pendente</label>
            </div>
            <div className="flex items-center gap-1">
              <div className="relative">
                <input
                  className="h-5 w-5 shrink-0 cursor-pointer appearance-none rounded border border-gray-400 bg-white bg-center bg-no-repeat checked:border-success checked:bg-success"
                  checked={statusValue === "concluded"}
                  onChange={() => setStatusValue("concluded")}
                  type="radio"
                  name="status"
                  id="concluded"
                />
                <Check className="cursor-pointer text-white w-4 h-4 absolute pointer-events-none top-0.5 left-0.5" />
              </div>
              <label className="cursor-pointer text-2" htmlFor="concluded">Concluído</label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}