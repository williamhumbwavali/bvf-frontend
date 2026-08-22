export type Artist = { id: string; name: string; handle: string; genre: string; image: string; verified?: boolean; followers: string; bio?: string }
export type Track = { id: string; title: string; artist: string; artistId: string; album: string; cover: string; duration: string; genre: string; plays: string; accent?: string, audioUrl?: string }
export type Playlist = { id: string; title: string; description: string; cover: string; tracks: number; owner: string }
export type Album = { id: string; title: string; artist: string; artistId: string; year: string; cover: string; tracks: Track[] }
export type Activity = { id: string; title: string; artist: string; time: string; cover: string; type: 'release' | 'mix' | 'follow' }
export const artists: Artist[] = [
    { id: 'brandao85', name: 'Brandão85', handle: '@brandao85', genre: 'Dubstep', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJzTkdbsEDExYhrEcOVSQbLE40lt_fD0iLUFNisMKxo2Bh2YbC0xsEJTs&s=10', verified: true, followers: '284 mil' },
    { id: 'nox', name: 'Nox Vahn', handle: '@noxvahn', genre: 'Melodic House', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=500&q=80', verified: true, followers: '92 mil' },
    { id: 'luma', name: 'Luma', handle: '@lumabeats', genre: 'Electronic', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=500&q=80', followers: '41 mil' },
    { id: 'arca', name: 'Arca Nova', handle: '@arcanova', genre: 'Experimental', image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=500&q=80', followers: '18 mil' }]
const c = [
    'https://i.scdn.co/image/ab67616d0000b27351f1bdb15406e4706081c00d',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrcN5z6zpYf7w3K9AxBhvgDTWtRN8BGDcmEsA1jlrywfbw5Drd_TEEdFQW&s=10',
    'https://i.scdn.co/image/ab67616d0000b2730ab4d3e1c0b5c5e453287a4c',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXYLI8Ui1nsbtxzWscXeQMin2YlnHKGQ5cPZbRNJrN2Q&s=10',
    'https://i.scdn.co/image/ab67616d0000b2730348d174bc1253a02bcb4ca2',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMdRthGSdSN0k0bKNFN6yH8rXB1usg-sSOptNFd3FIF3U7A6pOkq9NzAAc&s=10'
]
export const tracks: Track[] = [
    { id: 't1', title: 'Nuts', artist: 'Lil peep, Rainy Bear', artistId: 'nox', album: 'Live Forever', cover: c[1] + '?auto=format&fit=crop&w=600&q=80', duration: '4:18', genre: 'Emo Rap', plays: '892 mil', audioUrl: '/sounds/nuts.mp3' },
    { id: 't2', title: 'Oh my baby', artist: 'Brandão85, Che Ecru', artistId: 'brandao85', album: 'Isso é trap', cover: c[0] + '?auto=format&fit=crop&w=600&q=80', duration: '3:42', genre: 'trap e R&B', plays: '1,2M', audioUrl: '/sounds/oh-my-baby.mp3' },
    { id: 't3', title: 'Free mind', artist: 'Tems', artistId: 'tems', album: 'Soft Focus', cover: c[2] + '?auto=format&fit=crop&w=600&q=80', duration: '3:56', genre: 'R&B alternativo (alt-R&B) e Afro-fusion', plays: '421 mil', audioUrl: '/sounds/free-mind.mp3' },
    { id: 't4', title: 'Me & U', artist: 'Tems', artistId: 'tems', album: 'No Signal', cover: c[3] + '?auto=format&fit=crop&w=600&q=80', duration: '5:04', genre: 'Afro R&B', plays: '208 mil', audioUrl: '/sounds/me-&-u.mp3' },
    { id: 't5', title: 'Just for me', artist: 'Pinkpantheress', artistId: 'pinkpantheress', album: 'Rage Room', cover: c[4] + '?auto=format&fit=crop&w=600&q=80', duration: '3:12', genre: 'bedroom pop, 2-step garage (ou UK garage) e alternative pop', plays: '198 mil', audioUrl: '/sounds/just-for-me.mp3' },
    { id: 't6', title: 'Elevate & Motivate', artist: 'Trippie Redd, NBA YoungBoy, Nel-Denarro', artistId: 'tripperedd', album: 'Future', cover: c[5] + '?auto=format&fit=crop&w=600&q=80', duration: '4:02', genre: 'Hip-Hop / Rap', plays: '164 mi', audioUrl: '/sounds/elevate-motivate.mp3' }]
export const playlists: Playlist[] = [{ id: 'p1', title: 'Descobertas da semana', description: 'Sons novos para sair da rotina.', cover: c[1] + '?auto=format&fit=crop&w=600&q=80', tracks: 32, owner: 'Bad Vibes Forever' }, { id: 'p2', title: 'Noite sem fim', description: 'Bass, house e tudo entre eles.', cover: c[3] + '?auto=format&fit=crop&w=600&q=80', tracks: 48, owner: 'Marauda' }, { id: 'p3', title: 'Foco profundo', description: 'Eletrónica para criar sem parar.', cover: c[2] + '?auto=format&fit=crop&w=600&q=80', tracks: 24, owner: 'Luma' }]
export const albums: Album[] = [{ id: 'a1', title: 'Rage Room', artist: 'Marauda', artistId: 'marauda', year: '2025', cover: tracks[0].cover, tracks: [tracks[0], tracks[4]] }, { id: 'a2', title: 'Future', artist: 'Nox Vahn', artistId: 'nox', year: '2024', cover: tracks[1].cover, tracks: [tracks[1], tracks[5]] }]
export const homeData = { featured: tracks[0], trending: tracks.slice(1, 5), playlists, activity: [] as Activity[], chart: [38, 52, 44, 70, 62, 88, 76].map((value, i) => ({ day: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i], value })) }
export async function getTracks() { return tracks }; export async function searchTracks(q: string) { return tracks.filter(t => `${t.title} ${t.artist} ${t.album}`.toLowerCase().includes(q.toLowerCase())) }; export async function getArtist(id: string) { return artists.find(a => a.id === id) || artists[0] }; export async function getHistory() { return tracks.slice(0, 5) }; export async function getTopTracks() { return tracks.slice(0, 5) }; export async function uploadTrack(_p: FormData) { return { ok: true, id: `track-${Date.now()}` } }; export async function updateProfile(_p: Partial<Artist>) { return { ok: true } }; export async function savePlaylist(_p: Playlist) { return { ok: true } }; export async function deleteTrack(_id: string) { return { ok: true } }
