import Link from 'next/link'
import { Disc3 } from 'lucide-react'
import type { Album } from '@/services/albums.service'

export function AlbumsSection({
  albums,
  title = 'Álbuns recentes',
  description,
}: {
  albums: Album[]
  title?: string
  description?: string
}) {
  if (albums.length === 0) return null

  return (
    <section className="mt-12">
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description && <p className="mt-1 text-xs text-white/35">{description}</p>}
      </div>

      <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {albums.slice(0, 4).map((album) => (
          <Link key={album.id} href={`/albums/${album.id}`} className="group min-w-0">
            <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-white/5">
              {album.coverUrl ? (
                <img
                  src={album.coverUrl}
                  alt={`Capa do álbum ${album.title}`}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-[#151815]">
                  <Disc3 className="size-12 text-white/15" />
                </div>
              )}
            </div>
            <h3 className="truncate text-sm font-medium transition-colors group-hover:text-[#d8ff3e]">
              {album.title}
            </h3>
            <p className="mt-1 truncate text-xs text-white/40">
              {album.artist?.name ?? 'Artista'} · {album.tracks?.length ?? 0} músicas
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
