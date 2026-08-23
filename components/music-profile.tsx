'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  CalendarDays,
  Edit3,
  Share2,
  UserPlus,
  Users,
  Settings,
} from 'lucide-react'
import { Toaster, toast } from 'sonner'
import Link from 'next/link'

import { usePlayerStore } from '@/stores/player-store'
import {
  useAuth,
  type AuthUser,
} from '@/contexts/auth-context'

import {
  ArtistsService,
  type Artist,
} from '@/services/artists.service'

import type { Track } from '@/services/tracks.service'
import { tracksService } from '@/services/tracks.service'

import MusicSidebar from './music-sidebar'
import MusicHeader from './music-header'
import TrackRow from './track-row'

interface MusicProfileProps {
  isOwner?: boolean
  username?: string
}

/* =========================================================
   PROFILE HERO
========================================================= */

function ProfileHero({
  artist,
  isOwner,
  authUser,
}: {
  artist: Artist
  isOwner: boolean
  authUser?: AuthUser | null
}) {
  /*
   * Para o próprio perfil usamos o AuthContext.
   *
   * Isso é importante porque quando o usuário salva o perfil:
   *
   * updateUser(response.data.user)
   *
   * o AuthContext muda imediatamente e o Hero acompanha
   * essa alteração sem precisar fazer outra requisição.
   *
   * Para perfil público continuamos usando artist.user.
   */
  const user = isOwner && authUser
    ? authUser
    : artist.user

  const name = user?.name ?? artist.name ?? 'Usuário'
  const username = user?.username ?? artist.handle ?? ''
  const avatarUrl = user?.avatarUrl ?? null

  const bio =
    artist.bio ??
    user?.bio ??
    ''

  const role = user?.role ?? 'ARTIST'

  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <section className="relative mb-10 overflow-hidden rounded-2xl border border-white/10 bg-[#131513]">
      {/* Banner */}
      <div className="h-32 bg-gradient-to-r from-[#242924] via-[#171a17] to-[#0f100f] md:h-44" />

      <div className="relative px-5 pb-6 md:px-8 md:pb-8">
        <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between md:-mt-16">
          {/* Identity */}
          <div className="flex items-end gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="size-24 shrink-0 rounded-full border-4 border-[#131513] object-cover md:size-32"
              />
            ) : (
              <div className="flex size-24 shrink-0 items-center justify-center rounded-full border-4 border-[#131513] bg-[#d8ff3e] text-2xl font-bold text-[#101110] md:size-32 md:text-4xl">
                {initials}
              </div>
            )}

            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {name}
                </h1>

                {role === 'ARTIST' && (
                  <span className="rounded-full bg-[#d8ff3e]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#d8ff3e]">
                    Criador
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-white/40">
                @{username}
              </p>
            </div>
          </div>

          {/* Actions */}
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
                  href="/profile/edit"
                  className="flex items-center gap-2 rounded-lg bg-[#d8ff3e] px-4 py-2.5 text-xs font-bold text-[#101110]"
                >
                  <Edit3 className="size-4" />
                  Editar perfil
                </Link>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() =>
                    toast.success(
                      `Você começou a seguir @${username}`,
                    )
                  }
                  className="flex items-center gap-2 rounded-lg bg-[#d8ff3e] px-4 py-2.5 text-xs font-bold text-[#101110]"
                >
                  <UserPlus className="size-4" />
                  Seguir
                </button>

                <button
                  type="button"
                  onClick={() =>
                    toast.success('Link do perfil copiado')
                  }
                  className="flex size-10 items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white"
                  aria-label="Compartilhar perfil"
                >
                  <Share2 className="size-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <div className="mt-6 max-w-2xl">
            <p className="text-sm leading-6 text-white/55">
              {bio}
            </p>
          </div>
        )}

        {/* Metadata */}
        <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-white/40">
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" />

            {Number(
              artist.followers ?? 0,
            ).toLocaleString('pt-PT')}{' '}
            seguidores
          </span>

          <span>Seguindo</span>

          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />

            Membro desde{' '}

            {artist.user?.createdAt
              ? new Date(
                  artist.user.createdAt,
                ).getFullYear()
              : '2026'}
          </span>
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   PROFILE STATS
========================================================= */

function ProfileStats({
  tracks,
  followers,
}: {
  tracks: Track[]
  followers: number
}) {
  const totalPlays = tracks.reduce(
    (total, track) =>
      total + Number(track.playCount ?? 0),
    0,
  )

  return (
    <div className="mb-10 grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-white/10 bg-[#131513] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          Músicas publicadas
        </p>

        <p className="mt-2 text-2xl font-semibold">
          {tracks.length}
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
          {totalPlays.toLocaleString('pt-PT')}
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
          {Number(
            followers ?? 0,
          ).toLocaleString('pt-PT')}
        </p>

        <p className="mt-1 text-xs text-white/35">
          pessoas acompanhando
        </p>
      </div>
    </div>
  )
}

/* =========================================================
   PROFILE TRACKS
========================================================= */

function ProfileTracks({
  tracks,
  isOwner,
  onPlay,
}: {
  tracks: Track[]
  isOwner: boolean
  onPlay: (track: Track) => void
}) {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
            Música
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            {isOwner
              ? 'Suas músicas'
              : 'Músicas publicadas'}
          </h2>
        </div>
      </div>

      {tracks.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#131513] py-20 text-center">
          <p className="text-lg font-medium">
            Nenhuma música publicada
          </p>

          <p className="mt-2 text-sm text-white/40">
            Quando você publicar músicas, elas
            aparecerão aqui.
          </p>
        </div>
      ) : (
        <div>
          {tracks.map((track, index) => (
            <TrackRow
              key={track.id}
              track={track}
              index={index}
              onPlay={onPlay}
            />
          ))}
        </div>
      )}
    </section>
  )
}

/* =========================================================
   PROFILE SKELETON
========================================================= */

function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero */}
      <section className="mb-10 overflow-hidden rounded-2xl border border-white/10 bg-[#131513]">
        <div className="h-32 bg-white/5 md:h-44" />

        <div className="px-5 pb-8 md:px-8">
          <div className="-mt-12 flex items-end gap-4 md:-mt-16">
            <div className="size-24 rounded-full border-4 border-[#131513] bg-white/10 md:size-32" />

            <div className="pb-2">
              <div className="h-7 w-40 rounded bg-white/10" />

              <div className="mt-2 h-4 w-24 rounded bg-white/5" />
            </div>
          </div>

          <div className="mt-6 h-4 w-full max-w-xl rounded bg-white/5" />

          <div className="mt-3 h-4 w-2/3 max-w-md rounded bg-white/5" />
        </div>
      </section>

      {/* Stats */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-32 rounded-2xl border border-white/10 bg-[#131513]"
            />
          ),
        )}
      </div>

      {/* Tracks */}
      <div>
        <div className="mb-5 h-6 w-32 rounded bg-white/5" />

        <div className="space-y-2">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-16 rounded-xl bg-white/5"
              />
            ),
          )}
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   MUSIC PROFILE
========================================================= */

export default function MusicProfile({
  isOwner = true,
  username,
}: MusicProfileProps) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('')

  const [artist, setArtist] =
    useState<Artist | null>(null)

  const [isLoadingProfile, setIsLoadingProfile] =
    useState(true)

  const {
    user,
    isLoading: isAuthLoading,
  } = useAuth()

  const { play } = usePlayerStore()

  /* =======================================================
     LOAD ARTIST PROFILE
  ======================================================= */

  useEffect(() => {
    let cancelled = false

    async function loadProfile() {
      try {
        setIsLoadingProfile(true)

        let response

        if (isOwner) {
          /*
           * O token já está disponível no AuthContext.
           *
           * O /artists/me continua sendo usado apenas
           * para buscar os dados específicos do artista.
           */
          response = await ArtistsService.getMe()
        } else {
          if (!username) {
            if (!cancelled) {
              setArtist(null)
              setIsLoadingProfile(false)
            }

            return
          }

          response =
            await ArtistsService.getByUsername(
              username,
            )
        }

        if (!cancelled) {
          setArtist(response.data)
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            'Erro ao carregar perfil do artista:',
            error,
          )

          setArtist(null)

          toast.error(
            'Não foi possível carregar o perfil',
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoadingProfile(false)
        }
      }
    }

    /*
     * Perfil próprio:
     *
     * Primeiro esperamos apenas a autenticação
     * terminar.
     *
     * NÃO dependemos do `user` aqui.
     *
     * Isso evita chamar /artists/me novamente quando
     * updateUser() atualizar o AuthContext.
     */
    if (isOwner) {
      if (isAuthLoading) {
        return
      }

      if (!user) {
        setIsLoadingProfile(false)
        setArtist(null)
        return
      }
    }

    /*
     * Perfil público:
     * precisa do username.
     */
    if (!isOwner && !username) {
      setIsLoadingProfile(false)
      setArtist(null)
      return
    }

    loadProfile()

    return () => {
      cancelled = true
    }
  }, [
    isOwner,
    username,
    isAuthLoading,
  ])

  /* =======================================================
     TRACKS
  ======================================================= */

  const profileTracks = artist?.tracks ?? []

  /* =======================================================
     SEARCH
  ======================================================= */

  const results = useMemo(() => {
    if (!query.trim()) {
      return profileTracks
    }

    const search = query.toLowerCase()

    return profileTracks.filter((track) => {
      const text = `
        ${track.title}
        ${track.artist?.name ?? artist?.name ?? ''}
        ${track.genre?.name ?? ''}
      `

      return text
        .toLowerCase()
        .includes(search)
    })
  }, [
    profileTracks,
    query,
    artist,
  ])

  /* =======================================================
     PLAY TRACK
  ======================================================= */

  const playTrack = async (track: Track) => {
    play(track)

    try {
      await tracksService.play(track.id)
    } catch (error) {
      console.error(
        'Erro ao registrar reprodução:',
        error,
      )
    }

    toast.success(
      `Reproduzindo ${track.title}`,
    )
  }

  /* =======================================================
     AUTH LOADING
  ======================================================= */

  /*
   * Só bloqueamos enquanto ainda não sabemos se
   * existe autenticação.
   *
   * O carregamento do artista NÃO bloqueia a página.
   */
  if (isOwner && isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#0c0d0c] text-white">
        <main className="mx-auto max-w-[1500px] px-5 py-8 md:px-9 md:py-10">
          <ProfileSkeleton />
        </main>
      </div>
    )
  }

  /* =======================================================
     AUTH REQUIRED
  ======================================================= */

  if (isOwner && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c0d0c] text-white">
        <p className="text-sm text-white/40">
          Você precisa estar autenticado.
        </p>
      </div>
    )
  }

  /* =======================================================
     PAGE
  ======================================================= */

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
            border:
              '1px solid rgba(255,255,255,.1)',
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
          {/* 
           * Enquanto /artists/me carrega, mostramos skeleton
           * apenas no conteúdo do perfil.
           *
           * A aplicação continua com a estrutura normal.
           */}
          {isLoadingProfile && !artist ? (
            <ProfileSkeleton />
          ) : !artist ? (
            <div className="flex min-h-[500px] items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-medium">
                  Usuário não encontrado.
                </p>

                <p className="mt-2 text-sm text-white/40">
                  Não foi possível encontrar este
                  perfil.
                </p>
              </div>
            </div>
          ) : (
            <>
              <ProfileHero
                artist={artist}
                isOwner={isOwner}
                authUser={user}
              />

              <ProfileStats
                tracks={profileTracks}
                followers={Number(
                  artist.followers ?? 0,
                )}
              />

              <ProfileTracks
                tracks={results}
                isOwner={isOwner}
                onPlay={playTrack}
              />
            </>
          )}
        </div>
      </main>
    </div>
  )
}