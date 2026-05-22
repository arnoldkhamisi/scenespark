# SceneSpark - Movie Discovery App

A modern React application for discovering and exploring movies using The Movie Database (TMDB) API. Built with Vite for fast development and optimized performance.

## Features

- 🎬 Browse popular movies
- 🔍 Search for movies by title
- ⭐ Save favorite movies to local storage
- 🎥 View movie trailers
- 📺 Find where to stream movies (Netflix, Prime Video, etc.)
- 🎬 Watch full movies on YouTube
- 📱 Responsive design
- ⚡ Optimized performance with lazy loading
- 🎯 Accessibility improvements

## Tech Stack

- **Frontend**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.13.0
- **Styling**: CSS with modular approach
- **APIs**: TMDB (The Movie Database) + JustWatch + YouTube Data API v3

## Getting Started

### Prerequisites

1. Get your TMDB API key from [TMDB Developer Portal](https://www.themoviedb.org/settings/api)
2. (Optional) Get a YouTube Data API v3 key from [Google Cloud Console](https://console.cloud.google.com/) for full movie streaming
3. Create a `.env` file in the root directory with your API keys:

```env
VITE_API_KEY=your_tmdb_api_key_here
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
```

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── MovieCard.jsx   # Movie card component
│   └── NavBar.jsx      # Navigation bar
├── contexts/           # React contexts
│   └── MovieContext.jsx # Movie state management
├── hooks/              # Custom React hooks
│   └── useMovieContext.js # Movie context hook
├── css/               # Stylesheets
├── pages/             # Page components
│   ├── Favorites.jsx  # Favorites page
│   ├── Home.jsx       # Home page with movie listings
│   ├── MovieDetails.jsx # Movie details page
│   ├── WatchPage.jsx  # Trailer watching page
│   └── WatchMovie.jsx # Full movie watching page
├── services/          # API services
│   └── api.js         # TMDB, JustWatch & YouTube API integration
└── main.jsx           # Application entry point
```

## Performance Optimizations

- React.memo for component memoization
- useMemo for context value optimization
- Lazy loading for code splitting
- Image lazy loading
- Environment variables for API key security

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
