import React, { useEffect, useState, useParams } from 'react'
import axios from 'axios';
import { data, Link } from 'react-router-dom';
import YouTubePlayer from '../components/YouTubePlayer';
import { fetchFromAPI } from '../utils/fetchFromAPI';

const searchFeed = () => {


  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [tempSearch, setTempSearch] = useState("");

  useEffect(() => {
    if(searchTerm){
      fetchFromAPI(`search?part=snippet&q=${searchTerm}`).then((data) => {
        setVideos(data.items);
      });
    }
  }, [searchTerm]);

  useEffect(()=>{
    console.log("videos: ", videos);
    
  }, [videos])

  return (
    <div>
    {/* Search input */}
    <div>
      <input
        type="text"
        placeholder="Search videos"
        onChange={(e) => setTempSearch(e.target.value)}
      />
      <button
        onClick={() => {
          console.log("tempSearch", tempSearch);
          setSearchTerm(tempSearch);
        }}
      >
        Submit
      </button>
    </div>

    {/* Videos */}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
      {videos.map((video) => (
        video.id?.videoId &&  (
          <> 
              <YouTubePlayer key={video.id.videoId} videoId={video.id.videoId} />
            <Link to={`/video/${video.id.videoId}`}>
              Open 
            </Link>
          </>
        )
      ))}
    </div>
  </div>

  )
} 

export default searchFeed