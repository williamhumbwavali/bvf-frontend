'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Camera,
  Check,
  Globe,
  Lock,
  Save,
  User,
} from 'lucide-react'
import { toast } from 'sonner'

export default function EditProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [avatar, setAvatar] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
  )

  const [name, setName] = useState('William')
  const [username, setUsername] = useState('william')
  const [bio, setBio] = useState(
    'Criando sons para quem ainda está acordado.',
  )
  const [website, setWebsite] = useState('')
  const [instagram, setInstagram] = useState('')

  const [saving, setSaving] = useState(false)

  const handleAvatarChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione uma imagem válida.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5 MB.')
      return
    }

    const preview = URL.createObjectURL(file)
    setAvatar(preview)
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!name.trim()) {
      toast.error('Digite o seu nome.')
      return
    }

    if (!username.trim()) {
      toast.error('Digite um nome de usuário.')
      return
    }

    setSaving(true)

    // Substituir posteriormente pela API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSaving(false)

    toast.success('Perfil atualizado com sucesso.')
  }

  return (
    <main className="min-h-screen bg-[#0c0d0c] text-white mb-12">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/8 bg-[#0c0d0c]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-[72px] max-w-5xl items-center justify-between px-5 md:px-8">
          <Link
            href="/profile"
            className="flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Voltar ao perfil
          </Link>

          <div className="hidden items-center gap-2 sm:flex">

            <span className="font-mono text-[11px] font-bold tracking-[-0.04em]">
              BAD VIBES FOREVER
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8 md:px-8 md:py-12">
        {/* Título */}
        <div className="mb-10">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#d8ff3e]">
            Sua conta
          </p>

          <h1 className="text-3xl font-semibold tracking-[-0.05em] md:text-4xl">
            Editar perfil
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Personalize como você aparece para outras pessoas.
          </p>
        </div>

        <form onSubmit={handleSave}>
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Avatar */}
            <section className="rounded-2xl border border-white/10 bg-[#131513] p-6">
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                Foto de perfil
              </p>

              <div className="flex flex-col items-center">
                <div className="group relative size-36 overflow-hidden rounded-full border border-white/10">
                  <img
                    src={avatar}
                    alt="Foto de perfil"
                    className="size-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Camera className="size-5" />
                    <span className="text-[10px] font-medium">
                      Alterar
                    </span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 text-xs font-semibold text-[#d8ff3e] hover:underline"
                >
                  Alterar foto
                </button>

                <p className="mt-2 text-center text-[10px] leading-4 text-white/25">
                  JPG, PNG ou WEBP
                  <br />
                  Máximo de 5 MB
                </p>
              </div>
            </section>

            {/* Informações */}
            <section className="rounded-2xl border border-white/10 bg-[#131513] p-6 md:p-8">
              <div className="mb-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                  Informações básicas
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Como as pessoas vão encontrar você
                </h2>
              </div>

              <div className="space-y-6">
                {/* Nome */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-xs font-medium text-white/60"
                  >
                    Nome
                  </label>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/25" />

                    <input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={50}
                      className="h-11 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-white/20 focus:border-[#d8ff3e]/60"
                      placeholder="Seu nome"
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-xs font-medium text-white/60"
                  >
                    Nome de usuário
                  </label>

                  <div className="flex h-11 items-center rounded-lg border border-white/10 bg-white/5">
                    <span className="pl-3 text-sm text-white/25">@</span>

                    <input
                      id="username"
                      value={username}
                      onChange={(e) =>
                        setUsername(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9_.]/g, ''),
                        )
                      }
                      maxLength={30}
                      className="h-full flex-1 bg-transparent px-2 text-sm outline-none"
                      placeholder="seuusuario"
                    />
                  </div>

                  <p className="mt-2 text-[11px] text-white/25">
                    Seu nome de usuário será usado no endereço do seu perfil.
                  </p>
                </div>

                {/* Bio */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="bio"
                      className="text-xs font-medium text-white/60"
                    >
                      Biografia
                    </label>

                    <span className="text-[10px] text-white/25">
                      {bio.length}/160
                    </span>
                  </div>

                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={160}
                    rows={4}
                    placeholder="Conte um pouco sobre você..."
                    className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 outline-none transition-colors placeholder:text-white/20 focus:border-[#d8ff3e]/60"
                  />
                </div>

                {/* Website */}
                <div>
                  <label
                    htmlFor="website"
                    className="mb-2 block text-xs font-medium text-white/60"
                  >
                    Website
                  </label>

                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/25" />

                    <input
                      id="website"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="h-11 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-white/20 focus:border-[#d8ff3e]/60"
                      placeholder="https://seusite.com"
                    />
                  </div>
                </div>

                {/* Instagram */}
                <div>
                  <label
                    htmlFor="instagram"
                    className="mb-2 block text-xs font-medium text-white/60"
                  >
                    Instagram
                  </label>

                  <div className="flex h-11 items-center rounded-lg border border-white/10 bg-white/5">
                    <Camera className="ml-3 size-4 text-white/25" />

                    <span className="ml-2 text-sm text-white/25">
                      instagram.com/
                    </span>

                    <input
                      id="instagram"
                      value={instagram}
                      onChange={(e) =>
                        setInstagram(
                          e.target.value.replace(/[^a-zA-Z0-9_.]/g, ''),
                        )
                      }
                      className="h-full min-w-0 flex-1 bg-transparent px-1 text-sm outline-none"
                      placeholder="seuusuario"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Privacidade */}
          <section className="mt-6 rounded-2xl border border-white/10 bg-[#131513] p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-[#d8ff3e]">
                <Lock className="size-4" />
              </div>

              <div>
                <h2 className="text-sm font-semibold">
                  Privacidade do perfil
                </h2>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-white/40">
                  Seu perfil pode ser encontrado por outras pessoas. Suas
                  músicas publicadas e informações públicas estarão disponíveis
                  para quem visitar seu perfil.
                </p>
              </div>

              <div className="ml-auto hidden size-5 items-center justify-center rounded border border-[#d8ff3e] bg-[#d8ff3e] text-[#101110] sm:flex">
                <Check className="size-3" />
              </div>
            </div>
          </section>

          {/* Ações */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/profile"
              className="flex h-11 items-center justify-center rounded-lg border border-white/10 px-5 text-sm text-white/50 transition-colors hover:bg-white/5 hover:text-white"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#d8ff3e] px-6 text-sm font-bold text-[#101110] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                'Salvando...'
              ) : (
                <>
                  <Save className="size-4" />
                  Salvar alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}