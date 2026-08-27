'use client'

import { useState } from 'react'
import { ChevronLeft, Eye, Lock, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast, Toaster } from 'sonner'

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-white/7 px-5 py-5 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white">{label}</p>

        <p className="mt-1 max-w-2xl text-xs leading-5 text-white/40">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`
          relative flex h-6 w-11 shrink-0 items-center rounded-full
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-[#d8ff3e]/30
          ${
            checked
              ? 'bg-[#d8ff3e]'
              : 'bg-white/10 hover:bg-white/15'
          }
        `}
      >
        <span
          className={`
            block size-4 rounded-full transition-transform duration-200
            ${
              checked
                ? 'translate-x-6 bg-[#101110]'
                : 'translate-x-1 bg-white/50'
            }
          `}
        />
      </button>
    </div>
  )
}

export default function PrivacyPage() {
  const router = useRouter()

  const [publicProfile, setPublicProfile] = useState(true)
  const [showActivity, setShowActivity] = useState(true)
  const [showLikedSongs, setShowLikedSongs] = useState(true)
  const [showPlaylists, setShowPlaylists] = useState(true)
  const [showFollowers, setShowFollowers] = useState(true)

  const handleChange = (
    setter: (value: boolean) => void,
    value: boolean,
    message: string,
  ) => {
    setter(value)
    toast.success(message)
  }

  return (
    <div className="min-h-screen bg-[#0c0d0c] text-white mb-12">
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: '#1b1e1b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,.1)',
          },
        }}
      />

      <main className="mx-auto min-h-screen w-full max-w-3xl px-5 py-8 md:px-8 md:py-12">
        {/* Header */}
        <header className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-white"
          >
            <ChevronLeft className="size-4" />
            Voltar
          </button>

          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#d8ff3e]/10 text-[#d8ff3e]">
              <ShieldCheck className="size-5" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                Privacidade
              </h1>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Controle quem pode ver suas informações e sua atividade no
                Bad Vibes Forever.
              </p>
            </div>
          </div>
        </header>

        {/* Perfil */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[#131513]">
          <div className="border-b border-white/8 px-5 py-4">
            <div className="flex items-center gap-3">
              <Eye className="size-4 text-[#d8ff3e]" />

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                  Perfil
                </p>

                <h2 className="mt-1 text-sm font-medium">
                  Visibilidade do perfil
                </h2>
              </div>
            </div>
          </div>

          <ToggleRow
            label="Perfil público"
            description="Permite que outros usuários encontrem e visualizem seu perfil."
            checked={publicProfile}
            onChange={(value) =>
              handleChange(
                setPublicProfile,
                value,
                value
                  ? 'Seu perfil agora é público'
                  : 'Seu perfil agora é privado',
              )
            }
          />
        </section>

        {/* Conteúdo */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[#131513]">
          <div className="border-b border-white/8 px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
              Conteúdo
            </p>

            <h2 className="mt-1 text-sm font-medium">
              O que outras pessoas podem ver
            </h2>
          </div>

          <ToggleRow
            label="Playlists"
            description="Permite que outras pessoas vejam suas playlists públicas."
            checked={showPlaylists}
            onChange={(value) =>
              handleChange(
                setShowPlaylists,
                value,
                value
                  ? 'Playlists visíveis'
                  : 'Playlists ocultas',
              )
            }
          />

          <ToggleRow
            label="Seguidores e seguindo"
            description="Permite que outras pessoas vejam quem você segue e quem segue você."
            checked={showFollowers}
            onChange={(value) =>
              handleChange(
                setShowFollowers,
                value,
                value
                  ? 'Seguidores visíveis'
                  : 'Seguidores ocultos',
              )
            }
          />
        </section>

        {/* Privacidade da conta */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#131513]">
          <div className="border-b border-white/8 px-5 py-4">
            <div className="flex items-center gap-3">
              <Lock className="size-4 text-[#d8ff3e]" />

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                  Conta
                </p>

                <h2 className="mt-1 text-sm font-medium">
                  Privacidade da conta
                </h2>
              </div>
            </div>
          </div>

          <div className="px-5 py-5">
            <p className="text-sm font-medium">
              Seus dados pertencem a você
            </p>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-white/40">
              Suas informações pessoais, histórico e preferências são
              associados à sua conta e não são exibidos publicamente além do
              que você escolher compartilhar.
            </p>
          </div>
        </section>

        {/* Nota */}
        <p className="mt-5 px-1 text-xs leading-5 text-white/30">
          Essas opções controlam a visibilidade das informações no seu perfil.
          Algumas informações básicas, como seu nome de usuário, podem
          continuar visíveis para permitir que outras pessoas encontrem sua
          conta.
        </p>
      </main>
    </div>
  )
}