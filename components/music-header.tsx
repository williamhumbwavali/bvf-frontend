'use client'

import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/auth-context'

interface MusicHeaderProps {
  query: string
  setQuery: (value: string) => void
}

export default function MusicHeader({
  query,
  setQuery,
}: MusicHeaderProps) {
  const { user } = useAuth()

  const initials = user?.name
    ? user.name
      .split(' ')
      .map((name) => name[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    : 'U'

  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center gap-4 border-b border-white/8 bg-[#0c0d0c]/95 px-5 backdrop-blur-sm md:px-9">
      {/* Menu mobile */}
      <button
        className="lg:hidden"
        aria-label="Abrir menu"
        onClick={() => toast.info('Menu de navegação')}
      >
        <Menu className="size-5" />
      </button>

      {/* Pesquisa */}
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/35" />

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Pesquisar músicas, artistas, playlists..."
          className="h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-9 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#d8ff3e]/60"
        />

        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
            aria-label="Limpar pesquisa"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Notificações */}
      <button
        aria-label="Notificações"
        onClick={() =>
          toast.info('Nenhuma notificação nova')
        }
        className="text-white/50 hover:text-white"
      >
        <Bell className="size-[18px]" />
      </button>

      {/* Perfil */}
      <Link
        href={user ? "/profile" : "/login"}
        className="flex items-center gap-2 rounded-full transition-opacity hover:opacity-80"
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name || "Avatar"}
            className="size-8 shrink-0 rounded-full border-4 border-[#131513] object-cover"
          />
        ) : (
          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-full border-4 border-[#131513] bg-[#d8ff3e] text-sm font-bold text-[#101110]"
            aria-hidden="true"
          >
            {user ? initials : "?"}
          </div>
        )}

        <div className="hidden min-w-0 flex-col sm:flex">
          <span className="max-w-[120px] truncate text-xs font-medium text-white">
            {user?.name || "Login"}
          </span>

          {user?.username && (
            <span className="max-w-[120px] truncate text-[10px] text-white/35">
              @{user.username}
            </span>
          )}
        </div>

        {user && (
          <ChevronDown
            className="hidden size-4 shrink-0 text-white/45 sm:block"
            aria-hidden="true"
          />
        )}
      </Link>
    </header>
  )
}