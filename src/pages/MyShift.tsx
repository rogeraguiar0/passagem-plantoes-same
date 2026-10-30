import { Card } from "../components/Card"
import { usePackage } from "../contexts/PackageContext"
import type { MyShiftProps } from "../types"
import { getShiftKey } from "../utils/date"

export function MyShift({ setDialog }: MyShiftProps) {
  const { currentShiftEntries, currentShiftCollaborators } = usePackage()

  const getTitle = () => {
    const SHIFT_LABEL = {
      day: "7h às 19h",
      night: "19h às 07h",
    }

    const key = getShiftKey()
    const [year, month, day] = key.shiftDate.split("-")

    return `${day}/${month}/${year} - ${SHIFT_LABEL[key.period]}`
  }

  const formatCollaborators = () => {
    const text = currentShiftCollaborators.map((collaborator) => collaborator.name + " - ").join("")

    return text.slice(0, text.length - 2)
  }

  return (
    <section className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="title-3">Plantão Atual: {getTitle()}</h1>
        <p className="caption-1">Plantonista{currentShiftCollaborators.length > 1 ? "s" : ""}: {formatCollaborators()}</p>
      </div>

      <ul className="pb-10 flex flex-col gap-10">
        {currentShiftEntries.length > 0 ? currentShiftEntries.map((shift) => (
          <Card key={shift.id} entry={shift} setDialog={setDialog} />
        )) : <p className="mt-4 text-gray-1">Não houveram lançamentos no último plantão</p>}
      </ul>
    </section>
  )
}