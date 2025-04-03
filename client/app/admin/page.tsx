'use client'
import { Anapod } from "@impactium/anapod"
import { Runtime } from "./components/runtime"

export default function AdminPage() {
  return (
    <main>
      <Anapod.Context.Provider ai='flex-start' dir='column'>
        <Runtime row='1 / 5' column='1 / 2' />
      </Anapod.Context.Provider>
    </main>
  )
}
