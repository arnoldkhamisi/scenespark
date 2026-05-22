import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovieVideos } from "../services/api";
import "../css/WatchPage.css";

function WatchPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieVideos = async () => {
      try {
        const videos = await getMovieVideos(id);
        const trailer = videos.find((video) => video.type === "Trailer");
        setVideo(trailer || videos[0]);
      } catch {
        setError("Failed to load movie videos...");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieVideos();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!video) {
    return (
      <div className="watch-page">
        <div className="watch-page-header">
          <Link to={`/movie/${id}`} className="back-button">
            &larr; Back to details
          </Link>
        </div>
        <div className="error-message">No videos found for this movie.</div>
      </div>
    );
  }

  return (
    <div className="watch-page">
      <div className="watch-page-header">
        <Link to={`/movie/${id}`} className="back-button">
          &larr; Back to details
        </Link>
      </div>
      <div className="video-container">
        <iframe
          src={`https://www.youtube.com/embed/${video.key}`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="video"
        />
      </div>
    </div>
  );
}

export default WatchPage;
