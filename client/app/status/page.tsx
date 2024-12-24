'use client'
import { Anapod } from "@impactium/anapod";

export default function StatusPage() {
  return (
    <Anapod.Context.Provider>
      <Anapod.Components.Runtime row='1 / 5' column='1 / 2' />
      <Anapod.Components.Overall row='5 / 7' column='1 / 2' />
      <Anapod.Components.Paths row='1 / 7' column='2 / 6' />
    </Anapod.Context.Provider>
  )
}