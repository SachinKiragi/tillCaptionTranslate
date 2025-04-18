import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import YouTubePlayer from "../components/YouTubePlayer";
import axios from "axios";
import { supabase } from "../supabaseClient";
import Gemini from "../components/Gemini";

const voiceMap = {
  hi: { languageCode: "hi-IN", name: "hi-IN-Chirp3-HD-Charon" },
  kn: { languageCode: "kn-IN", name: "kn-IN-Chirp3-HD-Charon" },
  mr: { languageCode: "mr-IN", name: "mr-IN-Chirp3-HD-Charon" },
  ml: { languageCode: "ml-IN", name: "ml-IN-Chirp3-HD-Charon" },
};

const languageOptions = [
  { value: "hi", label: "Hindi" },
  { value: "kn", label: "Kannada" },
  { value: "mr", label: "Marathi" },
  { value: "ml", label: "Malayalam " },
];

const Video = () => {
  const { vpid } = useParams();
  const [captions, setCaptions] = useState("");
  const [translated, setTranslated] = useState("");
  const [selectedLang, setSelectedLang] = useState("kn");
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);
  const ytPlayerRef = useRef(null);

  // Sync audio with YouTube state
  const handlePlayerEvents = (event) => {
    const ytState = event.data;
    const audio = audioRef.current;
    if (!audio) return;

    if (ytState === window.YT.PlayerState.PLAYING) {
      audio.play();
    } else if (
      ytState === window.YT.PlayerState.PAUSED ||
      ytState === window.YT.PlayerState.ENDED
    ) {
      audio.pause();
    }
  };

  const uploadToSupabase = async (base64) => {
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array([...byteCharacters].map((c) => c.charCodeAt(0)));
    const blob = new Blob([byteArray], { type: "audio/mp3" });
    const fileName = `speech-${Date.now()}.mp3`;

    const { error } = await supabase.storage
      .from("audio")
      .upload(fileName, blob, {
        contentType: "audio/mp3",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = await supabase.storage
      .from("audio")
      .getPublicUrl(fileName);

    console.log("🎧 Uploaded:", urlData.publicUrl);
    setAudioUrl(urlData.publicUrl);
  };

  const getBase64AndUpload = async (text) => {
    const voice = voiceMap[selectedLang];
    const response = await axios.post(
      "https://joj-text-to-speech.p.rapidapi.com/",
      {
        input: { text: text.slice(0, 1000) },
        voice: { ...voice, ssmlGender: "MALE" },
        audioConfig: { audioEncoding: "MP3" },
      },
      {
        headers: {
          "x-rapidapi-key": import.meta.env.VITE_XRAPID_API_KEY,
          "x-rapidapi-host": "joj-text-to-speech.p.rapidapi.com",
          "Content-Type": "application/json",
        },
      }
    );

    await uploadToSupabase(response.data.audioContent);
  };

  const translateCaptions = async (text, lang) => {
    const response = await axios.post(
      "https://google-translate113.p.rapidapi.com/api/v1/translator/text",
      {
        from: "en",
        to: lang,
        text: text.slice(0, 4000),
      },
      {
        headers: {
          "x-rapidapi-key": import.meta.env.VITE_XRAPID_API_KEY,
          "x-rapidapi-host": "google-translate113.p.rapidapi.com",
          "Content-Type": "application/json",
        },
      }
    );

    const translatedText = response.data.trans;
    setTranslated(translatedText);
    await getBase64AndUpload(translatedText);
  };

  useEffect(() => {
    const fetchCaptions = async () => {
      const response = await axios.get(
        "https://youtubetextconverter.p.rapidapi.com/YouTubeCaptions.asp",
        {
          params: { vapi: vpid },
          headers: {
            "x-rapidapi-key": import.meta.env.VITE_XRAPID_API_KEY,
            "x-rapidapi-host": "youtubetextconverter.p.rapidapi.com",
          },
        }
      );

      setCaptions(response.data);
      translateCaptions(response.data, selectedLang);
    };

    fetchCaptions();
  }, [vpid, selectedLang]);

  return (
    <div
      className="video-container"
      style={{
        // border: "2px solid red",
        display: "flex",
        gap: "1rem",
        height: "100vh",
        padding: "1rem",
      }}
    >
      <div
        className="youtube-video-div"
        style={{ width: "70vw", padding: "1rem", overflowY: "auto" }}
      >
        <YouTubePlayer
          key={vpid}
          videoId={vpid}
          onReady={(player) => (ytPlayerRef.current = player)}
          onStateChange={handlePlayerEvents}
        />
  
        <div style={{ marginTop: "20px" }}>
          <label>Select your language: </label>
          <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)}>
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
  
        <div style={{ marginTop: "20px" }}>
          <h3>Translated Captions ({selectedLang}):</h3>
          <div
            style={{
              maxHeight: "20rem",
              overflowY: "auto",
              // border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <p style={{ whiteSpace: "pre-wrap" }}>{translated || "Loading..."}</p>
          </div>
        </div>

  
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            controls
            style={{ marginTop: "20px" }}
          />
        )}
      </div>
  
      {/* Right Side (Gemini Section) */}
      <div
        style={{
          // border: "2px solid blue",
          width: "30vw",
          padding: "1rem",
          overflowY: "auto",
        }}
      >
        <Gemini videoData={translated} />
      </div>
    </div>
  );
  
};

export default Video;