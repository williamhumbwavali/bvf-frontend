'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  KeyRound,
  LogOut,
  Monitor,
  Shield,
  Smartphone,
} from 'lucide-react'
import { toast } from 'sonner'

const sessions = [
  {
    id: 'current',
    device: 'Windows',
    browser: 'Chrome',
    location: 'Luanda, Angola',
    lastActive: 'Agora',
    current: true,
    icon: Monitor,
  },
  {
    id: 'mobile',
    device: 'Android',
    browser: 'Chrome Mobile',
    location: 'Luanda, Angola',
    lastActive: 'Há 2 horas',
    current: false,
    icon: Smartphone,
  },
]

export default function SecuritySettings() {
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handlePasswordChange = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Preencha todos os campos.')
      return
    }

    if (newPassword.length < 8) {
      toast.error('A nova senha deve ter pelo menos 8 caracteres.')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem.')
      return
    }

    setSaving(true)

    // Substituir posteriormente pela API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSaving(false)

    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setShowPasswordForm(false)

    toast.success('Senha alterada com sucesso.')
  }

  const handleLogoutSession = (id: string) => {
    if (id === 'current') {
      toast.info('Você está usando esta sessão.')
      return
    }

    toast.success('Sessão encerrada.')
  }

  const handleLogoutAll = () => {
    toast.success('Todas as outras sessões foram encerradas.')
  }

  return (
    <main className="min-h-screen bg-[#0c0d0c] text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/8 bg-[#0c0d0c]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-[72px] max-w-4xl items-center justify-between px-5 md:px-8">
          <Link
            href="/settings"
            className="flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Configurações
          </Link>

          <div className="hidden items-center gap-2 sm:flex">

            <span className="font-mono text-[11px] font-bold tracking-[-0.04em]">
              BAD VIBES FOREVER
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-8 md:px-8 md:py-12">
        {/* Título */}
        <div className="mb-10">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#d8ff3e]">
            Conta
          </p>

          <h1 className="text-3xl font-semibold tracking-[-0.05em] md:text-4xl">
            Segurança
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Gerencie sua senha, sessões e proteção da sua conta.
          </p>
        </div>

        {/* Status de segurança */}
        <section className="mb-6 rounded-2xl border border-white/10 bg-[#131513] p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#d8ff3e]/10 text-[#d8ff3e]">
              <Shield className="size-5" />
            </div>

            <div className="flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold">
                    Sua conta está protegida
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-white/40">
                    Sua senha está configurada e sua sessão atual está
                    protegida.
                  </p>
                </div>

                <div className="flex w-fit items-center gap-1.5 rounded-full bg-[#d8ff3e]/10 px-3 py-1.5 text-[10px] font-semibold text-[#d8ff3e]">
                  <Check className="size-3" />
                  Protegida
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Senha */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[#131513]">
          <div className="flex items-center gap-4 p-6 md:p-8">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/60">
              <KeyRound className="size-5" />
            </div>

            <div className="flex-1">
              <h2 className="font-semibold">
                Senha
              </h2>

              <p className="mt-1 text-xs text-white/35">
                Altere sua senha regularmente para manter sua conta segura.
              </p>
            </div>

            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="flex items-center gap-1 text-xs font-semibold text-[#d8ff3e] hover:underline"
            >
              Alterar
              <ChevronRight className="size-3.5" />
            </button>
          </div>

          {showPasswordForm && (
            <form
              onSubmit={handlePasswordChange}
              className="border-t border-white/8 bg-[#101210] p-6 md:p-8"
            >
              <div className="max-w-xl space-y-5">
                <div>
                  <label
                    htmlFor="current-password"
                    className="mb-2 block text-xs font-medium text-white/60"
                  >
                    Senha atual
                  </label>

                  <input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(event.target.value)
                    }
                    autoComplete="current-password"
                    className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm outline-none focus:border-[#d8ff3e]/60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-password"
                    className="mb-2 block text-xs font-medium text-white/60"
                  >
                    Nova senha
                  </label>

                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(event.target.value)
                    }
                    autoComplete="new-password"
                    placeholder="Mínimo de 8 caracteres"
                    className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm outline-none placeholder:text-white/20 focus:border-[#d8ff3e]/60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="mb-2 block text-xs font-medium text-white/60"
                  >
                    Confirmar nova senha
                  </label>

                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    autoComplete="new-password"
                    className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm outline-none focus:border-[#d8ff3e]/60"
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="h-10 rounded-lg border border-white/10 px-4 text-xs text-white/50 hover:bg-white/5 hover:text-white"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="h-10 rounded-lg bg-[#d8ff3e] px-5 text-xs font-bold text-[#101110] disabled:opacity-50"
                  >
                    {saving ? 'Salvando...' : 'Atualizar senha'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </section>

        {/* Recuperação */}
        <section className="mb-6 rounded-2xl border border-white/10 bg-[#131513]">
          <Link
            href="/forgot-password"
            className="flex items-center gap-4 p-6 transition-colors hover:bg-white/[0.02] md:p-8"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/60">
              <KeyRound className="size-5" />
            </div>

            <div className="flex-1">
              <h2 className="font-semibold">
                Recuperação de senha
              </h2>

              <p className="mt-1 text-xs text-white/35">
                Solicite um novo link caso não consiga acessar sua conta.
              </p>
            </div>

            <ChevronRight className="size-4 text-white/25" />
          </Link>
        </section>

        {/* Sessões */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[#131513]">
          <div className="flex items-center justify-between border-b border-white/8 p-6 md:p-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                Acesso
              </p>

              <h2 className="mt-1 font-semibold">
                Sessões ativas
              </h2>

              <p className="mt-1 text-xs text-white/35">
                Dispositivos onde sua conta está conectada.
              </p>
            </div>
          </div>

          <div>
            {sessions.map((session) => {
              const Icon = session.icon

              return (
                <div
                  key={session.id}
                  className="flex items-center gap-4 border-b border-white/8 p-5 last:border-b-0 md:px-8"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/45">
                    <Icon className="size-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {session.device}
                      </p>

                      {session.current && (
                        <span className="rounded-full bg-[#d8ff3e]/10 px-2 py-0.5 text-[9px] font-semibold text-[#d8ff3e]">
                          ESTE DISPOSITIVO
                        </span>
                      )}
                    </div>

                    <p className="mt-1 truncate text-xs text-white/35">
                      {session.browser} · {session.location}
                    </p>

                    <p className="mt-1 text-[10px] text-white/20">
                      Ativo {session.lastActive}
                    </p>
                  </div>

                  <button
                    onClick={() => handleLogoutSession(session.id)}
                    className="text-xs text-white/30 hover:text-red-400"
                  >
                    Encerrar
                  </button>
                </div>
              )
            })}
          </div>

          <div className="border-t border-white/8 p-5 md:px-8">
            <button
              onClick={handleLogoutAll}
              className="flex items-center gap-2 text-xs font-semibold text-red-400/80 hover:text-red-400"
            >
              <LogOut className="size-4" />
              Encerrar todas as outras sessões
            </button>
          </div>
        </section>

        {/* Aviso */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <p className="text-xs leading-5 text-white/30">
            Se você perceber alguma atividade que não reconhece, altere sua
            senha imediatamente e encerre todas as outras sessões.
          </p>
        </div>
      </div>
    </main>
  )
}