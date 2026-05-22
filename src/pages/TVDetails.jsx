import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getTVDetails, getTVSeasonDetails } from "../services/api";
import "../css/MovieDetails.css";

function TVDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tvShow, setTvShow] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonData, setSeasonData] = useState(null);

  useEffect(() => {
    const fetchTVData = async () => {
      setLoading(true);
      try {
        const details = await getTVDetails(id);
        setTvShow(details);
        if (details.seasons && details.seasons.length > 0) {
          // Find first valid season (usually 1, sometimes 0 for specials)
          const firstValidSeason = details.seasons.find(s => s.season_number > 0) || details.seasons[0];
          setSelectedSeason(firstValidSeason.season_number);
        }
      } catch {
        setError("Failed to load TV details...");
      } finally {
        setLoading(false);
      }
    };

    fetchTVData();
  }, [id]);

  useEffect(() => {
    const fetchSeason = async () => {
      if (!id || selectedSeason === null) return;
      try {
        const data = await getTVSeasonDetails(id, selectedSeason);
        setSeasonData(data);
      } catch (err) {
        console.error("Failed to load season data", err);
      }
    };
    fetchSeason();
  }, [id, selectedSeason]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!tvShow) {
    return null;
  }

  return (
    <div className="movie-details">
      <div className="movie-details-poster">
        <img
          src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
          alt={tvShow.name}
        />
      </div>
      <div className="movie-details-info">
        <button onClick={() => navigate("/")} className="back-button">
          &larr; Back
        </button>
        <h1>{tvShow.name}</h1>
        <p>{tvShow.overview}</p>
        <p>
          <strong>First Aired:</strong> {tvShow.first_air_date}
        </p>
        <p>
          <strong>Rating:</strong> {tvShow.vote_average?.toFixed(1)} / 10
        </p>

        <div className="seasons-section" style={{ marginTop: '2rem' }}>
          <h3>Episodes</h3>
          <div className="season-selector" style={{ marginBottom: '1rem' }}>
            <label htmlFor="season-select" style={{ marginRight: '1rem', color: '#fff' }}>Select Season: </label>
            <select 
              id="season-select"
              value={selectedSeason} 
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
              style={{ padding: '0.5rem', borderRadius: '4px', background: '#333', color: 'white', border: '1px solid #555' }}
            >
              {tvShow.seasons?.filter(s => s.season_number > 0).map(season => (
                <option key={season.id} value={season.season_number}>
                  {season.name}
                </option>
              ))}
            </select>
          </div>

          <div className="episodes-list" style={{ display: 'grid', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
            {seasonData?.episodes?.map(episode => (
              <div key={episode.id} className="episode-card" style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>{episode.episode_number}. {episode.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>
                    {episode.overview ? (episode.overview.length > 100 ? episode.overview.substring(0, 100) + '...' : episode.overview) : 'No description available.'}
                  </p>
                </div>
                <Link 
                  to={`/watch-movie/tv/${id}/${selectedSeason}/${episode.episode_number}`} 
                  className="watch-full-movie-button"
                  style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}
                >
                  Watch Episode
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TVDetails;
