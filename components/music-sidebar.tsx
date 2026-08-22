'use client'

import {
    Download,
    Heart,
    History,
    Home,
    Library,
    ListMusic,
    Radio,
    Settings,
    Sparkles,
    Compass,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

const navItems = [
    { label: 'Início', icon: Home, href: '/' },
    { label: 'Descobrir', icon: Compass, href: '/discover' },
    { label: 'Biblioteca', icon: Library, href: '/library' },
    { label: 'Histórico', icon: History, href: '/history' },
]

interface MusicSidebarProps {
    active: string
    onSelect: (label: string) => void
}

export default function MusicSidebar({
    active,
    onSelect,
}: MusicSidebarProps) {
    return (
        <aside
            className="
    fixed
    inset-y-0
    left-0
    z-30
    hidden
    w-60
    flex-col
    border-r
    border-white/8
    bg-[#101110]
    px-5
    py-6
    lg:flex
    overflow-y-auto
    pb-12
  "
        >
            {/* Logo */}
            <div className="mb-12 flex items-center gap-3 px-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-[#d8ff3e] text-[#101110]">
                    <Radio className="size-4" />
                </div>

                <span className="font-mono text-[13px] font-bold tracking-[-0.05em]">
                    BAD VIBES
                    <br />
                    FOREVER
                </span>
            </div>

            {/* Navegação */}
            <p className="mb-3 px-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                Menu
            </p>

            <nav className="flex flex-col gap-1">
                {navItems.map(({ label, icon: Icon, href }) => (
                    <Link
                        key={label}
                        href={href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${active === label
                                ? 'bg-white/8 text-[#d8ff3e]'
                                : 'text-white/55 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Icon className="size-[17px]" />
                        {label}
                    </Link>
                ))}
            </nav>

            {/* Sua música */}
            <p className="mb-3 mt-10 px-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                Sua música
            </p>

            <nav className="flex flex-col gap-1 mb-5">
                {[
                    { label: 'Músicas curtidas', icon: Heart, href: '/liked' },
                    { label: 'Playlists', icon: ListMusic, href: '/playlists' },
                    { label: 'Downloads', icon: Download, href: '/downloads' },
                ].map(({ label, icon: Icon, href }) => (
                    <Link
                        key={label}
                        href={href}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/55 transition-colors hover:bg-white/5 hover:text-white"
                    >
                        <Icon className="size-[17px]" />
                        {label}
                    </Link>
                ))}
            </nav>

            {/* Publicar */}
            <div className="mt-auto rounded-xl bg-[#191b19] p-4">
                <div className="mb-3 flex size-8 items-center justify-center rounded-full bg-[#262a25] text-[#d8ff3e]">
                    <Sparkles className="size-4" />
                </div>

                <p className="text-sm font-medium">
                    Publique sua música
                </p>

                <p className="mt-1 text-xs leading-5 text-white/45">
                    Compartilhe o que você está criando com o mundo.
                </p>

                <Link
                    href="/tracks/upload"
                    className="mt-4 text-xs font-semibold text-[#d8ff3e]"
                >
                    Começar a publicar <span aria-hidden="true">→</span>
                </Link>
            </div>

            {/* Configurações */}
            <Link
                href={'/settings'}
                className="mt-5 flex items-center gap-3 px-3 text-sm text-white/45 hover:text-white mb-12"
            >
                <Settings className="size-[17px]" />
                Configurações
            </Link>
        </aside>
    )
}