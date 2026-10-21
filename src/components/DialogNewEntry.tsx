import { Input } from "./Input";
import { Select } from "./Select";
import { usePackage } from "../contexts/PackageContext";

export function DialogNewEntry() {
  const { collaborators, sectors } = usePackage()

  const dataToSelect = (data: { id: string, name: string }[]) => {
    const dataToSelect = data.flatMap((item) => ({ value: item.id, label: item.name }))

    return dataToSelect
  }

  const entryType = [{ value: "aviso", label: "Aviso" }, { value: "atendimento", label: "Atendimento" }, { value: "portaria", label: "Portaria" }, { value: "internacao", label: "Internação" }, { value: "outros", label: "Outros" }]

  const entryPriority = [{ value: "1", label: "Normal" }, { value: "0", label: "Baixo" }, { value: "2", label: "Alto" }]

  const now = new Date().toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between gap-10">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <Select label="Tipo" options={entryType} />
            <Select label="Prioridade" options={entryPriority} />
            <Select label="Setor" options={dataToSelect(sectors)} />
          </div>
          <div className="flex flex-col gap-2">
            <Select label="Plantonista" options={dataToSelect(collaborators)} />
          </div>
        </div>
        <div>
          <Input defaultValue={now} label="Horário do Evento" placeholder="07:00" />
        </div>
      </div>

      <div>
        <label className="text-caption-1 font-medium text-grey-0" htmlFor="description">Descrição *</label>
        <textarea
          className="w-full text-black caption-1 rounded-lg border bg-white px-2 py-1 text-grey-0 outline-none placeholder:text-gray-2 disabled:cursor-not-allowed disabled:bg-grey-3/30 resize-none h-24"
          placeholder="Descreva o evento..."
          id="description"
          name="description"
        />
      </div>

      <div className="self-end flex gap-4 items-center">
        <button className="bg-brand hover:bg-brand-opacity transition-colors cursor-pointer text-white px-2 py-1.5 rounded">
          Salvar
        </button>
        <button className="cursor-pointer px-2 py-1.5 border border-gray-3 rounded">
          Cancelar
        </button>
      </div>
    </div>
  )
}