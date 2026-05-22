import { useContext } from "react";
import { MovieContext } from "../contexts/MovieContext";

const useMovieContext = () => useContext(MovieContext);

export { useMovieContext };