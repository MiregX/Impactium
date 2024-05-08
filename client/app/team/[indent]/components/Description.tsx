'use client'
import { useTeam } from "@/context/Team"

export function Description({ isEditable }) {
  const { team } = useTeam();

  const lorem = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, animi ipsam dolore deserunt blanditiis officia labore cupiditate esse. Asperiores pariatur totam nemo voluptates atque vero laboriosam ad deleniti possimus architecto?"

  const component = isEditable
    ? <textarea>{team.description || lorem}</textarea>
    : <p>{team.description || lorem}</p>

  return component
}