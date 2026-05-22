import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails, getMovieRecommendations } from "../services/api";
import MovieCard from "../components/MovieCard";
import "../css/Watch.css";

function Watch() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchData = async () => {
      setLoading(true);
      try {
        // Fetch details and recommendations in parallel
        const [movieData, recs] = await Promise.all([
          getMovieDetails(id),
          getMovieRecommendations(id),
        ]);

        setMovie(movieData);
        setRecommendations(recs);
      } catch (error) {
        console.error("Failed to load watch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchData();
    // Scroll to top when switching movies
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="watch-loading">Loading movie...</div>;
  if (!movie) return <div className="watch-error">Movie not found</div>;

  return (
    <div className="watch-page">
      <div className="player-wrapper">
        <iframe
          className="video-player"
          src={`https://vidsrc.xyz/embed/movie/${id}`}
          title={movie.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="watch-info">
        <h1>{movie.title}</h1>
        <div className="watch-meta">
          <span className="release-date">{movie.release_date?.split("-")[0]}</span>
          <span className="runtime">{movie.runtime} min</span>
          <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
        </div>
        <p className="overview">{movie.overview}</p>
      </div>

      <div className="recommendations-section">
        <h2>You Might Also Like</h2>
        <div className="movies-grid">
          {recommendations.slice(0, 5).map((rec) => <MovieCard movie={rec} key={rec.id} />)}
        </div>
      </div>
    </div>
  );
}

export default Watch;