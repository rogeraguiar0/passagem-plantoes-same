export function formatDateTime(value: string | Date) {
  const d = new Date(value)
  const date = d.toLocaleDateString('pt-BR')
  const hour = String(d.getHours()).padStart(2, '0')
  const minutes = d.getMinutes()
  const time = minutes
    ? `${hour}h${String(minutes).padStart(2, '0')}`
    : `${hour}h`
  return `${date} às ${time}`
}