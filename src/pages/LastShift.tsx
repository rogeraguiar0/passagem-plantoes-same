import { getShiftKey, previousShift } from "../utils/date"
import { Card } from "../components/Card"
import type { LastShiftProps } from "../types"
import { usePackage } from "../contexts/PackageContext"

export function LastShift({ setDialog }: LastShiftProps) {
  const { lastShiftEntries, lastShiftCollaborators } = usePackage()

  const getTitle = () => {
    const SHIFT_LABEL = {
      day: "7h às 19h",
      night: "19h às 07h",
    }

    const key = getShiftKey()
    const previousKey = previousShift(key)
    const [year, month, day] = previousKey.shiftDate.split("-")

    return `${day}/${month}/${year} - ${SHIFT_LABEL[previousKey.period]}`
  }

  const formatCollaborators = () => {
    const text = lastShiftCollaborators.map((collaborator) => collaborator.name + " - ").join("")

    return text.slice(0, text.length - 2)
  }

  return (
    <section className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="title-3">Último Plantão: {getTitle()}</h1>
        <p className="caption-1">Plantonista{lastShiftCollaborators.length > 1 ? "s" : ""}: {formatCollaborators()}</p>
      </div>

      <ul className="pb-10 flex flex-col gap-10">
        {lastShiftEntries.length > 0 ? lastShiftEntries.map((shift) => (
          <Card key={shift.id} entry={shift} setDialog={setDialog} />
        )) : <p className="mt-4 text-gray-1">Não houveram lançamentos no último plantão</p>}
      </ul>
    </section>
  )
}