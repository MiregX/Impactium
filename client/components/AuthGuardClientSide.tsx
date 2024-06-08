'use client'

import { useUser } from "@/context/User"
import { redirect } from "next/navigation";

export function AuthGuardClientSide() {
  const { user } = useUser();
  return user ? null : redirect('/')
}