'use client'

import { useState } from 'react'
import {
  Bell,
  ChevronRight,
  Download,
  Globe,
  Lock,
  LogOut,
  Moon,
  Shield,
  User,
  Volume2,
  Library
} from 'lucide-react'
import { Toaster, toast } from 'sonner'

import MusicSidebar from './music-sidebar'
import MusicHeader from './music-header'
import MusicPlayer from './music-player'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

const sections = [
  {
    title: 'Conta',
    items: [
      {
        id: 'profile',
        label: 'Perfil',
        href: '/profile',
        description: 'Nome, foto e informações públicas',
        icon: User,
      },
      {
        id: 'library',
        label: 'Biblioteca do autor',
        href: '/my-music',
        description: 'Gerencie suas músicas publicadas',
        icon: Library,
      },
      {
        id: 'security',
        label: 'Segurança',
        href: '/settings/security',
        description: 'Senha e proteção da conta',
        icon: Lock,
      },
    ],
  },
  {
    title: 'Preferências',
    items: [
      {
        id: 'language',
        label: 'Idioma',
        href: '/settings/language',
        description: 'Português (Angola)',
        icon: Globe,
      },
      {
        id: 'privacy',
        label: 'Privacidade',
        href: '/settings/privacy',
        description: 'Controle seus dados e atividade',
        icon: Shield,
      },
    ],
  },
]

export default function SettingsPage() {
  const [active, setActive] = useState('Configurações')
  const [query, setQuery] = useState('')

  const [notifications, setNotifications] = useState(true)
  const [autoplay, setAutoplay] = useState(true)
  const [highQuality, setHighQuality] = useState(true)

  const { logout } = useAuth();
  const router = useRouter();

  const logOut = () => {
    logout();
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-[#0c0d0c] text-white">
      <MusicSidebar
        active={active}
        onSelect={setActive}
      />

      <main className="min-h-screen pb-32 lg:pl-60">
        <MusicHeader
          query={query}
          setQuery={setQuery}
        />

        <div className="mx-auto max-w-[1100px] px-5 py-8 md:px-9 md:py-10">
          <div className="mb-10">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#d8ff3e]">
              Conta
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
              Configurações
            </h1>

            <p className="mt-2 text-sm text-white/45">
              Personalize sua experiência no Bad Vibes Forever.
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-3 px-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                  {section.title}
                </h2>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#131513]">
                  {section.items.map((item) => {
                    const Icon = item.icon

                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="flex w-full items-center gap-4 border-b border-white/7 px-5 py-4 text-left transition-colors last:border-0 hover:bg-white/[0.03]"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/50">
                          <Icon className="size-[18px]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">
                            {item.label}
                          </p>

                          <p className="mt-1 text-xs text-white/40">
                            {item.description}
                          </p>
                        </div>

                        <ChevronRight className="size-4 text-white/20" />
                      </Link>
                    )
                  })}
                </div>
              </section>
            ))}

            {/*<section>
              <h2 className="mb-3 px-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                Reprodução rápida
              </h2>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#131513]">
                <ToggleRow
                  label="Notificações"
                  description="Receber novidades e atualizações"
                  checked={notifications}
                  onChange={setNotifications}
                />

                <ToggleRow
                  label="Reprodução automática"
                  description="Continuar tocando músicas semelhantes"
                  checked={autoplay}
                  onChange={setAutoplay}
                />

                <ToggleRow
                  label="Alta qualidade"
                  description="Priorizar melhor qualidade de áudio"
                  checked={highQuality}
                  onChange={setHighQuality}
                />
              </div>
            </section>*/}

            <section>
              <button
                type="button"
                onClick={logOut}
                className="flex w-full items-center gap-4 rounded-2xl border border-red-500/10 bg-red-500/[0.03] px-5 py-4 text-left transition-colors hover:bg-red-500/[0.06]"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <LogOut className="size-[18px]" />
                </div>

                <div>
                  <p className="text-sm font-medium text-red-400">
                    Terminar sessão
                  </p>

                  <p className="mt-1 text-xs text-white/35">
                    Sair desta conta neste dispositivo
                  </p>
                </div>
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

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
    <div className="flex items-center justify-between gap-6 border-b border-white/7 px-5 py-4 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white">
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-white/40">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative flex h-6 w-11 shrink-0 items-center rounded-full
          transition-colors duration-200
          ${checked
            ? 'bg-[#d8ff3e]'
            : 'bg-white/10'
          }
        `}
      >
        <span
          className={`
            block size-4 rounded-full transition-transform duration-200
            ${checked
              ? 'translate-x-6 bg-[#101110]'
              : 'translate-x-1 bg-white/50'
            }
          `}
        />
      </button>
    </div>
  )
}