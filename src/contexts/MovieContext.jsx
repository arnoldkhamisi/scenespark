import { useState, useEffect, useMemo, useCallback } from "react";
import { MovieContext } from "./movieContext";

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

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

  const value = useMemo(() => ({
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  }), [favorites, addToFavorites, removeFromFavorites, isFavorite]);

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
