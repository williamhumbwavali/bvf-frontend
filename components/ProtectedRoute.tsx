"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [isLoading, isAuthenticated, router])

  // Enquanto verifica a sessão, não interfere no layout
  if (isLoading) {
    return null
  }

  // Usuário não autenticado: não renderiza o conteúdo
  if (!isAuthenticated) {
    return null
  }

  // Autenticado: renderiza normalmente
  return <>{children}</>
}