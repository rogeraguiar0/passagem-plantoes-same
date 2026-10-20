import { LoaderCircle } from "lucide-react";

export function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex items-center flex-col gap-2">
        <h3>Carregando...</h3>
        <LoaderCircle className="animate-spin" />
      </div>
    </div>
  )
}