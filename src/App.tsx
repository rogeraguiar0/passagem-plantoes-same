import { useState, type JSX } from "react"

import { Sidebar } from "./components/Sidebar"
import { LastShift } from "./pages/LastShift"
import { AllShifts } from "./pages/AllShifts"
import { Dashboard } from "./pages/Dashboard"
import { Options } from "./pages/Options"

function App() {
  // Page state management
  const [page, setPage] = useState("lastShift")

  const pages: Record<string, JSX.Element> = {
    lastShift: <LastShift />,
    allShifts: <AllShifts />,
    dashboard: <Dashboard />,
    options: <Options />
  }
  const actualPage: JSX.Element = pages[page]

  return (
    <div className="flex">
      <Sidebar setPage={setPage} />

      <main className="w-full h-screen overflow-auto">
        {actualPage}
      </main>
    </div>
  )
}

export default App
