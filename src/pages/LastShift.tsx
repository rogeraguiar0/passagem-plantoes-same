import { useState } from "react"
import { getShift } from "../utils/date"
import { Card } from "../components/Card"
import type { LastShiftProps } from "../types"

const shiftMock = [
  {
    id: "uuid1",
    createdAt: "2026-01-12T03:40:00",
    type: "Atendimento",
    priority: 2,
    colaborator: "Róger",
    healthInsurance: "SUS",
    sector: "Recepção",
    description: "Criança trazida pelos pais sem documento por conta da urgência. Disse o CPF errado e a data de nascimento errada, impossibilidade de encontrar no sistema e equipe cobrando ficha, portanto, foi tirada à mão. Fluxo de atendimento alto durante a madrugada, ao tirar registro notei a incompatibilidade dos dados pois não havia informações no SP Data e nem no CADSUS.",
    status: "concluded",
    observations: [
      {
        id: "uuid1",
        colaborator: "Róger",
        createdAt: "2026-01-12T05:30:00",
        content: "Após várias tentativas com nome parcial do paciente e nome da mãe completo, consegui encontrar dados da criança pelo CADSUS, registro no SP Data completo"
      },
      {
        id: "uuid2",
        colaborator: "Róger",
        createdAt: "2026-01-12T06:00:00",
        content: "Guia SP Data anexada à ficha manual"
      }
    ]
  },
  {
    id: "uuid2",
    createdAt: "2026-01-10T19:30:00",
    type: "Aviso",
    priority: 0,
    colaborator: "Róger",
    sector: "SAME",
    description: "Solicitar pulseiras de identificação, papéis. Se possível solicitar também uma caneta azul e um marca texto laranja.",
    status: "pending"
  },
]

export function LastShift({ setDialog }: LastShiftProps) {
  const [entries, setEntries] = useState(shiftMock)

  return (
    <section className="flex flex-col gap-4 p-4">
      <h1 className="title-3">Último Plantão: {getShift(shiftMock[0].createdAt, true)} ({shiftMock[0].colaborator})</h1>

      <ul className="pb-10 flex flex-col gap-10">
        {entries.map((shift) => (
          <Card key={shift.id} entry={shift} setDialog={setDialog} />
        ))}
      </ul>
    </section>
  )
}