# SceneSpark - Movie Discovery App

A modern React application for discovering and exploring movies using The Movie Database (TMDB) API. Built with Vite for fast development and optimized performance.

## Features

- 🎬 Browse popular movies
- 🔍 Search for movies by title
- ⭐ Save favorite movies to local storage
- 📱 Responsive design
- ⚡ Optimized performance with lazy loading
- 🎯 Accessibility improvements

## Tech Stack

- **Frontend**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.13.0
- **Styling**: CSS with modular approach
- **API**: TMDB (The Movie Database)

## Getting Started

### Prerequisites

1. Get your TMDB API key from [TMDB Developer Portal](https://www.themoviedb.org/settings/api)
2. Create a `.env` file in the root directory with your API key:

```env
VITE_API_KEY=your_tmdb_api_key_here
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
├── css/               # Stylesheets
├── pages/             # Page components
│   ├── Home.jsx       # Home page with movie listings
│   └── Favorites.jsx  # Favorites page
├── services/          # API services
│   └── api.js         # TMDB API integration
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
