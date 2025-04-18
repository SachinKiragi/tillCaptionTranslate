import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import YouTubePlayer from '../components/YouTubePlayer';
import axios from 'axios';
import Gemini from '../components/Gemini';

const languageOptions = [
  { value: 'as', label: 'Assamese' },
  { value: 'bn', label: 'Bengali' },
  { value: 'bho', label: 'Bhojpuri' },
  { value: 'doi', label: 'Dogri' },
  { value: 'gu', label: 'Gujarati' },
  { value: 'hi', label: 'Hindi' },
  { value: 'kn', label: 'Kannada' },
  { value: 'gom', label: 'Konkani' },
  { value: 'mai', label: 'Maithili' },
  { value: 'ml', label: 'Malayalam' },
  { value: 'mni-mtei', label: 'Manipuri' },
  { value: 'mr', label: 'Marathi' },
  { value: 'lus', label: 'Mizo' },
  { value: 'ne', label: 'Nepali' },
  { value: 'or', label: 'Odia' },
  { value: 'pa', label: 'Punjabi' },
  { value: 'sa', label: 'Sanskrit' },
  { value: 'sd', label: 'Sindhi' },
  { value: 'ta', label: 'Tamil' },
  { value: 'te', label: 'Telugu' },
  { value: 'ur', label: 'Urdu' }
];










// Add this above the component if you're not using a CSS file
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f4f4f4',
    fontFamily: 'sans-serif',
  },
  videoSection: {
    flex: 2,
    padding: '20px',
    overflowY: 'auto',
    borderRight: '1px solid #ccc',
    backgroundColor: '#ffffff',
  },
  geminiSection: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    backgroundColor: '#f9f9f9',
  },
  selectWrapper: {
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #aaa',
    fontSize: '16px',
    backgroundColor: '#fff',
  },
  translatedSection: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f0f0ff',
    borderRadius: '10px',
    border: '1px solid #ddd',
    maxHeight: '300px',
    overflowY: 'auto',
  },
};




const Video = ({ videoId }) => {
  const { vpid } = useParams();
  const [captions, setCaptions] = useState('');
  const [translated, setTranslated] = useState('');
  const [selectedLang, setSelectedLang] = useState('mr');



  const downloadSpeech = (base64) => {

    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'audio/mp3' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'speech.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }



  useEffect(() => {
    async function fetchCaptions() {
      const options = {
        method: 'GET',
        url: 'https://youtubetextconverter.p.rapidapi.com/YouTubeCaptions.asp',
        params: { vapi: vpid },
        headers: {
          'x-rapidapi-key': '5fbed5117dmsh8c9a4b95711434cp132a06jsnc1fa0463075b',
          'x-rapidapi-host': 'youtubetextconverter.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        const fullCaptions = response.data;
        console.log(fullCaptions);
        setCaptions(fullCaptions);
        translateCaptions(fullCaptions, selectedLang);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCaptions();
  }, [vpid, selectedLang]);

  useEffect(()=>{
    console.log("viid: ", vpid);
    
  }, [])


  const getBase64 = (text) => {
    console.log("TEXT: ", text);
    text = text.replace(/\s+/g, ' ').trim();
    console.log("text now: ", text);
    
    
    const options = {
    method: 'POST',
    url: 'https://joj-text-to-speech.p.rapidapi.com/',
    headers: {
        'x-rapidapi-key': 'c4c52fa9a6mshc8284b0c02cb012p1a9327jsn7921bed6933f',
        'x-rapidapi-host': 'joj-text-to-speech.p.rapidapi.com',
        'Content-Type': 'application/json'
    },
    data: {
        input: {
        text: text.slice(0, 1000) // limit due to API size restrictions
        },
        voice: {
        languageCode: 'kn-IN',
        name: 'kn-IN-Standard-C',
        ssmlGender: 'FEMALE'
        },
        audioConfig: {
        audioEncoding: 'MP3'
        }
    }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            console.log(response.data);
            console.log("base64: ", response.data);
            
            downloadSpeech(response.data.audioContent);
        } catch (error) {
            console.error(error);
        }
    }

    fetchData();
  }



  const translateCaptions = async (text, lang) => {
    const translateOptions = {
      method: 'POST',
      url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/text',
      headers: {
        'x-rapidapi-key': '5fbed5117dmsh8c9a4b95711434cp132a06jsnc1fa0463075b',
        'x-rapidapi-host': 'google-translate113.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        from: 'en',
        to: lang,
        text: text.slice(0, 4000) // limit due to API size restrictions
      }
    };

    try {
      const response = await axios.request(translateOptions);
      console.log("respnse.data: ", response.data.trans);
      setTranslated(response.data.trans);
    //   getBase64(response.data.trans);
    } catch (error) {
      console.error('Translation Error:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.videoSection}>
        <YouTubePlayer key={vpid} videoId={vpid} />
  
        <div style={styles.selectWrapper}>
          <label htmlFor="lang-select">Select your language:</label>
          <select
            id="lang-select"
            value={selectedLang}
            onChange={(e) => {
              setSelectedLang(e.target.value);
              setTranslated('');
            }}
            style={styles.select}
          >
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
  
        <div style={styles.translatedSection}>
          <h3>Translated Captions ({selectedLang}):</h3>
          <p>{translated || 'Loading...'}</p>
        </div>
      </div>
  
      <div style={styles.geminiSection}>
        {translated && <Gemini videoData={translated} />}
      </div>
    </div>
  );
  
};

export default Video;
