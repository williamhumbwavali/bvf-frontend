'use client'

import { useEffect, useRef, useState } from 'react'

import Link from 'next/link'

import {
  ArrowLeft,
  Camera,
  Check,
  Lock,
  Save,
  User,
} from 'lucide-react'

import { toast, Toaster } from 'sonner'

import { usersService } from '@/services/users.service'
import { useAuth, } from '@/contexts/auth-context'
import { tracksService } from '@/services/tracks.service'

export default function EditProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user, updateUser } = useAuth()

  const [avatar, setAvatar] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')

  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const [initialAvatar, setInitialAvatar] = useState<string | null>(null)
  const [initialData, setInitialData] = useState({
    name: '',
    username: '',
    bio: '',
    avatarUrl: null as string | null,
  })

  useEffect(() => {
    if (!user) return

    const initialName = user.name ?? ''
    const initialUsername = normalizeUsername(user.username ?? '')
    const initialBio = user.bio ?? ''
    const initialAvatarUrl = user.avatarUrl ?? null

    setName(initialName)
    setUsername(initialUsername)
    setBio(initialBio)
    setAvatar(initialAvatarUrl)
    setInitialAvatar(initialAvatarUrl)

    setInitialData({
      name: initialName.trim(),
      username: initialUsername,
      bio: initialBio.trim(),
      avatarUrl: initialAvatarUrl,
    })

    setLoading(false)
  }, [user])

  const normalizeUsername = (value: string) => {
    return value.trim().toLowerCase()
  }

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
    setAvatarFile(file)
  }

  const uploadAvatar = async (file: File) => {
    const upload = await tracksService.upload(
      {
        name: file.name,
        type: file.type,
      },
      'cover',
    )

    await fetch(upload.uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    })

    return upload.publicUrl
  }

  const handleSave = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault()

    const currentName = name.trim()
    const currentUsername = normalizeUsername(username)
    const currentBio = bio.trim()
    const currentAvatarUrl = initialAvatar

    if (!currentName) {
      toast.error('Digite o seu nome.')
      return
    }

    if (!currentUsername) {
      toast.error('Digite um nome de usuário.')
      return
    }

    if (currentBio.length > 160) {
      toast.error(
        'A biografia deve ter no máximo 160 caracteres.',
      )
      return
    }

    const nameChanged =
      currentName !== initialData.name

    const usernameChanged =
      currentUsername !==
      normalizeUsername(initialData.username)

    const bioChanged =
      currentBio !== initialData.bio

    const avatarChanged = avatarFile !== null

    const hasChanges =
      nameChanged ||
      usernameChanged ||
      bioChanged ||
      avatarChanged

    if (!hasChanges) {
      toast.info('Nenhuma alteração para salvar.')
      return
    }

    try {
      setSaving(true)

      const data: {
        name?: string
        username?: string
        bio?: string
        avatarUrl?: string
      } = {}

      if (nameChanged) {
        data.name = currentName
      }

      if (usernameChanged) {
        data.username = currentUsername
      }

      if (bioChanged) {
        data.bio = currentBio
      }

      if (avatarFile) {
        const avatarUrl = await uploadAvatar(avatarFile)

        data.avatarUrl = avatarUrl
      }

      console.log('Dados enviados:', data)

      const response =
        await usersService.updateProfile(data)

      updateUser(response.data)

      setInitialData({
        name: response.data.name,
        username: normalizeUsername(
          response.data.username,
        ),
        bio: response.data.bio?.trim() ?? '',
        avatarUrl: response.data.avatarUrl ?? null,
      })

      setInitialAvatar(
        response.data.avatarUrl ?? null,
      )

      setAvatarFile(null)

      toast.success(
        'Perfil atualizado com sucesso.',
      )
    } catch (error: any) {
      console.error(
        'Erro ao atualizar perfil:',
        error,
      )

      toast.error(
        error?.message ||
        'Não foi possível atualizar o perfil.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0c0d0c] text-white">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-5">
          <p className="text-sm text-white/40">
            Carregando perfil...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="mb-12 min-h-screen bg-[#0c0d0c] text-white">
      {/* Header */}
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
                <div className="group relative size-36 overflow-hidden rounded-full border border-white/10 bg-white/5">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Foto de perfil"
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <User className="size-12 text-white/20" />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
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
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
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
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      maxLength={50}
                      disabled={saving}
                      className="h-11 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-white/20 focus:border-[#d8ff3e]/60 disabled:opacity-50"
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
                    <span className="pl-3 text-sm text-white/25">
                      @
                    </span>

                    <input
                      id="username"
                      value={username}
                      onChange={(e) =>
                        setUsername(
                          e.target.value
                            .toLowerCase()
                            .replace(
                              /[^a-z0-9_.]/g,
                              '',
                            ),
                        )
                      }
                      maxLength={30}
                      disabled={saving}
                      className="h-full flex-1 bg-transparent px-2 text-sm outline-none disabled:opacity-50"
                      placeholder="seuusuario"
                    />
                  </div>

                  <p className="mt-2 text-[11px] text-white/25">
                    Seu nome de usuário será usado no endereço
                    do seu perfil.
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
                    onChange={(e) =>
                      setBio(e.target.value)
                    }
                    maxLength={160}
                    rows={4}
                    disabled={saving}
                    placeholder="Conte um pouco sobre você..."
                    className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 outline-none transition-colors placeholder:text-white/20 focus:border-[#d8ff3e]/60 disabled:opacity-50"
                  />
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
                  Seu perfil pode ser encontrado por outras
                  pessoas. Suas músicas publicadas e
                  informações públicas estarão disponíveis para
                  quem visitar seu perfil.
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