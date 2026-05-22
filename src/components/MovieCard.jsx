import { memo } from "react";
import { useNavigate } from "react-router-dom";
import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";

const MovieCard = memo(function MovieCard({ movie }) {
  const { isFavorite, addToFavorites, removeFromFavorites, getGenreNames } = useMovieContext();
  const favorite = isFavorite(movie.id);
  const navigate = useNavigate();

  const title = movie.title || movie.name;
  const date = movie.release_date || movie.first_air_date;
  const releaseYear = date?.split("-")[0];
  const mediaType = movie.media_type || (movie.name ? 'tv' : 'movie');

  function onFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) removeFromFavorites(movie.id);
    else addToFavorites(movie);
  }

  return (
    <div className="movie-card-link" onClick={() => navigate(`/${mediaType}/${movie.id}`)}>
      <div className="movie-card">
        <div className="movie-poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={title}
            loading="lazy"
          />
          <div className="movie-overlay">
            <button
              className={`favorite-btn ${favorite ? "active" : ""}`}
              onClick={onFavoriteClick}
              aria-label={
                favorite
                  ? `Remove ${title} from favorites`
                  : `Add ${title} to favorites`
              }
            >
              ♥
            </button>
          </div>
        </div>
        <div className="movie-info">
          <h3>{title}</h3>
          <p>{releaseYear}</p>
          <p className="movie-genre">{getGenreNames(movie.genre_ids)}</p>
        </div>
      </div>
    </div>
  );
});

export default MovieCard;
