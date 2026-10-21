import { useCallback, useState } from "react";
import type { DialogEntryDetailProps } from "../types";
import { formatDateTime } from "../utils/date";
import { Select } from "./Select";
import { Check, SendHorizontal, User, X } from "lucide-react";
import { getEntryById, postObservation, updateEntry } from "../services/entries";
import { usePackage } from "../contexts/PackageContext";

const STATUS_LABEL = { pending: "Pendente", concluded: "Concluído" } as const

export function DialogEntryDetail({ entry }: DialogEntryDetailProps) {
  const [current, setCurrent] = useState(entry)

  const refresh = useCallback(async () => {
    try {
      setCurrent(await getEntryById(current.id))
    } catch {
    }
  }, [current.id])

  const { collaborators } = usePackage()
  const collaboratorOptions = [{ value: "", label: "Quem está aí?" }].concat(collaborators.map((collaborator) => ({ value: collaborator.id, label: collaborator.name })))

  const [collaboratorToComment, setColaboratorToComment] = useState("")

  const handleCollaboratorChange = (value: EventTarget & HTMLSelectElement) => {
    setColaboratorToComment(value.value)
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

  const [savedStatus, setSavedStatus] = useState(current.status)
  const [statusValue, setStatusValue] = useState(current.status)
  const [saving, setSaving] = useState(false)

  const hasChanges = statusValue !== savedStatus

  const cancelChanges = () => {
    setStatusValue(savedStatus)
  }

  const confirmChanges = () => {
    setStatusValue(savedStatus)
    try {
      setSaving(true)
      updateEntry({ id: current.id, status: statusValue })
    } catch {
      console.log("Erro ao mudar Status do Lançamento")
    } finally {
      setSaving(false)
      refresh()
    }
  }

  const [observation, setObservation] = useState("")

  const submitObservation = () => {
    postObservation(observation, collaboratorToComment, current.id)
    setObservation("")
    refresh()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-4">
        <p className={handlePriorityColor(current.priority)}>
          {handlePriorityText(current.priority)}
        </p>
        <Select onChange={(e) => handleCollaboratorChange(e.target)} options={collaboratorOptions} />
      </div>

      <div className="flex justify-between gap-12">
        <div className="flex flex-4 flex-col gap-8">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <p className="caption-1">Plantonista</p>
              <p>{current.colaborator}</p>
            </div>
            {current.sector && (
              <div className="flex flex-col">
                <p className="caption-1">Setor</p>
                <p>{current.sector}</p>
              </div>
            )}
            {current.healthInsurance && (
              <div className="flex flex-col">
                <p className="caption-1">Convênio</p>
                <p>{current.healthInsurance}</p>
              </div>)}
            {current.doctor && (
              <div className="flex flex-col">
                <p className="caption-1">Médico</p>
                <p>{current.doctor}</p>
              </div>
            )}
          </div>

          <div>
            <p className="caption-1">Descrição</p>
            <p className="caption-1 text-black">{current.description}</p>
          </div>
        </div>
        <div className="flex flex-2 flex-col gap-6">
          <div className="flex flex-col gap-4">
            <p className="caption-1">Observações</p>
            {current.observations && current.observations.length > 0 ?
              (current.observations.map((observation) => (
                <div key={observation.id} className="flex flex-col gap-1">
                  <p className="caption-1 text-black">- {observation.content}</p>
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
                onChange={(e) => setObservation(e.target.value)}
                value={observation}
                placeholder="Insira sua observação..."
                id="observation"
                name="observation"
              />
              <button onClick={submitObservation} className="cursor-pointer hover:bg-brand-opacity transition-colors p-1.75 rounded-lg bg-brand text-white h-fit">
                <SendHorizontal className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
      {collaboratorToComment !== "" && (
        <div className="slide-down-in space-y-2">
          <p className="caption-1">Status do lançamento</p>

          <div className="flex items-center justify-between">
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

            {hasChanges && (
              <div className="slide-down-in flex flex-col items-end gap-2">
                <p className="caption-1">
                  Alterar de <strong>{STATUS_LABEL[savedStatus]}</strong> para{" "}
                  <strong>{STATUS_LABEL[statusValue]}</strong>?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={cancelChanges}
                    disabled={saving}
                    className="cursor-pointer rounded-lg border px-3 py-1 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={confirmChanges}
                    disabled={saving}
                    className="cursor-pointer rounded-lg bg-brand px-3 py-1 text-white transition-colors hover:bg-brand-opacity disabled:opacity-50"
                  >
                    {saving ? "Salvando..." : "Confirmar"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}