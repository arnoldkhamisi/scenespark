import { createContext, useState, useEffect, useMemo, useCallback, useContext } from "react";
import { getGenres } from "../services/api";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export { MovieContext };

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const initializeFavorites = () => {
      try {
        const storedFavs = localStorage.getItem("favorites");
        if (storedFavs) {
          const parsedFavs = JSON.parse(storedFavs);
          if (parsedFavs && Array.isArray(parsedFavs)) {
            setFavorites(parsedFavs);
          }
        }
      } catch (error) {
        console.error("Error parsing favorites from localStorage:", error);
        localStorage.removeItem("favorites");
      }
    };
    
    initializeFavorites();
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await getGenres();
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const saveFavorites = () => {
      try {
        localStorage.setItem("favorites", JSON.stringify(favorites));
      } catch (error) {
        console.error("Error saving favorites to localStorage:", error);
      }
    };
    
    saveFavorites();
  }, [favorites]);

  const addToFavorites = useCallback((movie) => {
    if (!movie || !movie.id) {
      console.warn("Invalid movie object:", movie);
      return;
    }
    
    setFavorites((prev) => {
      if (prev.some((fav) => fav.id === movie.id)) {
        return prev;
      }
      return [...prev, movie];
    });
  }, []);

  const removeFromFavorites = useCallback((movieId) => {
    if (!movieId) {
      console.warn("Invalid movieId:", movieId);
      return;
    }
    
    setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
  }, []);

  const isFavorite = useCallback((movieId) => {
    if (!movieId) return false;
    return favorites.some((movie) => movie.id === movieId);
  }, [favorites]);

  const getGenreNames = useCallback((genreIds) => {
    if (!genreIds || !Array.isArray(genreIds) || genres.length === 0) return "";
    return genreIds
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean)
      .slice(0, 2)
      .join(", ");
  }, [genres]);

  const value = useMemo(() => ({
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getGenreNames,
  }), [favorites, addToFavorites, removeFromFavorites, isFavorite, getGenreNames]);

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
