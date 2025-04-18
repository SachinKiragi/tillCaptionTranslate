import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import YouTubePlayer from '../components/YouTubePlayer ';
import axios from 'axios';

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

const Video = ({ videoId }) => {
  const { vpid } = useParams();
  const [captions, setCaptions] = useState('');
  const [translated, setTranslated] = useState('');
  const [selectedLang, setSelectedLang] = useState('hi');

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
      setTranslated(response.data.trans);
    } catch (error) {
      console.error('Translation Error:', error);
    }
  };

  return (
    <div>
      <YouTubePlayer key={vpid} videoId={vpid} />

      <div style={{ marginTop: '20px' }}>
        <label>Select your language: </label>
        <select value={selectedLang} onChange={e => setSelectedLang(e.target.value)}>
          {languageOptions.map(lang => (
            <option key={lang.value} value={lang.value}>{lang.label}</option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Translated Captions ({selectedLang}):</h3>
        <p>{translated || 'Loading...'}</p>
      </div>
    </div>
  );
};

export default Video;
