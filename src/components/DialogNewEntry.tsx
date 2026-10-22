import { useMemo, useState } from "react"
import { usePackage } from "../contexts/PackageContext"
import { createEntry } from "../services/entries"
import { buildOccurredAt, currentTime } from "../utils/date"
import type { Database } from "../types/database"
import { Input } from "./Input"
import { Select } from "./Select"
import { RichTextEditor } from "./RichTextEditor"

type EntryType = Database["public"]["Enums"]["entry_type"]
type Option = { id: string; name: string }

const ENTRY_TYPES: { value: EntryType; label: string }[] = [
  { value: "aviso", label: "Aviso" },
  { value: "atendimento", label: "Atendimento" },
  { value: "internacao", label: "Internação" },
  { value: "outros", label: "Outros" },
]

const PRIORITIES = [
  { value: "1", label: "Normal" },
  { value: "2", label: "Alta" },
  { value: "3", label: "Baixa" },
]

const toOptions = (list: Option[], placeholder: string) => [
  { value: "", label: placeholder },
  ...list.map((item) => ({ value: item.id, label: item.name })),
]

const idByName = (list: Option[], name: string) => list.find((i) => i.name === name)?.id ?? ""

export function DialogNewEntry({ onClose }: { onClose: () => void }) {
  const { collaborators, currentShiftCollaborators, sectors, healthInsurances, reload } = usePackage()

  const [type, setType] = useState<EntryType>("aviso")
  const [priority, setPriority] = useState("1")
  const [sectorId, setSectorId] = useState(() => idByName(sectors, "SAME"))
  const [healthInsuranceId, setHealthInsuranceId] = useState(() => idByName(healthInsurances, "SUS"))
  // com uma pessoa só na escala (noturno), já vem selecionada
  const [collaboratorId, setCollaboratorId] = useState(() =>
    currentShiftCollaborators.length === 1 ? currentShiftCollaborators[0].id : ""
  )
  const [time, setTime] = useState(currentTime)
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // quem está de plantão agora vem primeiro (a ordem alfabética dentro de cada grupo é mantida)
  const collaboratorOptions = useMemo(() => {
    const onDuty = new Set(currentShiftCollaborators.map((c) => c.id))
    const sorted = [...collaborators].sort((a, b) => Number(onDuty.has(b.id)) - Number(onDuty.has(a.id)))
    return [
      { value: "", label: "Selecione" },
      ...sorted.map((c) => ({ value: c.id, label: onDuty.has(c.id) ? `${c.name} (plantão)` : c.name })),
    ]
  }, [collaborators, currentShiftCollaborators])

  const canSave = collaboratorId !== "" && description.trim() !== "" && /^\d{2}:\d{2}$/.test(time)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSave || saving) return

    setSaving(true)
    setError(null)
    try {
      await createEntry({
        type,
        priority: Number(priority),
        collaboratorId,
        sectorId: sectorId || null,
        healthInsuranceId: healthInsuranceId || null,
        occurredAt: buildOccurredAt(time),
        description: description.trim(),
      })
      await reload()
      onClose()
    } catch {
      setError("Não foi possível salvar o lançamento. Tente novamente.")
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 h-full">
      <div className="flex justify-between gap-10">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <Select label="Tipo" value={type} onChange={(e) => setType(e.target.value as EntryType)} options={ENTRY_TYPES} />
            <Select label="Prioridade" value={priority} onChange={(e) => setPriority(e.target.value)} options={PRIORITIES} />
            <Select label="Setor" value={sectorId} onChange={(e) => setSectorId(e.target.value)} options={toOptions(sectors, "Não informado")} />
          </div>
          <div className="flex flex-col gap-2">
            <Select label="Plantonista *" value={collaboratorId} onChange={(e) => setCollaboratorId(e.target.value)} options={collaboratorOptions} />
            <Select label="Convênio" value={healthInsuranceId} onChange={(e) => setHealthInsuranceId(e.target.value)} options={toOptions(healthInsurances, "Não informado")} />
          </div>
        </div>
        <div>
          <Input label="Horário do Evento" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="text-caption-1 font-medium text-grey-0" htmlFor="description">Descrição *</label>
        <RichTextEditor label="Descrição" placeholder="Descreva o evento..." onChange={setDescription} className="min-h-32" />
      </div>

      {error && <p role="alert" className="caption-1 text-alert">{error}</p>}

      <div className="self-end flex gap-4 items-center">
        <button
          type="submit"
          disabled={!canSave || saving}
          className="bg-brand hover:bg-brand-opacity transition-colors cursor-pointer text-white px-2 py-1.5 rounded disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
        <button type="button" onClick={onClose} disabled={saving} className="cursor-pointer px-2 py-1.5 border border-gray-3 rounded disabled:opacity-50">
          Cancelar
        </button>
      </div>
    </form>
  )
}