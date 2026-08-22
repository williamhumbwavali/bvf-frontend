import MusicProfile from '@/components/music-profile'

interface PageProps {
  params: Promise<{
    username: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { username } = await params

  return (
    <MusicProfile
      isOwner={false}
      username={username}
    />
  )
}