'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Radio, Send } from 'lucide-react'
import { toast } from 'sonner'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!email.trim()) {
      toast.error('Digite o seu email.')
      return
    }

    setLoading(true)

    // Substituir posteriormente pela chamada real da API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setLoading(false)
    setSent(true)

    toast.success('Email de recuperação enviado.')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0c0d0c] px-5 py-10 text-white">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#d8ff3e] text-[#101110]">
              <Radio className="size-5" />
            </div>

            <span className="font-mono text-sm font-bold leading-4 tracking-[-0.05em]">
              BAD VIBES
              <br />
              FOREVER
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#131513] p-6 shadow-2xl md:p-8">
          {!sent ? (
            <>
              <div className="mb-8">
                <div className="mb-5 flex size-10 items-center justify-center rounded-full bg-white/5 text-[#d8ff3e]">
                  <Mail className="size-5" />
                </div>

                <h1 className="text-2xl font-semibold tracking-[-0.04em]">
                  Esqueceu sua senha?
                </h1>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  Não tem problema. Digite o email associado à sua conta e
                  enviaremos um link para criar uma nova senha.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-medium text-white/60"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="voce@email.com"
                      autoComplete="email"
                      className="h-11 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#d8ff3e]/60"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#d8ff3e] text-sm font-bold text-[#101110] transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Send className="size-4" />
                      Enviar link de recuperação
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="py-6 text-center">
              <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-[#d8ff3e]/10 text-[#d8ff3e]">
                <Mail className="size-5" />
              </div>

              <h1 className="text-2xl font-semibold tracking-[-0.04em]">
                Verifique seu email
              </h1>

              <p className="mt-3 text-sm leading-6 text-white/45">
                Se existir uma conta associada a{' '}
                <span className="text-white/70">{email}</span>, você receberá
                um link para redefinir sua senha.
              </p>

              <button
                onClick={() => setSent(false)}
                className="mt-6 text-xs font-semibold text-[#d8ff3e] hover:underline"
              >
                Usar outro email
              </button>
            </div>
          )}
        </div>

        {/* Voltar para login */}
        <Link
          href="/login"
          className="mx-auto mt-6 flex w-fit items-center gap-2 text-xs text-white/40 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-3.5" />
          Voltar para o login
        </Link>

        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">
          Music for the afters
        </p>
      </div>
    </main>
  )
}