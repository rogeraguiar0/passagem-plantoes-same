import { useState, type JSX } from "react"

import { Sidebar } from "./components/Sidebar"
import { LastShift } from "./pages/LastShift"
import { AllShifts } from "./pages/AllShifts"
import { Dashboard } from "./pages/Dashboard"
import { Options } from "./pages/Options"
import { Dialog } from "./components/Dialog"
import type { DialogContent } from "./types"

function App() {
  // Dialog state management
  const [dialog, setDialog] = useState<DialogContent>({ isOpen: false, onClose: () => setDialog((prev) => ({ ...prev, isOpen: false })) })

  // Page state management
  const [page, setPage] = useState("lastShift")

  const pages: Record<string, JSX.Element> = {
    lastShift: <LastShift setDialog={setDialog} />,
    allShifts: <AllShifts setDialog={setDialog} />,
    dashboard: <Dashboard />,
    options: <Options />
  }
  const actualPage: JSX.Element = pages[page]

  return (
    <div className="flex">
      <Sidebar page={page} setPage={setPage} />

      <main className="w-full h-screen overflow-auto flex justify-between">
        {actualPage}
      </main>

      <Dialog dialog={dialog} />
    </div>
  )
}

export default App
