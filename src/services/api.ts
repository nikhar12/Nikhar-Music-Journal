const apiBase = import.meta.env.VITE_API_URL ?? '/api';

export class ApiError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: 'Unable to reach your music journal.' }));
    throw new ApiError(payload.message ?? 'Request failed.', response.status);
  }
  return response.json() as Promise<T>;
}

export type Session = { token: string; user: { username: string } };
export type SearchResult = { provider: 'spotify' | 'youtube'; providerId: string; title: string; artists: string[]; album?: string; artworkUrl?: string; externalUrl: string; durationMs?: number; releaseDate?: string; popularity?: number; channel?: string; publishedAt?: string; metadata: Record<string, unknown> };
export type SearchGroup = { provider: 'spotify' | 'youtube'; enabled: boolean; results: SearchResult[]; message?: string };
export type LibraryEntry = { _id: string; rating?: number; favorite: boolean; tags: string[]; notes: string; createdAt: string; musicRecordId: { title: string; album?: string; artists: string[]; genres: string[]; artworkUrl?: string } };
type JournalDetails = { rating: number; favorite: boolean; tags: string[]; notes: string };
export const api = {
  login: (username: string, password: string) => request<Session>('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  library: (token: string, query = '') => request<{ data: LibraryEntry[] }>('/library' + (query ? `?q=${encodeURIComponent(query)}` : ''), {}, token),
  searchMusic: (token: string, query: string) => request<{ groups: SearchGroup[] }>(`/search?q=${encodeURIComponent(query)}`, {}, token),
  saveProviderSong: (token: string, song: SearchResult, journal: JournalDetails) => request<LibraryEntry>('/music/from-provider', { method: 'POST', body: JSON.stringify({ ...song, ...journal }) }, token),
  updateEntry: (token: string, id: string, journal: Partial<JournalDetails>) => request(`/library/${id}`, { method: 'PATCH', body: JSON.stringify(journal) }, token),
  tags: (token: string) => request<{ data: { name: string; count: number }[] }>('/tags', {}, token),
  renameTag: (token: string, oldName: string, name: string) => request(`/tags/${encodeURIComponent(oldName)}`, { method: 'PATCH', body: JSON.stringify({ name }) }, token),
};
