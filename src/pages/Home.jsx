import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import { searchMulti, getPopularMovies, getUpcomingMovies, getPopularTV, getTrendingTV } from "../services/api";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("movie"); // 'movie' or 'tv'

  const loadMedia = async () => {
    try {
      const [popMovies, upMovies, popTV, trendTV] = await Promise.all([
        getPopularMovies(),
        getUpcomingMovies(),
        getPopularTV(),
        getTrendingTV()
      ]);
      setPopularMovies(popMovies);
      setUpcomingMovies(upMovies);
      setPopularTV(popTV);
      setTrendingTV(trendTV);
    } catch (err) {
      console.log(err);
      setError("Failed to load content...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (loading) return;

    setLoading(true);
    setIsSearching(true);
    try {
      const results = await searchMulti(searchQuery);
      setSearchResults(results);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to search...");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setSearchResults([]);
    setError(null);
  };

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies or TV shows..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
        {isSearching && (
          <button type="button" onClick={handleClearSearch} className="clear-button">
            Clear
          </button>
        )}
      </form>

      {!isSearching && (
        <div className="media-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
          <button 
            className={`tab-btn ${activeTab === 'movie' ? 'active' : ''}`} 
            onClick={() => setActiveTab('movie')}
            style={{ padding: '0.8rem 2rem', fontSize: '1.1rem', borderRadius: '8px', cursor: 'pointer', background: activeTab === 'movie' ? '#e50914' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}
          >
            Movies
          </button>
          <button 
            className={`tab-btn ${activeTab === 'tv' ? 'active' : ''}`} 
            onClick={() => setActiveTab('tv')}
            style={{ padding: '0.8rem 2rem', fontSize: '1.1rem', borderRadius: '8px', cursor: 'pointer', background: activeTab === 'tv' ? '#e50914' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}
          >
            TV Series
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          {isSearching ? (
            <>
              <h2>Search Results for "{searchQuery}"</h2>
              {searchResults.length > 0 ? (
                <div className="movies-grid">
                  {searchResults.map((media) => (
                    <MovieCard movie={media} key={media.id} />
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <p>No results found for "{searchQuery}". Try a different search term.</p>
                </div>
              )}
            </>
          ) : (
            <>
              {activeTab === 'movie' ? (
                <>
                  <h2>Popular Movies</h2>
                  <div className="movies-grid">
                    {popularMovies.map((movie) => (
                      <MovieCard movie={movie} key={movie.id} />
                    ))}
                  </div>
                  <h2 style={{ marginTop: '3rem' }}>Latest Movies</h2>
                  <div className="movies-grid">
                    {upcomingMovies.map((movie) => (
                      <MovieCard movie={movie} key={movie.id} />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2>Popular TV Series</h2>
                  <div className="movies-grid">
                    {popularTV.map((tv) => (
                      <MovieCard movie={{...tv, media_type: 'tv'}} key={tv.id} />
                    ))}
                  </div>
                  <h2 style={{ marginTop: '3rem' }}>Trending TV Series</h2>
                  <div className="movies-grid">
                    {trendingTV.map((tv) => (
                      <MovieCard movie={{...tv, media_type: 'tv'}} key={tv.id} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
