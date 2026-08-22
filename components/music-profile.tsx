'use client'

import { useMemo, useState } from 'react'
import {
  CalendarDays,
  Edit3,
  Heart,
  MoreHorizontal,
  Play,
  Settings,
  Share2,
  UserPlus,
  Users,
} from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { tracks, type Track } from '@/types/music'
import { usePlayerStore } from '@/stores/player-store'
import MusicPlayer from './music-player'
import MusicSidebar from './music-sidebar'
import MusicHeader from './music-header'
import TrackRow from './track-row'
import Link from 'next/link'

interface MusicProfileProps {
  isOwner?: boolean
  username?: string
}

function Cover({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
    />
  )
}

function ProfileHero({
  isOwner,
  username,
}: {
  isOwner: boolean
  username: string
}) {
  return (
    <section className="relative mb-10 overflow-hidden rounded-2xl border border-white/10 bg-[#131513]">
      <div className="h-32 bg-gradient-to-r from-[#242924] via-[#171a17] to-[#0f100f] md:h-44" />

      <div className="relative px-5 pb-6 md:px-8 md:pb-8">
        <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between md:-mt-16">
          <div className="flex items-end gap-4">
            <div className="flex size-24 shrink-0 items-center justify-center rounded-full border-4 border-[#131513] bg-[#d8ff3e] text-2xl font-bold text-[#101110] md:size-32 md:text-4xl">
              WH
            </div>

            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  William
                </h1>

                <span className="rounded-full bg-[#d8ff3e]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#d8ff3e]">
                  Criador
                </span>
              </div>

              <p className="mt-1 text-sm text-white/40">
                @{username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwner ? (
              <>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-xs text-white/55 transition-colors hover:border-white/20 hover:text-white"
                >
                  <Settings className="size-4" />
                  Configurações
                </Link>

                <Link
                  href='/profile/edit'
                  className="flex items-center gap-2 rounded-lg bg-[#d8ff3e] px-4 py-2.5 text-xs font-bold text-[#101110]"
                >
                  <Edit3 className="size-4" />
                  Editar perfil
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() =>
                    toast.success(`Você começou a seguir @${username}`)
                  }
                  className="flex items-center gap-2 rounded-lg bg-[#d8ff3e] px-4 py-2.5 text-xs font-bold text-[#101110]"
                >
                  <UserPlus className="size-4" />
                  Seguir
                </button>

                <button
                  onClick={() => toast.success('Link do perfil copiado')}
                  className="flex size-10 items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white"
                  aria-label="Compartilhar perfil"
                >
                  <Share2 className="size-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 max-w-2xl">
          <p className="text-sm leading-6 text-white/55">
            Sons para quem prefere a madrugada. Explorando música,
            produzindo e descobrindo novos artistas.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-white/40">
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" />
            0 seguidores
          </span>

          <span>0 seguindo</span>

          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            Entrou em 2026
          </span>
        </div>
      </div>
    </section>
  )
}

function ProfileStats() {
  return (
    <div className="mb-10 grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-white/10 bg-[#131513] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          Músicas publicadas
        </p>

        <p className="mt-2 text-2xl font-semibold">
          6
        </p>

        <p className="mt-1 text-xs text-white/35">
          lançamentos no perfil
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#131513] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          Reproduções
        </p>

        <p className="mt-2 text-2xl font-semibold">
          12
        </p>

        <p className="mt-1 text-xs text-white/35">
          em todas as músicas
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#131513] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          Seguidores
        </p>

        <p className="mt-2 text-2xl font-semibold">
          0
        </p>

        <p className="mt-1 text-xs text-white/35">
          pessoas acompanhando
        </p>
      </div>
    </div>
  )
}

function ProfileTracks({
  isOwner,
  onPlay,
}: {
  isOwner: boolean
  onPlay: (track: Track) => void
}) {
  const profileTracks = tracks.slice(0, 6)

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
            Música
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            {isOwner ? 'Suas músicas' : 'Músicas publicadas'}
          </h2>
        </div>

        <button
          onClick={() => toast.info('Lista completa aberta')}
          className="text-xs text-white/40 hover:text-[#d8ff3e]"
        >
          Ver tudo →
        </button>
      </div>

      <div>
        {profileTracks.map((track, index) => (
          <TrackRow
            key={track.id}
            track={track}
            index={index}
            onPlay={onPlay}
          />
        ))}
      </div>
    </section>
  )
}

function ProfilePlaylists() {
  const playlists = [
    {
      id: 'p1',
      title: 'Madrugada',
      description: 'sons para ouvir depois das 00:00',
      cover: tracks[0]?.cover,
      count: 1,
    },
    {
      id: 'p2',
      title: 'Sad Hours',
      description: 'quando a noite pesa um pouco mais',
      cover: tracks[1]?.cover,
      count: 2,
    },
    {
      id: 'p3',
      title: 'Underground',
      description: 'descobertas fora do mainstream',
      cover: tracks[2]?.cover,
      count: 2,
    },
  ]

  return (
    <section className="mt-12">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
            Coleções
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            Playlists públicas
          </h2>
        </div>

        <button
          onClick={() => toast.info('Playlists abertas')}
          className="text-xs text-white/40 hover:text-[#d8ff3e]"
        >
          Ver tudo →
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() =>
              toast.success(`${playlist.title} adicionada à fila`)
            }
            className="group text-left"
          >
            <div className="mb-3 aspect-square overflow-hidden rounded-xl bg-white/5">
              <Cover
                src={playlist.cover}
                alt={playlist.title}
                className="size-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <p className="text-sm font-medium">
              {playlist.title}
            </p>

            <p className="mt-1 text-xs text-white/40">
              {playlist.count} músicas
              <span className="px-1">·</span>
              {playlist.description}
            </p>
          </button>
        ))}
      </div>
    </section>
  )
}

function PrivateActivity() {
  return (
    <section className="mt-12">
      <div className="mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
          Somente você
        </p>

        <h2 className="mt-1 text-xl font-semibold tracking-tight">
          Sua atividade
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#131513] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                Músicas curtidas
              </p>

              <p className="mt-1 text-xs text-white/40">
                Sua coleção pessoal
              </p>
            </div>

            <Heart className="size-5 text-[#d8ff3e]" />
          </div>

          <p className="mt-6 text-3xl font-semibold">
            48
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#131513] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                Tempo ouvido
              </p>

              <p className="mt-1 text-xs text-white/40">
                Nos últimos 30 dias
              </p>
            </div>

            <Play className="size-5 text-[#d8ff3e]" />
          </div>

          <p className="mt-6 text-3xl font-semibold">
            18h 42m
          </p>
        </div>
      </div>
    </section>
  )
}

export default function MusicProfile({
  isOwner = true,
  username = 'william',
}: MusicProfileProps) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(
    isOwner ? '' : '',
  )

  const { play } = usePlayerStore()

  const results = useMemo(() => {
    if (!query.trim()) {
      return tracks
    }

    return tracks.filter((track) =>
      `${track.title} ${track.artist} ${track.genre}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
  }, [query])

  const playTrack = (track: Track) => {
    play(track)
    toast.success(`Reproduzindo ${track.title}`)
  }

  return (
    <div className="min-h-screen bg-[#0c0d0c] text-white">
      {isOwner && (
        <MusicSidebar
          active={active}
          onSelect={setActive}
        />
      )}

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

      <main
        className={`min-h-screen pb-24 ${
          isOwner ? 'lg:pl-60' : ''
        }`}
      >
        <MusicHeader
          query={query}
          setQuery={setQuery}
        />

        <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-9 md:py-10">
          <ProfileHero
            isOwner={isOwner}
            username={username}
          />

          <ProfileStats />

          <ProfileTracks
            isOwner={isOwner}
            onPlay={playTrack}
          />

          <ProfilePlaylists />

          {isOwner && <PrivateActivity />}
        </div>
      </main>
    </div>
  )
}