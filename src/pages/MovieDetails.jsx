import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getMovieDetails, getMovieStreamingProviders } from "../services/api";
import "../css/MovieDetails.css";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [streamingProviders, setStreamingProviders] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const [movieDetails, streamingData] = await Promise.all([
          getMovieDetails(id),
          getMovieStreamingProviders(id)
        ]);
        setMovie(movieDetails);
        setStreamingProviders(streamingData);
      } catch {
        setError("Failed to load movie details...");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!movie) {
    return null;
  }

  return (
    <div className="movie-details">
      <div className="movie-details-poster">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
      </div>
      <div className="movie-details-info">
        <button onClick={() => navigate("/")} className="back-button">
          &larr; Back
        </button>
        <h1>{movie.title}</h1>
        <p>{movie.overview}</p>
        <p>
          <strong>Release Date:</strong> {movie.release_date}
        </p>
        <p>
          <strong>Rating:</strong> {movie.vote_average} / 10
        </p>

        {/* Streaming Providers Section */}
        <div className="streaming-section">
          <h3>Where to Watch</h3>
          {streamingProviders?.streaming_providers?.length > 0 ? (
            <div className="streaming-providers">
              {streamingProviders.streaming_providers.slice(0, 6).map((provider, index) => (
                <a
                  key={index}
                  href={provider.urls?.standard_web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="streaming-provider"
                  title={`Watch on ${provider.package_short_name}`}
                >
                  <img
                    src={`https://images.justwatch.com/icon/${provider.icon}.png`}
                    alt={provider.package_short_name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span>{provider.package_short_name}</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="no-streaming">No streaming information available</p>
          )}

          {streamingProviders?.justwatch_url && (
            <a
              href={streamingProviders.justwatch_url}
              target="_blank"
              rel="noopener noreferrer"
              className="justwatch-link"
            >
              View all options on JustWatch
            </a>
          )}
        </div>

        {/* Trailer Link */}
        <Link to={`/watch/${id}`} className="watch-trailer-button">
          Watch Trailer
        </Link>

        {/* Full Movie Link */}
        <Link to={`/watch-media/movie/${id}`} className="watch-full-movie-button">
          Watch Full Movie
        </Link>
      </div>
    </div>
  );
}

export default MovieDetails;
