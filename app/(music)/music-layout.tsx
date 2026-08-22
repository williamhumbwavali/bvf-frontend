'use client'

import MusicPlayer from '@/components/music-player'

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0c0d0c] text-white">
      {children}

      <MusicPlayer />
    </div>
  )
}