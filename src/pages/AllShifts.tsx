import { useEffect, useRef, useState } from "react"
import { Card } from "../components/Card"
import { Select } from "../components/Select"
import { usePackage } from "../contexts/PackageContext"
import { PAGE_SIZE, getEntriesPage } from "../services/entries"
import { EMPTY_FILTERS, type AllShiftsProps, type EntryFilters, type FilteredEntry } from "../types"

const TYPE_OPTIONS = [
  { value: "", label: "Todos os tipos" },
  { value: "internacao", label: "Internação" },
  { value: "atendimento", label: "Atendimento" },
  { value: "aviso", label: "Aviso" },
  { value: "outros", label: "Outros" },
]

const STATUS_OPTIONS = [
  { value: "", label: "Todos os status" },
  { value: "pending", label: "Pendente" },
  { value: "concluded", label: "Concluído" },
]

const toOptions = (placeholder: string, list: { id: string; name: string }[]) => [
  { value: "", label: placeholder },
  ...list.map((item) => ({ value: item.id, label: item.name })),
]

export function AllShifts({ setDialog }: AllShiftsProps) {
  const { collaborators, sectors, healthInsurances } = usePackage()

  const [filters, setFilters] = useState<EntryFilters>(EMPTY_FILTERS)
  const [termInput, setTermInput] = useState("") // o que está digitado
  const [page, setPage] = useState(0)
  const [reloadKey, setReloadKey] = useState(0)

  const [entries, setEntries] = useState<FilteredEntry[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const topRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const id = setTimeout(() => {
      setFilters((f) => (f.term === termInput ? f : { ...f, term: termInput }))
      setPage(0)
    }, 400)
    return () => clearTimeout(id)
  }, [termInput])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)

    getEntriesPage(filters, page)
      .then((result) => {
        if (cancelled) return
        setEntries(result.entries)
        setTotal(result.total)
      })
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [filters, page, reloadKey])

  const updateFilter = <K extends Exclude<keyof EntryFilters, "term">>(
    key: K,
    value: EntryFilters[K]
  ) => {
    setFilters((f) => ({ ...f, [key]: value }))
    setPage(0)
  }

  const clearFilters = () => {
    setTermInput("")
    setFilters(EMPTY_FILTERS)
    setPage(0)
  }

  const goToPage = (next: number) => {
    setPage(next)
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const reload = () => setReloadKey((k) => k + 1)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const hasActiveFilters = termInput !== "" || Object.values(filters).some(Boolean)

  return (
    <section ref={topRef} className="flex flex-col gap-4 p-4">
      <h1 className="title-3">Todos os Plantões</h1>

      <div className="flex flex-col gap-2">
        <input
          type="search"
          value={termInput}
          onChange={(e) => setTermInput(e.target.value)}
          placeholder="Buscar na descrição..."
          className="caption-1 w-full rounded-lg border bg-white px-2 py-1 outline-none"
        />

        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          <input
            type="date"
            value={filters.date}
            onChange={(e) => updateFilter("date", e.target.value)}
            aria-label="Data"
            className="caption-1 rounded-lg border bg-white px-2 py-1 outline-none"
          />
          <Select
            value={filters.type}
            onChange={(e) => updateFilter("type", e.target.value as EntryFilters["type"])}
            options={TYPE_OPTIONS}
          />
          <Select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value as EntryFilters["status"])}
            options={STATUS_OPTIONS}
          />
          <Select
            value={filters.collaboratorId}
            onChange={(e) => updateFilter("collaboratorId", e.target.value)}
            options={toOptions("Todos os plantonistas", collaborators)}
          />
          <Select
            value={filters.sectorId}
            onChange={(e) => updateFilter("sectorId", e.target.value)}
            options={toOptions("Todos os setores", sectors)}
          />
          <Select
            value={filters.healthInsuranceId}
            onChange={(e) => updateFilter("healthInsuranceId", e.target.value)}
            options={toOptions("Todos os convênios", healthInsurances)}
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="caption-1">
            {loading && entries.length === 0 ? "Carregando..." : `${total} lançamento(s)`}
          </p>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="caption-1 cursor-pointer underline">
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {error ? (
        <div role="alert" className="flex flex-col items-start gap-2">
          <p className="text-alert">Não foi possível carregar os lançamentos.</p>
          <button type="button" onClick={reload} className="cursor-pointer underline">
            Tentar de novo
          </button>
        </div>
      ) : entries.length === 0 && !loading ? (
        <p className="caption-1">Nenhum lançamento encontrado.</p>
      ) : (
        <ul className={`flex flex-col gap-10 pb-6 transition-opacity ${loading ? "opacity-50" : ""}`}>
          {entries.map((shift) => (
            <Card key={shift.id} entry={shift} setDialog={setDialog} onChanged={reload} />
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav aria-label="Paginação" className="flex items-center justify-center gap-4 pb-10">
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page === 0 || loading}
            className="cursor-pointer rounded-lg border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="caption-1">Página {page + 1} de {totalPages}</span>
          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={page + 1 >= totalPages || loading}
            className="cursor-pointer rounded-lg border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Próxima
          </button>
        </nav>
      )}
    </section>
  )
}