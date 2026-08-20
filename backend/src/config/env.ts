import 'dotenv/config';
const required = ['MONGODB_URI', 'JWT_SECRET', 'JOURNAL_USERNAME', 'JOURNAL_PASSWORD'] as const;
for (const key of required) if (!process.env[key]) throw new Error(`Missing required environment variable: ${key}`);
export const env = { port: Number(process.env.PORT ?? 4000), mongoUri: process.env.MONGODB_URI!, jwtSecret: process.env.JWT_SECRET!, username: process.env.JOURNAL_USERNAME!, password: process.env.JOURNAL_PASSWORD!, frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173', spotifyClientId: process.env.SPOTIFY_CLIENT_ID, spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET, youtubeApiKey: process.env.YOUTUBE_API_KEY };
