'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  Compass,
  Flame,
  Heart,
  Play,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { Toaster, toast } from 'sonner'
import Link from 'next/link'

import { usePlayerStore } from '@/stores/player-store'

import MusicPlayer from './music-player'
import MusicSidebar from './music-sidebar'
import MusicHeader from './music-header'
import TrackRow from './track-row'

import {
  Artist,
  ArtistsService,
} from '@/services/artists.service'

import {
  Track,
  tracksService,
} from '@/services/tracks.service'

import {
  Genre,
  genresService,
} from '@/services/genre.service'
import { useRouter } from 'next/navigation'

/* =========================================================
   COVER
========================================================= */

function Cover({
  src,
  alt,
  className = '',
}: {
  src?: string | null
  alt: string
  className?: string
}) {
  return (
    <img
      src={src || '/public/user.jpg'}
      alt={alt}
      className={`object-cover ${className}`}
    />
  )
}

/* =========================================================
   DISCOVER HERO
========================================================= */

function DiscoverHero({
  track,
  onPlay,
}: {
  track: Track
  onPlay: (track: Track) => void
}) {
  const { currentTrack, isPlaying } =
    usePlayerStore()

  const playing =
    isPlaying &&
    currentTrack?.id === track.id

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#151815]">
      <Cover
        src={track.coverUrl}
        alt={`Capa de ${track.title}`}
        className="absolute inset-0 size-full opacity-45"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d0c] via-[#0c0d0c]/80 to-[#0c0d0c]/20" />

      <div className="relative flex min-h-[360px] flex-col justify-end p-6 md:p-9">
        <div className="mb-auto flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-[#d8ff3e] text-[#101110]">
            <Sparkles className="size-4" />
          </span>

          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d8ff3e]">
            Descobertas
          </span>
        </div>

        <div className="max-w-xl">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            Talvez você goste
          </p>

          <h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
            <Link
              href={`/music/${track.id}`}
              className='transition-colors hover:text-[#d8ff3e] hover:underline'
            >
              {track.title}
            </Link>
          </h1>

          <p className="mt-2 text-sm text-white/55">
            <Link
              href={`/artist/${track.artist?.handle}`}
              className='transition-colors hover:text-[#d8ff3e] hover:underline'
            >
              {track.artist?.name}
            </Link>

            <span className="px-1">·</span>

            {track.genre?.name ?? 'Sem gênero'}

            <span className="px-1">·</span>

            {track.playCount ?? 0} reproduções
          </p>

          <button
            onClick={() => onPlay(track)}
            className="mt-6 flex items-center gap-2 rounded-lg bg-[#d8ff3e] px-5 py-3 text-xs font-bold text-[#101110] transition-transform hover:scale-[1.02]"
          >
            {playing ? (
              <>
                <span className="flex gap-0.5">
                  <span className="h-3 w-0.5 bg-[#101110]" />
                  <span className="h-3 w-0.5 bg-[#101110]" />
                </span>

                Tocando agora
              </>
            ) : (
              <>
                <Play className="size-4 fill-current" />
                Ouvir agora
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   GENRE NAVIGATION
========================================================= */

function GenreNavigation({
  genres,
  active,
  onChange,
}: {
  genres: Genre[]
  active: string
  onChange: (genre: string) => void
}) {
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center gap-2">
        <Compass className="size-4 text-[#d8ff3e]" />

        <h2 className="text-sm font-semibold">
          Explore por gênero
        </h2>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => onChange('Todos')}
          className={`shrink-0 rounded-full border px-4 py-2 text-xs transition-colors ${active === 'Todos'
            ? 'border-[#d8ff3e]/40 bg-[#d8ff3e] text-[#101110]'
            : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
            }`}
        >
          Todos
        </button>

        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => onChange(genre.name)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs transition-colors ${active === genre.name
              ? 'border-[#d8ff3e]/40 bg-[#d8ff3e] text-[#101110]'
              : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </section>
  )
}

/* =========================================================
   TRENDING
========================================================= */

function TrendingSection({
  tracks,
  onPlay,
}: {
  tracks: Track[]
  onPlay: (track: Track) => void
}) {
  return (
    <section className="mt-12">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="size-5 text-[#d8ff3e]" />

            <h2 className="text-xl font-semibold tracking-tight">
              Em alta agora
            </h2>
          </div>

          <p className="mt-1 text-xs text-white/35">
            As músicas que estão chamando atenção.
          </p>
        </div>

        <button
          onClick={() =>
            toast.info(
              'Mais músicas em alta em breve',
            )
          }
          className="hidden items-center gap-1 text-xs text-white/40 hover:text-[#d8ff3e] sm:flex"
        >
          Ver tudo

          <ArrowRight className="size-3" />
        </button>
      </div>

      <div>
        {tracks.slice(0, 6).map(
          (track, index) => (
            <TrackRow
              key={track.id}
              track={track}
              index={index}
              onPlay={onPlay}
            />
          ),
        )}
      </div>
    </section>
  )
}

/* =========================================================
   NEW RELEASES
========================================================= */

function NewReleases({
  tracks,
  onPlay,
}: {
  tracks: Track[]
  onPlay: (track: Track) => void
}) {
  const router = useRouter()

  const {
    liked,
    toggleLike,
  } = usePlayerStore()

  return (
    <section className="mt-12">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-[#d8ff3e]" />

            <h2 className="text-xl font-semibold tracking-tight">
              Novos lançamentos
            </h2>
          </div>

          <p className="mt-1 text-xs text-white/35">
            Descubra músicas recém-publicadas
            por artistas.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            toast.info(
              'Todos os lançamentos em breve',
            )
          }
          className="hidden text-xs text-white/40 hover:text-[#d8ff3e] sm:block"
        >
          Ver tudo →
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tracks.slice(0, 4).map((track) => {
          const isLiked = liked.includes(track.id)

          return (
            <article
              key={track.id}
              className="group min-w-0"
            >
              {/* Capa: reproduz */}
              <button
                type="button"
                onClick={() => onPlay(track)}
                className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-white/5"
                aria-label={`Reproduzir ${track.title}`}
              >
                <Cover
                  src={track.coverUrl}
                  alt={`Capa de ${track.title}`}
                  className="size-full transition-transform duration-500 group-hover:scale-105"
                />

                <span className="absolute bottom-3 right-3 flex size-10 translate-y-2 items-center justify-center rounded-full bg-[#d8ff3e] text-[#101110] opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <Play className="ml-0.5 size-4 fill-current" />
                </span>
              </button>

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  {/* Título: abre a página da música */}
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/music/${track.id}`)
                    }
                    className="block max-w-full truncate text-left text-sm font-medium transition-colors hover:text-[#d8ff3e] hover:underline"
                  >
                    {track.title}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/artist/${track.artist?.handle}`)
                    }
                    className="block max-w-full text-left"
                  >
                    <p className="tmt-1 truncate text-xs text-white/40 transition-colors hover:text-[#d8ff3e] hover:underline">
                      {track.artist?.name}
                    </p>
                  </button>

                  <p className="mt-1 text-[10px] text-white/25">
                    {track.genre?.name ??
                      'Sem gênero'}
                  </p>
                </div>

                {/* Like */}
                <button
                  type="button"
                  aria-label={
                    isLiked
                      ? `Remover curtida de ${track.title}`
                      : `Curtir ${track.title}`
                  }
                  aria-pressed={isLiked}
                  onClick={() =>
                    toggleLike(track.id)
                  }
                  className={
                    isLiked
                      ? 'pt-0.5 text-[#d8ff3e]'
                      : 'pt-0.5 text-white/25 hover:text-white'
                  }
                >
                  <Heart
                    className={`size-4 ${isLiked
                      ? 'fill-current'
                      : ''
                      }`}
                  />
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

/* =========================================================
   POPULAR ARTISTS
========================================================= */

function PopularArtists() {
  const [artists, setArtists] =
    useState<Artist[]>([])

  const [loading, setLoading] =
    useState(true)

  const router = useRouter();

  useEffect(() => {
    async function loadArtists() {
      try {
        setLoading(true)

        const response =
          await ArtistsService.list(4)

        setArtists(response.data)
      } catch (error) {
        console.error(
          'Erro ao carregar artistas:',
          error,
        )

        toast.error(
          'Não foi possível carregar os artistas.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadArtists()
  }, [])

  return (
    <section className="mt-12">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-5 text-[#d8ff3e]" />

          <h2 className="text-xl font-semibold tracking-tight">
            Artistas para descobrir
          </h2>
        </div>

        <p className="mt-1 text-xs text-white/35">
          Novas vozes para adicionar à sua
          biblioteca.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-[82px] animate-pulse rounded-xl border border-white/8 bg-white/[0.025]"
              />
            ),
          )}
        </div>
      ) : artists.length === 0 ? (
        <div className="rounded-xl border border-white/8 bg-white/[0.025] py-10 text-center">
          <p className="text-sm text-white/40">
            Nenhum artista encontrado.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {artists.map((artist) => (
            <button
              key={artist.id}
              onClick={() =>
                router.push(`/artist/${artist.handle}`)
              }
              className="group flex items-center gap-4 rounded-xl border border-white/8 bg-white/[0.025] p-4 text-left transition-colors hover:border-white/15 hover:bg-white/[0.05]"
            >
              <div className="size-14 shrink-0 overflow-hidden rounded-full">
                <Cover
                  src={artist.image || '/user.jpg'}
                  alt={artist.name}
                  className="size-full transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-medium">
                  {artist.name}
                </h3>

                <p className="mt-1 truncate text-xs text-white/35">
                  {artist.genre ??
                    ''}
                </p>
              </div>

              <ArrowRight className="ml-auto size-4 shrink-0 text-white/20 transition-colors group-hover:text-[#d8ff3e]" />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

/* =========================================================
   DISCOVER PAGE
========================================================= */

export default function DiscoverPage() {
  const [query, setQuery] =
    useState('')

  const [activeGenre, setActiveGenre] =
    useState('Todos')

  const [tracks, setTracks] =
    useState<Track[]>([])

  const [newReleases, setNewReleases] =
    useState<Track[]>([])

  const [genres, setGenres] =
    useState<Genre[]>([])

  const [loading, setLoading] =
    useState(true)

  const { play } = usePlayerStore()

  /* =======================================================
     LOAD DISCOVER DATA
  ======================================================= */

  useEffect(() => {
    async function loadDiscover() {
      try {
        setLoading(true)

        const [
          trendingResponse,
          releasesResponse,
          genresResponse,
        ] = await Promise.all([
          tracksService.trending(),
          tracksService.list(1, 20),
          genresService.list(),
        ])

        /*
         * Músicas em alta
         */
        setTracks(
          trendingResponse.data,
        )

        /*
         * Últimos lançamentos
         */
        setNewReleases(
          releasesResponse.data.data,
        )

        /*
         * Gêneros
         */
        setGenres(
          genresResponse.data,
        )
      } catch (error) {
        console.error(
          'Erro ao carregar Discover:',
          error,
        )

        toast.error(
          'Não foi possível carregar os dados.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadDiscover()
  }, [])

  /* =======================================================
     FILTER TRACKS
  ======================================================= */

  const filteredTracks = useMemo(() => {
    const normalizedQuery =
      query.toLowerCase().trim()

    return tracks.filter((track) => {
      const matchesQuery =
        !normalizedQuery ||
        `${track.title} ${track.artist?.name ?? ''
          } ${track.genre?.name ?? ''
          }`
          .toLowerCase()
          .includes(normalizedQuery)

      const matchesGenre =
        activeGenre === 'Todos' ||
        track.genre?.name ===
        activeGenre

      return (
        matchesQuery &&
        matchesGenre
      )
    })
  }, [
    tracks,
    query,
    activeGenre,
  ])

  const featuredTrack =
    filteredTracks[0] ??
    tracks[0]

  /* =======================================================
     PLAY TRACK
  ======================================================= */

  const playTrack = (
    track: Track,
  ) => {
    play(track)

    toast.success(
      `Reproduzindo ${track.title}`,
    )
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#0c0d0c] text-white">
      <MusicSidebar
        active="Descobrir"
        onSelect={(label) => {
          if (label === 'Início') {
            window.location.href = '/'
          }

          if (label === 'Descobrir') {
            window.location.href =
              '/discover'
          }

          if (label === 'Biblioteca') {
            window.location.href =
              '/library'
          }

          if (label === 'Histórico') {
            window.location.href =
              '/history'
          }
        }}
      />

      <main className="min-h-screen pb-24 lg:pl-60">
        <MusicHeader
          query={query}
          setQuery={setQuery}
        />

        <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-9 md:py-10">
          {/* Cabeçalho */}

          <div className="mb-8">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#d8ff3e]">
              Explore
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
              Descobrir
            </h1>

            <p className="mt-2 max-w-xl text-sm text-white/45">
              Encontre novos sons, artistas
              independentes e músicas para
              ouvir quando a noite começar.
            </p>
          </div>

          {/* Gêneros */}

          <GenreNavigation
            genres={genres}
            active={activeGenre}
            onChange={setActiveGenre}
          />

          {/* Loading */}

          {loading ? (
            <div className="mt-10 space-y-8">
              <div className="h-[360px] animate-pulse rounded-2xl bg-white/[0.03]" />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({
                  length: 4,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square animate-pulse rounded-xl bg-white/[0.03]"
                  />
                ))}
              </div>
            </div>
          ) : query ? (
            /* =================================================
               PESQUISA
            ================================================= */

            <section className="mt-10">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Resultados
                  </h2>

                  <p className="mt-1 text-xs text-white/35">
                    Encontramos{' '}
                    {filteredTracks.length}{' '}
                    músicas.
                  </p>
                </div>
              </div>

              {filteredTracks.length > 0 ? (
                <div>
                  {filteredTracks.map(
                    (track, index) => (
                      <TrackRow
                        key={track.id}
                        track={track}
                        index={index}
                        onPlay={playTrack}
                      />
                    ),
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-white/8 py-20 text-center">
                  <p className="text-lg font-medium">
                    Nenhuma música encontrada
                  </p>

                  <p className="mt-2 text-sm text-white/40">
                    Tente outro artista,
                    música ou gênero.
                  </p>
                </div>
              )}
            </section>
          ) : (
            <>
              {/* Destaque */}

              {featuredTrack && (
                <DiscoverHero
                  track={featuredTrack}
                  onPlay={playTrack}
                />
              )}

              {/* Tendências */}

              <TrendingSection
                tracks={filteredTracks}
                onPlay={playTrack}
              />

              {/* Novos lançamentos */}

              <NewReleases
                tracks={newReleases}
                onPlay={playTrack}
              />

              {/* Artistas */}

              <PopularArtists />

              {/* CTA */}

              <section className="mt-12 overflow-hidden rounded-2xl border border-[#d8ff3e]/10 bg-[#151815] p-6 md:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Sparkles className="size-4 text-[#d8ff3e]" />

                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d8ff3e]">
                        Você também cria?
                      </span>
                    </div>

                    <h2 className="text-2xl font-semibold tracking-tight">
                      Publique sua música.
                    </h2>

                    <p className="mt-2 max-w-lg text-sm text-white/40">
                      Dê espaço para sua
                      música. Publique suas
                      faixas e deixe outras
                      pessoas descobrirem seu
                      som.
                    </p>
                  </div>

                  <Link
                    href="/tracks/upload"
                    className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#d8ff3e] px-5 py-3 text-xs font-bold text-[#101110] transition-transform hover:scale-[1.02]"
                  >
                    Publicar música

                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}