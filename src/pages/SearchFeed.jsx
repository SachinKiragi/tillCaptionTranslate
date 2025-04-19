import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchFromAPI } from '../utils/fetchFromAPI';
import YouTubePlayerAll from '../components/YouTubePlayerAll';

const SearchFeed = () => {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('Rural woman Empowerment');
  const [tempSearch, setTempSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // To show "No results found" only after a search

  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      setSearched(true);
      fetchFromAPI(`${searchTerm}`)
        .then((data) => {
          console.log("data: ", data);
          
          setVideos(data || []);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setVideos([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [searchTerm]);

  return (
    <div style={styles.container}>
      {/* Search input */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search videos..."
          value={tempSearch}
          onChange={(e) => setTempSearch(e.target.value)}
          style={styles.input}
        />
        <button
          onClick={() => setSearchTerm(tempSearch)}
          style={styles.button}
        >
          🔍 Search
        </button>
      </div>

      {/* Loader */}
      {loading && <p style={styles.message}>Loading videos...</p>}

      {/* No Results Message */}
      {!loading && searched && videos.length === 0 && (
        <p style={styles.message}>No videos found. Try a different keyword.</p>
      )}

      {/* Videos */}
      <div style={styles.videosGrid}>
        {videos.map((item) =>
          (
            <div key={item?.video?.videoId} style={styles.videoCard}>
              {/* <h3>{item?.video?.videoId}</h3> */}
              <YouTubePlayerAll videoId={item?.video?.videoId} />
              <Link to={`/video/${item?.video?.videoId}`} style={styles.link}>
                ▶ Open
              </Link>
            </div>
          ) 
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  input: {
    padding: '0.6rem 1rem',
    width: '300px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s ease',
  },
  message: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#555',
    marginBottom: '2rem',
  },
  videosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
  },
  videoCard: {
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  link: {
    display: 'inline-block',
    marginTop: '0.5rem',
    color: '#1976d2',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default SearchFeed;
