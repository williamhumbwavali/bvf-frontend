'use client'

import { useState } from 'react'
import {
  ChevronLeft,
  ImagePlus,
  Lock,
  Globe2,
  ListMusic,
  Plus,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast, Toaster } from 'sonner'

export default function CreatePlaylistPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState<'public' | 'private'>(
    'public',
  )
  const [cover, setCover] = useState<string | null>(null)

  const handleCoverChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione uma imagem válida.')
      return
    }

    const imageUrl = URL.createObjectURL(file)
    setCover(imageUrl)
  }

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Digite um nome para a playlist.')
      return
    }

    toast.success('Playlist criada com sucesso.')

    // Aqui futuramente:
    // POST /playlists

    router.push('/playlists')
  }

  return (
    <div className="min-h-screen bg-[#0c0d0c] text-white">
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

      <main className="mx-auto min-h-screen w-full max-w-4xl px-5 py-8 md:px-8 md:py-12 mb-12">
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
              <ListMusic className="size-5" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                Criar playlist
              </h1>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Crie uma coleção de músicas para ouvir do seu jeito.
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          {/* Cover */}
          <section>
            <label className="group relative block aspect-square cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#131513]">
              {cover ? (
                <img
                  src={cover}
                  alt="Capa da playlist"
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-3 text-white/30 transition-colors group-hover:text-white/60">
                  <div className="flex size-12 items-center justify-center rounded-full bg-white/5">
                    <ImagePlus className="size-5" />
                  </div>

                  <span className="text-xs">
                    Adicionar capa
                  </span>
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <ImagePlus className="size-6" />
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
            </label>

            <p className="mt-3 text-center text-[11px] leading-4 text-white/30">
              JPG, PNG ou WebP
            </p>
          </section>

          {/* Form */}
          <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#131513]">
            <div className="border-b border-white/8 px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                Informações
              </p>
            </div>

            <div className="space-y-6 p-5">
              {/* Nome */}
              <div>
                <label
                  htmlFor="playlist-name"
                  className="mb-2 block text-sm font-medium"
                >
                  Nome da playlist
                </label>

                <input
                  id="playlist-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ex.: noites que não terminam"
                  maxLength={100}
                  className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#d8ff3e]/50"
                />

                <div className="mt-2 text-right text-[10px] text-white/25">
                  {name.length}/100
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label
                  htmlFor="playlist-description"
                  className="mb-2 block text-sm font-medium"
                >
                  Descrição
                  <span className="ml-2 text-xs font-normal text-white/25">
                    Opcional
                  </span>
                </label>

                <textarea
                  id="playlist-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Conte um pouco sobre essa playlist..."
                  maxLength={300}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#d8ff3e]/50"
                />

                <div className="mt-2 text-right text-[10px] text-white/25">
                  {description.length}/300
                </div>
              </div>

              {/* Visibilidade */}
              <div>
                <p className="mb-3 text-sm font-medium">
                  Visibilidade
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setVisibility('public')}
                    className={`
                      rounded-xl border p-4 text-left transition-colors
                      ${
                        visibility === 'public'
                          ? 'border-[#d8ff3e]/40 bg-[#d8ff3e]/5'
                          : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Globe2
                        className={`size-4 ${
                          visibility === 'public'
                            ? 'text-[#d8ff3e]'
                            : 'text-white/40'
                        }`}
                      />

                      <span className="text-sm font-medium">
                        Pública
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-white/35">
                      Qualquer pessoa poderá encontrar e ouvir sua
                      playlist.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisibility('private')}
                    className={`
                      rounded-xl border p-4 text-left transition-colors
                      ${
                        visibility === 'private'
                          ? 'border-[#d8ff3e]/40 bg-[#d8ff3e]/5'
                          : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Lock
                        className={`size-4 ${
                          visibility === 'private'
                            ? 'text-[#d8ff3e]'
                            : 'text-white/40'
                        }`}
                      />

                      <span className="text-sm font-medium">
                        Privada
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-white/35">
                      Somente você poderá acessar essa playlist.
                    </p>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-white/8 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="rounded-lg px-4 py-2.5 text-xs font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleCreate}
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#d8ff3e] px-5 py-2.5 text-xs font-bold text-[#101110] transition-transform hover:scale-[1.02]"
                >
                  <Plus className="size-4" />
                  Criar playlist
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}