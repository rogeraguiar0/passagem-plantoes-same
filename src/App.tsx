import { useState, type JSX } from "react"

import { Sidebar } from "./components/Sidebar"
import { LastShift } from "./pages/LastShift"
import { AllShifts } from "./pages/AllShifts"
import { Dashboard } from "./pages/Dashboard"
import { Options } from "./pages/Options"
import { Dialog } from "./components/Dialog"
import type { DialogContent } from "./types"
import { Plus } from "lucide-react"
import { DialogNewEntry } from "./components/DialogNewEntry"
import { formatDateTime } from "./utils/date"
import { MyShift } from "./pages/MyShift"

function App() {
  const closeDialog = () => setDialog(() => ({ isOpen: false, children: null, onClose: closeDialog }))

  // Dialog state management
  const [dialog, setDialog] = useState<DialogContent>({ isOpen: false, onClose: closeDialog })


  const newEntry = () => {
    setDialog({
      isOpen: true,
      title: "Lançamento do plantão: " + formatDateTime(new Date()),
      children: <DialogNewEntry onClose={closeDialog} />,
      onClose: () => {
        setDialog((prev) => ({ ...prev, isOpen: false }))
        setPage("myShift")
      }
    })
  }

  // Page state management
  const [page, setPage] = useState("lastShift")

  const pages: Record<string, JSX.Element> = {
    lastShift: <LastShift setDialog={setDialog} />,
    myShift: <MyShift setDialog={setDialog} />,
    allShifts: <AllShifts setDialog={setDialog} />,
    dashboard: <Dashboard />,
    options: <Options />
  }
  const actualPage: JSX.Element = pages[page]

  return (
    <div className="flex">
      <Sidebar page={page} setPage={setPage} />

      <div className="flex w-full h-screen overflow-y-scroll">
        <main className="w-full h-full flex justify-between flex-10">
          {actualPage}
        </main>

        <Dialog dialog={dialog} />

        <aside className="w-full flex-1 mt-20 pl-8">
          <button
            className="bg-brand hover:bg-brand-opacity transition-colors p-2 rounded-lg text-white cursor-pointer"
            onClick={newEntry}>
            <Plus />
          </button>
        </aside>
      </div>
    </div>
  )
}

export default App
