'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { ArrowRight, Eye, EyeOff, Radio } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

import { authService } from '@/services/auth.service'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuth()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  function handleChange(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    try {
      setLoading(true)

      const response = await authService.login({
        email: form.email,
        password: form.password,
      })

      setAuth(
        response.data.accessToken,
        response.data.user,
      )

      toast.success('Login realizado com sucesso!')


      router.push('/')
    } catch (error: any) {
      console.error('Login error:', error)

      toast.error(
        error?.message ||
        'Email ou senha inválidos.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0c0d0c] text-white">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LADO ESQUERDO */}
        <div className="relative hidden overflow-hidden border-r border-white/8 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(216,255,62,.12),transparent_35%)]" />

          <div className="relative flex w-full flex-col justify-between p-10">
            <Logo />

            <div>
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#d8ff3e]">
                Music for the afters
              </p>

              <h1 className="max-w-lg text-6xl font-semibold leading-[0.95] tracking-[-0.06em]">
                Mantenha-se firme.
                <br />
                Faça barulho.
              </h1>

              <p className="mt-6 max-w-md text-sm leading-6 text-white/40">
                Descubra novos artistas, sons underground e músicas
                que combinam com o seu momento.
              </p>
            </div>

            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/20">
              BAD VIBES FOREVER © 2026
            </p>
          </div>
        </div>

        {/* FORMULÁRIO */}
        <div className="flex items-center justify-center px-5 py-10">
          <div className="w-full max-w-md">

            <div className="mb-10 lg:hidden">
              <Logo />
            </div>

            <div className="mb-8">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#d8ff3e]">
                Bem-vindo de volta
              </p>

              <h2 className="text-3xl font-semibold tracking-[-0.04em]">
                Entrar
              </h2>

              <p className="mt-2 text-sm text-white/40">
                Entre para continuar ouvindo suas músicas.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* EMAIL */}
              <Field
                label="Email"
                type="email"
                placeholder="voce@email.com"
                value={form.email}
                onChange={(value) =>
                  handleChange('email', value)
                }
              />

              {/* SENHA */}
              <div>
                <label className="mb-2 block text-xs font-medium text-white/60">
                  Senha
                </label>

                <div className="relative">
                  <input
                    required
                    value={form.password}
                    onChange={(event) =>
                      handleChange(
                        'password',
                        event.target.value,
                      )
                    }
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    placeholder="••••••••"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 pr-12 text-sm outline-none transition-colors placeholder:text-white/20 focus:border-[#d8ff3e]/60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* ESQUECEU A SENHA */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs text-white/40 hover:text-[#d8ff3e]"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              {/* BOTÃO */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#d8ff3e] text-sm font-bold text-[#101110] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? 'Entrando...'
                  : 'Entrar'}

                {!loading && (
                  <ArrowRight className="size-4" />
                )}
              </button>

            </form>

            <p className="mt-8 text-center text-sm text-white/40">
              Ainda não tem uma conta?{' '}

              <Link
                href="/register"
                className="font-medium text-[#d8ff3e] hover:underline"
              >
                Criar conta
              </Link>
            </p>

          </div>
        </div>
      </div>
    </main>
  )
}

function Logo() {
  return (
    <Link
      href="/"
      className="flex w-fit items-center gap-3"
    >

      <span className="font-mono text-[13px] font-bold leading-tight tracking-[-0.05em]">
        BAD VIBES
        <br />
        FOREVER
      </span>
    </Link>
  )
}

function Field({
  label,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string
  type: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-white/60">
        {label}
      </label>

      <input
        required
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition-colors placeholder:text-white/20 focus:border-[#d8ff3e]/60"
      />
    </div>
  )
}