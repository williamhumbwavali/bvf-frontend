import MusicLayout from './music-layout'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MusicLayout>{children}</MusicLayout>
}