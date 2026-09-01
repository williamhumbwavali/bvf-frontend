'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  Check,
  ChevronDown,
  GripVertical,
  ImagePlus,
  Music,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react'

import { toast } from 'sonner'

import MusicSidebar from '@/components/music-sidebar'
import MusicHeader from '@/components/music-header'

import { tracksService } from '@/services/tracks.service'
import { albumsService } from '@/services/albums.service'
import { Genre, genresService } from '@/services/genre.service'

interface AlbumTrack {
  id: string
  file: File
  title: string
  durationSec: number | null
}

function getFileNameWithoutExtension(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, '')
}

function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement('audio')
    const url = URL.createObjectURL(file)

    audio.preload = 'metadata'
    audio.src = url

    audio.onloadedmetadata = () => {
      const duration = Math.round(audio.duration)

      URL.revokeObjectURL(url)

      resolve(duration)
    }

    audio.onerror = () => {
      URL.revokeObjectURL(url)

      reject(
        new Error(
          'Não foi possível obter a duração do áudio.',
        ),
      )
    }
  })
}

function formatDuration(seconds: number | null) {
  if (!seconds) return '--:--'

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

function Cover({
  src,
  alt,
}: {
  src?: string | null
  alt: string
}) {
  return (
    <img
      src={src || '/user.jpg'}
      alt={alt}
      className="size-full object-cover"
    />
  )
}

export default function CreateAlbumPage() {
  const [active, setActive] = useState('Publicar')

  const [genres, setGenres] = useState<Genre[]>([])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [genreId, setGenreId] = useState('')

  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] =
    useState<string | null>(null)

  const [albumTracks, setAlbumTracks] = useState<AlbumTrack[]>(
    [],
  )

  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    async function loadGenres() {
      try {
        const response = await genresService.list()

        setGenres(response.data)
      } catch (error) {
        console.error(error)

        toast.error(
          'Não foi possível carregar os gêneros.',
        )
      }
    }

    loadGenres()
  }, [])

  const totalDuration = useMemo(() => {
    return albumTracks.reduce(
      (total, track) => total + (track.durationSec || 0),
      0,
    )
  }, [albumTracks])

  const handleCoverChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione uma imagem válida.')
      return
    }

    setCoverFile(file)

    const preview = URL.createObjectURL(file)

    setCoverPreview(preview)
  }

  const removeCover = () => {
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview)
    }

    setCoverFile(null)
    setCoverPreview(null)
  }

  const handleAudioChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || [])

    if (files.length === 0) return

    const invalidFiles = files.filter(
      (file) => !file.type.startsWith('audio/'),
    )

    if (invalidFiles.length > 0) {
      toast.error(
        'Um ou mais arquivos selecionados não são áudios válidos.',
      )

      return
    }

    try {
      const newTracks: AlbumTrack[] = []

      for (const file of files) {
        const durationSec = await getAudioDuration(file)

        newTracks.push({
          id: crypto.randomUUID(),
          file,
          title: getFileNameWithoutExtension(file.name),
          durationSec,
        })
      }

      setAlbumTracks((current) => [
        ...current,
        ...newTracks,
      ])
    } catch (error) {
      console.error(error)

      toast.error(
        'Não foi possível processar uma das músicas.',
      )
    }

    event.target.value = ''
  }

  const removeTrack = (id: string) => {
    setAlbumTracks((current) =>
      current.filter((track) => track.id !== id),
    )
  }

  const updateTrackTitle = (
    id: string,
    title: string,
  ) => {
    setAlbumTracks((current) =>
      current.map((track) =>
        track.id === id
          ? {
              ...track,
              title,
            }
          : track,
      ),
    )
  }

  const moveTrack = (
    index: number,
    direction: 'up' | 'down',
  ) => {
    setAlbumTracks((current) => {
      const newTracks = [...current]

      const targetIndex =
        direction === 'up'
          ? index - 1
          : index + 1

      if (
        targetIndex < 0 ||
        targetIndex >= newTracks.length
      ) {
        return current
      }

      const currentTrack = newTracks[index]

      newTracks[index] = newTracks[targetIndex]
      newTracks[targetIndex] = currentTrack

      return newTracks
    })
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (!title.trim()) {
      toast.error('Digite o nome do álbum.')
      return
    }

    if (!genreId) {
      toast.error('Selecione um gênero.')
      return
    }

    if (albumTracks.length === 0) {
      toast.error(
        'Adicione pelo menos uma música ao álbum.',
      )

      return
    }

    setIsUploading(true)

    try {
      /*
       * =====================================================
       * CAPA
       * =====================================================
       */

      let coverUrl: string | undefined

      if (coverFile) {
        const coverUpload =
          await tracksService.upload(
            coverFile,
            'cover',
          )

        const coverResponse = await fetch(
          coverUpload.uploadUrl,
          {
            method: 'PUT',
            headers: {
              'Content-Type': coverFile.type,
            },
            body: coverFile,
          },
        )

        if (!coverResponse.ok) {
          throw new Error(
            `Falha no upload da capa: ${coverResponse.status}`,
          )
        }

        coverUrl = coverUpload.publicUrl
      }

      /*
       * =====================================================
       * MÚSICAS
       * =====================================================
       */

      const trackIds: string[] = []

      for (const track of albumTracks) {
        const audioUpload =
          await tracksService.upload(
            track.file,
            'audio',
          )

        const audioResponse = await fetch(
          audioUpload.uploadUrl,
          {
            method: 'PUT',
            headers: {
              'Content-Type': track.file.type,
            },
            body: track.file,
          },
        )

        if (!audioResponse.ok) {
          throw new Error(
            `Falha no upload da música ${track.title}: ${audioResponse.status}`,
          )
        }

        const createdTrack = await tracksService.create({
          title: track.title,
          genreId,
          durationSec: track.durationSec,
          audioUrl: audioUpload.publicUrl,
          coverUrl,
        })

        trackIds.push(createdTrack.data.id)
      }

      await albumsService.create({
        title: title.trim(),
        coverUrl,
        trackIds,
      })

      toast.success(
        'Álbum publicado com sucesso.',
      )

      setTitle('')
      setDescription('')
      setGenreId('')

      removeCover()

      setAlbumTracks([])

    } catch (error) {
      console.error(error)

      toast.error(
        'Não foi possível publicar o álbum.',
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0d0c] text-white">
      <MusicSidebar
        active={active}
        onSelect={setActive}
      />

      <div className="lg:pl-60">
        <main className="min-h-screen pb-24">
          <MusicHeader
            query=""
            setQuery={() => {}}
          />

          <div className="mx-auto max-w-[1200px] px-5 py-8 md:px-9 md:py-10">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-10">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#d8ff3e]">
                Estúdio
              </p>

              <h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
                Publique um álbum
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
                Publique várias músicas de uma vez e
                organize-as como um álbum.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* =================================================
                  INFORMAÇÕES DO ÁLBUM
              ================================================= */}

              <div className="grid gap-6 lg:grid-cols-[320px_1fr]">

                {/* =================================================
                    CAPA
                ================================================= */}

                <div>
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                    Capa do álbum
                  </p>

                  <label
                    htmlFor="album-cover"
                    className="group relative block aspect-square cursor-pointer overflow-hidden rounded-2xl border border-dashed border-white/15 bg-[#131513] transition-colors hover:border-[#d8ff3e]/50"
                  >
                    {coverPreview ? (
                      <>
                        <Cover
                          src={coverPreview}
                          alt="Capa do álbum"
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-xs font-medium backdrop-blur-sm">
                            <ImagePlus className="size-4" />
                            Alterar capa
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex size-full flex-col items-center justify-center px-6 text-center">
                        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#1c201c] text-[#d8ff3e]">
                          <ImagePlus className="size-5" />
                        </div>

                        <p className="text-sm font-medium">
                          Adicione uma capa
                        </p>

                        <p className="mt-2 text-xs leading-5 text-white/35">
                          JPG, PNG ou WEBP
                          <br />
                          Recomendado: 1000 × 1000
                        </p>
                      </div>
                    )}

                    <input
                      id="album-cover"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleCoverChange}
                      className="hidden"
                    />
                  </label>

                  {coverFile && (
                    <div className="mt-3 flex items-center justify-between rounded-lg bg-[#131513] px-3 py-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <ImagePlus className="size-4 shrink-0 text-[#d8ff3e]" />

                        <span className="truncate text-xs text-white/60">
                          {coverFile.name}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={removeCover}
                        className="text-white/35 hover:text-white"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* =================================================
                    DADOS
                ================================================= */}

                <div className="rounded-2xl border border-white/10 bg-[#131513] p-5 md:p-7">

                  <div className="mb-7">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                      Informações do álbum
                    </p>

                    <h2 className="mt-1 text-lg font-semibold">
                      Conte-nos sobre o álbum
                    </h2>
                  </div>

                  <div className="space-y-5">

                    {/* NOME */}

                    <div>
                      <label
                        htmlFor="album-title"
                        className="mb-2 block text-xs font-medium text-white/60"
                      >
                        Nome do álbum
                      </label>

                      <input
                        id="album-title"
                        value={title}
                        onChange={(event) =>
                          setTitle(event.target.value)
                        }
                        placeholder="Ex.: After Hours"
                        className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#d8ff3e]/60"
                      />
                    </div>

                    {/* DESCRIÇÃO */}

                    <div>
                      <label
                        htmlFor="description"
                        className="mb-2 block text-xs font-medium text-white/60"
                      >
                        Descrição
                        <span className="ml-1 text-white/25">
                          opcional
                        </span>
                      </label>

                      <textarea
                        id="description"
                        value={description}
                        onChange={(event) =>
                          setDescription(event.target.value)
                        }
                        placeholder="Conte um pouco sobre este álbum..."
                        rows={4}
                        className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#d8ff3e]/60"
                      />
                    </div>

                    {/* GÊNERO */}

                    <div>
                      <label
                        htmlFor="genre"
                        className="mb-2 block text-xs font-medium text-white/60"
                      >
                        Gênero
                      </label>

                      <div className="relative">
                        <select
                          id="genre"
                          value={genreId}
                          onChange={(event) =>
                            setGenreId(event.target.value)
                          }
                          className="h-11 w-full appearance-none rounded-lg border border-white/10 bg-[#171917] px-3 pr-10 text-sm text-white outline-none focus:border-[#d8ff3e]/60"
                        >
                          <option value="">
                            Selecionar gênero
                          </option>

                          {genres.map((genre) => (
                            <option
                              key={genre.id}
                              value={genre.id}
                            >
                              {genre.name}
                            </option>
                          ))}
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* =================================================
                  MÚSICAS
              ================================================= */}

              <div className="rounded-2xl border border-white/10 bg-[#131513] p-5 md:p-7">

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                      Faixas
                    </p>

                    <h2 className="mt-1 text-lg font-semibold">
                      Músicas do álbum
                    </h2>

                    <p className="mt-1 text-xs text-white/35">
                      {albumTracks.length} faixas
                      {totalDuration > 0 && (
                        <>
                          {' · '}
                          {formatDuration(totalDuration)}
                        </>
                      )}
                    </p>
                  </div>

                  <label
                    htmlFor="album-audio"
                    className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-white/5 px-4 text-xs font-medium text-white/70 transition-colors hover:bg-[#d8ff3e] hover:text-[#101110]"
                  >
                    <Plus className="size-4" />
                    Adicionar músicas

                    <input
                      id="album-audio"
                      type="file"
                      multiple
                      accept="audio/mpeg,audio/wav,audio/flac,audio/x-flac"
                      onChange={handleAudioChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* EMPTY */}

                {albumTracks.length === 0 ? (
                  <label
                    htmlFor="album-audio-empty"
                    className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center transition-colors hover:border-[#d8ff3e]/40 hover:bg-white/[0.04]"
                  >
                    <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#1c201c] text-[#d8ff3e]">
                      <Music className="size-5" />
                    </div>

                    <p className="text-sm font-medium">
                      Adicione as músicas do álbum
                    </p>

                    <p className="mt-2 max-w-sm text-xs leading-5 text-white/35">
                      Você pode selecionar várias músicas
                      ao mesmo tempo.
                    </p>

                    <span className="mt-5 flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-xs text-white/50 transition-colors group-hover:bg-[#d8ff3e] group-hover:text-[#101110]">
                      <Upload className="size-4" />
                      Escolher arquivos
                    </span>

                    <input
                      id="album-audio-empty"
                      type="file"
                      multiple
                      accept="audio/mpeg,audio/wav,audio/flac,audio/x-flac"
                      onChange={handleAudioChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-white/8">

                    {albumTracks.map(
                      (track, index) => (
                        <div
                          key={track.id}
                          className="group flex items-center gap-3 border-b border-white/8 px-3 py-3 last:border-b-0"
                        >

                          {/* ORDEM */}

                          <div className="flex items-center gap-2">
                            <GripVertical className="hidden size-4 cursor-grab text-white/15 sm:block" />

                            <span className="w-6 text-center font-mono text-xs text-white/30">
                              {String(index + 1).padStart(
                                2,
                                '0',
                              )}
                            </span>
                          </div>

                          {/* ÍCONE */}

                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#1c201c] text-[#d8ff3e]">
                            <Music className="size-4" />
                          </div>

                          {/* NOME */}

                          <div className="min-w-0 flex-1">
                            <input
                              value={track.title}
                              onChange={(event) =>
                                updateTrackTitle(
                                  track.id,
                                  event.target.value,
                                )
                              }
                              className="h-8 w-full min-w-0 bg-transparent text-sm font-medium text-white outline-none"
                            />

                            <p className="mt-0.5 truncate text-[11px] text-white/25">
                              {track.file.name}
                            </p>
                          </div>

                          {/* DURAÇÃO */}

                          <span className="hidden w-12 text-right font-mono text-xs text-white/30 sm:block">
                            {formatDuration(
                              track.durationSec,
                            )}
                          </span>

                          {/* MOVER */}

                          <div className="hidden items-center gap-1 sm:flex">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() =>
                                moveTrack(
                                  index,
                                  'up',
                                )
                              }
                              className="rounded p-1 text-white/25 hover:text-white disabled:opacity-20"
                              aria-label="Mover faixa para cima"
                            >
                              ↑
                            </button>

                            <button
                              type="button"
                              disabled={
                                index ===
                                albumTracks.length - 1
                              }
                              onClick={() =>
                                moveTrack(
                                  index,
                                  'down',
                                )
                              }
                              className="rounded p-1 text-white/25 hover:text-white disabled:opacity-20"
                              aria-label="Mover faixa para baixo"
                            >
                              ↓
                            </button>
                          </div>

                          {/* REMOVER */}

                          <button
                            type="button"
                            onClick={() =>
                              removeTrack(track.id)
                            }
                            className="rounded-lg p-2 text-white/20 transition-colors hover:bg-red-500/10 hover:text-red-400"
                            aria-label={`Remover ${track.title}`}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                )}

                {/* INFO */}

                {albumTracks.length > 0 && (
                  <div className="mt-5 flex items-center gap-2 text-xs text-white/30">
                    <Music className="size-3.5" />

                    <span>
                      As músicas serão publicadas na
                      ordem mostrada acima.
                    </span>
                  </div>
                )}
              </div>

              {/* =================================================
                  FOOTER
              ================================================= */}

              <div className="flex flex-col-reverse gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-xs leading-5 text-white/30">
                    Ao publicar, você confirma que possui
                    os direitos das músicas e da capa.
                  </p>

                  {albumTracks.length > 0 && (
                    <p className="mt-1 text-xs text-white/20">
                      {albumTracks.length} faixas serão
                      adicionadas ao álbum.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={
                    isUploading ||
                    albumTracks.length === 0
                  }
                  className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#d8ff3e] px-6 text-xs font-bold text-[#101110] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-[#101110]/30 border-t-[#101110]" />

                      Publicando...
                    </>
                  ) : (
                    <>
                      <Check className="size-4" />

                      Publicar álbum
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
