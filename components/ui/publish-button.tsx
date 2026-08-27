'use client'

import { useState } from 'react'
import { Disc3, Music2, Plus, X } from 'lucide-react'
import Link from 'next/link'

export default function PublishButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-lg bg-[#d8ff3e] px-4 py-2.5 text-xs font-bold text-[#101110] transition-transform hover:scale-[1.02] sm:flex"
      >
        <Plus className="size-4" />
        Publicar
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#131513] p-5 shadow-2xl"
          >
            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d8ff3e]">
                  Estúdio
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  O que você quer publicar?
                </h2>

                <p className="mt-1 text-xs text-white/35">
                  Escolha o tipo de conteúdo que deseja enviar para o BVF.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-white/30 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Options */}
            <div className="grid gap-3">
              <Link
                href="/tracks/upload"
                onClick={() => setOpen(false)}
                className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.025] p-4 transition-all hover:border-[#d8ff3e]/40 hover:bg-white/[0.05]"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#1c201c] text-[#d8ff3e] transition-colors group-hover:bg-[#d8ff3e] group-hover:text-[#101110]">
                  <Music2 className="size-5" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-medium">
                    Publicar música
                  </h3>

                  <p className="mt-1 text-xs text-white/35">
                    Publique uma faixa individual.
                  </p>
                </div>
              </Link>

              <Link
                href="/albums/create"
                onClick={() => setOpen(false)}
                className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.025] p-4 transition-all hover:border-[#d8ff3e]/40 hover:bg-white/[0.05]"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#1c201c] text-[#d8ff3e] transition-colors group-hover:bg-[#d8ff3e] group-hover:text-[#101110]">
                  <Disc3 className="size-5" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-medium">
                    Publicar álbum
                  </h3>

                  <p className="mt-1 text-xs text-white/35">
                    Envie várias músicas de uma vez.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}