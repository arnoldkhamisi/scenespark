import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails, getTVDetails } from "../services/api";
import "../css/WatchMovie.css";

function WatchMovie() {
  const { id, mediaType, season, episode } = useParams();
  
  // Determine if TV based on route params or URL
  const isTv = mediaType === 'tv' || window.location.pathname.includes('/tv/');
  const currentSeason = season || 1;
  const currentEpisode = episode || 1;

  const [media, setMedia] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [serverIndex, setServerIndex] = useState(0);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const playerRef = useRef(null);

  const servers = [
    {
      name: "Server 1 (Primary)",
      getUrl: (tv, sid, s, e) => tv 
        ? `https://vidsrc.me/embed/tv?tmdb=${sid}&season=${s}&ep=${e}` 
        : `https://vidsrc.me/embed/movie?tmdb=${sid}`
    },
    {
      name: "Server 2 (AutoEmbed)",
      getUrl: (tv, sid, s, e) => tv 
        ? `https://vidsrc.cc/v2/embed/tv/${sid}/${s}/${e}` 
        : `https://vidsrc.cc/v2/embed/movie/${sid}`
    },
    {
      name: "Server 3 (SuperBox)",
      getUrl: (tv, sid, s, e) => tv 
        ? `https://multiembed.mov/directstream.php?video_id=${sid}&tmdb=1&s=${s}&e=${e}` 
        : `https://multiembed.mov/directstream.php?video_id=${sid}&tmdb=1`
    }
  ];

  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        const data = isTv ? await getTVDetails(id) : await getMovieDetails(id);
        setMedia(data);
      } catch (err) {
        console.error(`Error fetching ${isTv ? 'TV' : 'Movie'} data:`, err);
        setError(`Failed to load information. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaData();
  }, [id, isTv]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      const isNativeFullScreen = !!(
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.msFullscreenElement
      );
      setIsFullScreen(isNativeFullScreen);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("msfullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
      document.removeEventListener("msfullscreenchange", handleFullScreenChange);
    };
  }, []);

  const toggleFullScreen = () => {
    const elem = playerRef.current;
    
    if (!isFullScreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => {
          console.warn('Error attempting to enable full-screen mode:', err.message);
          setIsFullScreen(true); 
        });
      } else if (elem.webkitRequestFullscreen) { 
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { 
        elem.msRequestFullscreen();
      } else {
        setIsFullScreen(true); 
      }
    } else {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
          console.warn('Error attempting to exit full-screen mode:', err.message);
          setIsFullScreen(false);
        });
      } else if (document.webkitExitFullscreen && document.webkitFullscreenElement) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen && document.msFullscreenElement) {
        document.msExitFullscreen();
      } else {
        setIsFullScreen(false);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!media) {
    return null;
  }

  const title = media.title || media.name;
  const date = media.release_date || media.first_air_date;
  const releaseYear = date?.split("-")[0];

  return (
    <div className="watch-movie">
      <div className="watch-movie-header">
        <Link to={`/${isTv ? 'tv' : 'movie'}/${id}`} className="back-button">
          &larr; Back to details
        </Link>
        <h1>Watch "{title}" {isTv && `- Season ${currentSeason} Ep ${currentEpisode}`}</h1>
      </div>

      <div className="movie-info-section">
        <img
          src={`https://image.tmdb.org/t/p/w300${media.poster_path}`}
          alt={title}
          className="movie-poster"
        />
        <div className="movie-details">
          <h2>{title}</h2>
          <p className="movie-overview">{media.overview}</p>
          <div className="movie-meta">
            <span>📅 {releaseYear}</span>
            <span>⭐ {media.vote_average?.toFixed(1)}/10</span>
          </div>
        </div>
      </div>

      {/* Embedded Player */}
      <div className="full-movie-section" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h3 style={{ margin: 0 }}>Now Playing</h3>
            
            <div className="server-selector" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#222', padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid #444' }}>
              <span style={{ fontSize: '0.9rem', color: '#ccc' }}>Server:</span>
              <select 
                value={serverIndex} 
                onChange={(e) => setServerIndex(Number(e.target.value))}
                style={{ background: 'transparent', color: 'white', border: 'none', outline: 'none', cursor: 'pointer', fontSize: '0.95rem' }}
              >
                {servers.map((server, idx) => (
                  <option key={idx} value={idx} style={{ background: '#333' }}>
                    {server.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={() => setShowDownloadModal(true)}
              style={{
                padding: '0.5rem 1.5rem', 
                background: '#4CAF50', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => e.target.style.background = '#45a049'}
              onMouseOut={(e) => e.target.style.background = '#4CAF50'}
            >
              📥 Download
            </button>

            <button 
               onClick={toggleFullScreen}
               style={{ 
                 padding: '0.5rem 1.5rem', 
                 background: '#e50914', 
                 color: 'white', 
                 border: 'none', 
                 borderRadius: '6px', 
                 cursor: 'pointer',
                 fontWeight: 'bold',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '0.5rem',
                 transition: 'background 0.2s',
               }}
               onMouseOver={(e) => e.target.style.background = '#f40612'}
               onMouseOut={(e) => e.target.style.background = '#e50914'}
            >
               {isFullScreen ? '↙️ Collapse' : '↗️ Expand to Full Screen'}
            </button>
          </div>
        </div>

        <div 
          ref={playerRef}
          className="player-container" 
          style={isFullScreen ? {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            backgroundColor: '#000'
          } : { 
            position: 'relative', 
            paddingBottom: '56.25%', 
            height: 0, 
            overflow: 'hidden', 
            borderRadius: '12px', 
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            backgroundColor: '#000'
          }}
        >
          {isFullScreen && (
            <button
               onClick={toggleFullScreen}
               style={{
                 position: 'absolute',
                 top: '20px',
                 right: '20px',
                 zIndex: 10000,
                 background: 'rgba(0,0,0,0.7)',
                 color: 'white',
                 border: '1px solid rgba(255,255,255,0.2)',
                 borderRadius: '4px',
                 padding: '8px 16px',
                 cursor: 'pointer',
                 fontWeight: 'bold'
               }}
               onMouseOver={(e) => e.target.style.background = 'rgba(255,0,0,0.8)'}
               onMouseOut={(e) => e.target.style.background = 'rgba(0,0,0,0.7)'}
            >
              Exit Full Screen
            </button>
          )}
          <iframe
            src={servers[serverIndex].getUrl(isTv, id, currentSeason, currentEpisode)}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            title={title}
          />
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#999', textAlign: 'center' }}>
          If the video doesn't play or shows an error, try switching the Server above.
        </p>
      </div>

      <div className="disclaimer" style={{ marginTop: '2rem' }}>
        <p>
          <strong>Note:</strong> Media is streamed from external third-party sources. 
          Some content may include advertisements. For ad-free viewing, consider official streaming platforms.
        </p>
        <p>
          <strong>Legal Notice:</strong> Only watch content that is legally available in your region.
          Respect copyright laws and support official releases.
        </p>
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="download-modal-overlay" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000
        }}>
          <div className="download-modal" style={{
            background: '#1a1a1a',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            border: '1px solid #333'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Download "{title}"</h2>
            <p style={{ color: '#aaa', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Direct video file downloads are not natively supported by the free web streaming servers we use. 
              However, you can search for external downloads to watch offline:
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {!isTv ? (
                <>
                  <a 
                    href={`https://yts.mx/browse-movies/${encodeURIComponent(title)}/all/all/0/latest/0/all`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ background: '#222', padding: '1rem', borderRadius: '8px', textDecoration: 'none', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #444', transition: 'border-color 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = '#4CAF50'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = '#444'}
                  >
                    <span>Search on YTS (High Quality)</span>
                    <span>↗️</span>
                  </a>
                  <a 
                    href={`https://1337x.to/search/${encodeURIComponent(title + " " + releaseYear)}/1/`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ background: '#222', padding: '1rem', borderRadius: '8px', textDecoration: 'none', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #444', transition: 'border-color 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = '#4CAF50'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = '#444'}
                  >
                    <span>Search on 1337x (Torrents)</span>
                    <span>↗️</span>
                  </a>
                </>
              ) : (
                <>
                  <a 
                    href={`https://eztv.re/search/${encodeURIComponent(title)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ background: '#222', padding: '1rem', borderRadius: '8px', textDecoration: 'none', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #444', transition: 'border-color 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = '#4CAF50'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = '#444'}
                  >
                    <span>Search on EZTV (TV Shows)</span>
                    <span>↗️</span>
                  </a>
                  <a 
                    href={`https://1337x.to/search/${encodeURIComponent(title + " s" + String(currentSeason).padStart(2, '0') + "e" + String(currentEpisode).padStart(2, '0'))}/1/`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ background: '#222', padding: '1rem', borderRadius: '8px', textDecoration: 'none', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #444', transition: 'border-color 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = '#4CAF50'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = '#444'}
                  >
                    <span>Search Episode on 1337x</span>
                    <span>↗️</span>
                  </a>
                </>
              )}
            </div>
            
            <button 
              onClick={() => setShowDownloadModal(false)}
              style={{
                marginTop: '2rem',
                width: '100%',
                padding: '0.8rem',
                background: '#444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#555'}
              onMouseOut={(e) => e.target.style.background = '#444'}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WatchMovie;