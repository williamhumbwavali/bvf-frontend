'use client'

import { useState } from 'react'
import { Check, ChevronLeft, Globe2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast, Toaster } from 'sonner'

const languages = [
  {
    id: 'pt',
    name: 'Português',
    nativeName: 'Português',
    description: 'Idioma principal da interface',
  },
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
    description: 'Use o Bad Vibes Forever em inglês',
  },
]

export default function LanguagePage() {
  const router = useRouter()

  const [language, setLanguage] = useState('pt')

  const handleSelect = (id: string) => {
    setLanguage(id)

    const selected = languages.find((item) => item.id === id)

    if (selected) {
      toast.success(`Idioma alterado para ${selected.name}`)
    }
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

      <main className="mx-auto min-h-screen w-full max-w-3xl px-5 py-8 md:px-8 md:py-12">
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
              <Globe2 className="size-5" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                Idioma
              </h1>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Escolha o idioma que você deseja usar no Bad Vibes Forever.
              </p>
            </div>
          </div>
        </header>

        {/* Languages */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#131513]">
          <div className="border-b border-white/8 px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
              Idioma da interface
            </p>
          </div>

          <div>
            {languages.map((item) => {
              const selected = language === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`
                    flex w-full items-center gap-4 border-b border-white/7
                    px-5 py-5 text-left transition-colors last:border-0
                    ${
                      selected
                        ? 'bg-white/[0.04]'
                        : 'hover:bg-white/[0.025]'
                    }
                  `}
                >
                  {/* Language icon */}
                  <div
                    className={`
                      flex size-10 shrink-0 items-center justify-center
                      rounded-lg text-xs font-bold
                      ${
                        selected
                          ? 'bg-[#d8ff3e]/10 text-[#d8ff3e]'
                          : 'bg-white/5 text-white/40'
                      }
                    `}
                  >
                    {item.id === 'pt' ? 'PT' : 'EN'}
                  </div>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium ${
                        selected ? 'text-white' : 'text-white/80'
                      }`}
                    >
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      {item.description}
                    </p>
                  </div>

                  {/* Selected */}
                  <div
                    className={`
                      flex size-5 shrink-0 items-center justify-center
                      rounded-full border transition-all
                      ${
                        selected
                          ? 'border-[#d8ff3e] bg-[#d8ff3e] text-[#101110]'
                          : 'border-white/15 bg-transparent'
                      }
                    `}
                  >
                    {selected && <Check className="size-3.5" />}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* Information */}
        <div className="mt-5 rounded-xl border border-white/8 bg-[#101110] px-5 py-4">
          <p className="text-xs leading-5 text-white/35">
            A alteração do idioma será aplicada à interface da plataforma.
            Algumas informações publicadas pelos artistas, como títulos,
            nomes e descrições das músicas, permanecerão no idioma original.
          </p>
        </div>
      </main>
    </div>
  )
}