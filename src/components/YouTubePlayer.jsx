import React, { useEffect, useRef } from "react";

const YouTubePlayer = ({ videoId, onReady, onStateChange }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    const createPlayer = () => {
      playerRef.current = new window.YT.Player("yt-player", {
        videoId,
        height: "360",
        width: "100%",
        playerVars: {
          autoplay: 0,
          mute: 1, // ✅ Mute video by default
        },
        events: {
          onReady: (event) => {
            event.target.pauseVideo(); // Ensure paused on load
            if (onReady) onReady(event.target); // Expose the player instance
          },
          onStateChange: (event) => {
            if (onStateChange) onStateChange(event);
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }

    return () => {
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, onReady, onStateChange]);

  return <div id="yt-player" style={{ width: '100%', height: '360px' }} />;
};

export default YouTubePlayer;