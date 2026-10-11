import { useState } from "react"
import { Card } from "../components/Card"

const entryMock = [
  {
    id: "uuid1",
    createdAt: "2026-01-10T08:00:00Z",
    type: "Internação",
    priority: 1,
    colaborator: "Róger",
    sector: "SAME",
    healthInsurance: "Unimed",
    doctor: "Dr. Gente Boa",
    description: "Convênio aceitou atendimento, mas negou a internação. Paciente aguardando leito."
  },
  {
    id: "uuid2",
    createdAt: "2026-01-10T09:30:00Z",
    type: "Aviso",
    priority: 0,
    colaborator: "Róger",
    sector: "SAME",
    description: "Solicitar pulseiras de identificação, papéis. Se possível solicitar também uma caneta azul e um marca texto laranja."
  },
  {
    id: "uuid3",
    createdAt: "2026-01-10T10:15:00Z",
    type: "Internação",
    priority: 2,
    healthInsurance: "Notredame",
    colaborator: "Camila",
    sector: "SAME",
    description: "Código do paciente não bateu com guia do convênio. Paciente orientado a aguardar contato do Hospital após regularização com convênio e médico responsável. Segue o número: 31999999999",
    doctor: "Dr. Encrenca"
  }
]

export function AllShifts() {
  const [shifts, setShifts] = useState(entryMock)

  return (
    <section className="flex flex-col gap-4 p-4">
      <h1 className="title-3">Todos os Plantões</h1>

      <ul className="pb-10 flex flex-col gap-10">
        {shifts.map((shift) => (
          <Card key={shift.id} entry={shift} />
        ))}
      </ul>
    </section>
  )
}