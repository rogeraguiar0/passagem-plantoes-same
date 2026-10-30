import { useCallback, useEffect, useRef, useState } from "react"
import { Check, SendHorizontal, User, X } from "lucide-react"
import type { DialogEntryDetailProps } from "../types"
import { formatDateTime } from "../utils/date"
import { getEntryById, postObservation, updateEntry } from "../services/entries"
import { usePackage } from "../contexts/PackageContext"
import { Select } from "./Select"
import { Tabs } from "./Tabs"
import { RichText } from "./RichText"
import { RichTextEditor } from "./RichTextEditor"

const STATUS_LABEL = { pending: "Pendente", concluded: "Concluído" } as const
type TabId = "details" | "observations"

export function DialogEntryDetail({ entry, onChanged }: DialogEntryDetailProps) {

  const [current, setCurrent] = useState(entry)
  const [tab, setTab] = useState<TabId>("details")

  const refresh = useCallback(async () => {
    try {
      setCurrent(await getEntryById(current.id))
    } catch {
    }
  }, [current.id])

  const { collaborators } = usePackage()
  const collaboratorOptions = [{ value: "", label: "Quem está aí?" }].concat(
    collaborators.map((c) => ({ value: c.id, label: c.name }))
  )
  const [collaboratorToComment, setColaboratorToComment] = useState("")

  const [statusValue, setStatusValue] = useState(current.status)
  const [savingStatus, setSavingStatus] = useState(false)
  const [statusError, setStatusError] = useState<string | null>(null)
  const hasChanges = statusValue !== current.status

  const cancelChanges = () => {
    setStatusValue(current.status)
    setStatusError(null)
  }

  const confirmChanges = async () => {
    setSavingStatus(true)
    setStatusError(null)
    try {
      await updateEntry({ id: current.id, status: statusValue })
      setCurrent((prev) => ({ ...prev, status: statusValue })) // a barra some na hora
      await refresh()
      onChanged?.()
    } catch {
      setStatusError("Não foi possível salvar. Tente novamente.")
    } finally {
      setSavingStatus(false)
    }
  }

  const [observation, setObservation] = useState("")
  const [savingObservation, setSavingObservation] = useState(false)
  const [observationError, setObservationError] = useState<string | null>(null)
  const observationList = current.observations ?? []

  const submitObservation = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = observation.trim()
    if (!text || !collaboratorToComment) return

    setSavingObservation(true)
    setObservationError(null)
    try {
      await postObservation(text, collaboratorToComment, current.id)
      setObservation("")
      await refresh()
      onChanged?.()
    } catch {
      setObservationError("Não foi possível enviar a observação.")
    } finally {
      setSavingObservation(false)
    }
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

  const listRef = useRef<HTMLUListElement>(null)
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [observationList.length, tab])

  const details = (
    <div className="flex flex-col gap-6">
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
          </div>
        )}
      </div>

      <div>
        <p className="caption-1">Descrição</p>
        <RichText html={current.description} className="caption-1 text-black" />
      </div>

      {collaboratorToComment !== "" && (
        <div className="slide-down-in space-y-2">
          <p className="caption-1">Status do lançamento</p>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
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

            {hasChanges && (
              <div className="slide-down-in flex flex-col items-end gap-2">
                <p className="caption-1">
                  Alterar de <strong>{STATUS_LABEL[current.status]}</strong> para{" "}
                  <strong>{STATUS_LABEL[statusValue]}</strong>?
                </p>
                <div className="flex gap-2">
                  <button type="button" onClick={cancelChanges} disabled={savingStatus}
                    className="cursor-pointer rounded-lg border px-3 py-1 disabled:opacity-50">
                    Cancelar
                  </button>
                  <button type="button" onClick={confirmChanges} disabled={savingStatus}
                    className="cursor-pointer rounded-lg bg-brand px-3 py-1 text-white transition-colors hover:bg-brand-opacity disabled:opacity-50">
                    {savingStatus ? "Salvando..." : "Confirmar"}
                  </button>
                </div>
                {statusError && <p role="alert" className="caption-1 text-alert">{statusError}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )

  const observations = (
    <div className="flex flex-col justify-between gap-3">
      <ul ref={listRef} className="flex max-h-64 flex-col gap-4 overflow-y-auto pr-1">
        {observationList.length > 0 ? (
          observationList.map((o) => (
            <li key={o.id} className="flex flex-col gap-1">
              <RichText html={o.content} className="caption-1 text-black" />
              <p className="caption-2">
                <User className="inline h-4 w-4 pb-0.5 pr-0.5" />
                <span className="text-gray-0">{o.colaborator}</span> - {formatDateTime(o.createdAt)}
              </p>
            </li>
          ))
        ) : (
          <li className="caption-2">Sem observações no momento...</li>
        )}
      </ul>

      {collaboratorToComment !== "" ? (
        <form onSubmit={submitObservation} className="slide-down-in flex flex-col gap-2">
          <div className="flex w-full gap-2">
            <div className="flex-1">
              <RichTextEditor
                label="Nova observação"
                placeholder="Insira sua observação..."
                value={observation}
                onChange={setObservation}
                className="min-h-32"
              />
            </div>
            <button
              type="submit"
              aria-label="Enviar observação"
              disabled={savingObservation || observation === ""}
              className="h-fit cursor-pointer rounded-lg bg-brand p-1.75 text-white transition-colors hover:bg-brand-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SendHorizontal className="h-5 w-5" />
            </button>
          </div>
          {observationError && <p role="alert" className="caption-1 text-alert">{observationError}</p>}
        </form>
      ) : (
        <p className="caption-2">Selecione quem está aí para enviar uma observação.</p>
      )}
    </div>
  )

  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="flex items-center justify-between gap-4">
        <p>Prioridade: <span className={handlePriorityColor(current.priority)}>{handlePriorityText(current.priority)}</span></p>
        <Select onChange={(e) => setColaboratorToComment(e.target.value)} options={collaboratorOptions} />
      </div>

      <Tabs
        label="Seções do lançamento"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "details", label: "Detalhes", panel: details },
          { id: "observations", label: `Observações (${observationList.length})`, panel: observations },
        ]}
      />
    </div>
  )
}