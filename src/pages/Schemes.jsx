import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Schemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [translatedSchemes, setTranslatedSchemes] = useState([]);

  // Translation function
  const translateText = async (text, lang) => {
    const response = await axios.post(
      "https://google-translate113.p.rapidapi.com/api/v1/translator/text",
      {
        from: "auto", // Automatically detect the source language
        to: lang,     // Target language
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
    return response.data.trans;
  };

  // Fetch schemes
  useEffect(() => {
    const fetchSchemes = async () => {
      const resp = await axios.get('http://localhost:5000/getSchemes');
      setSchemes(resp.data);
    };
    fetchSchemes();
  }, []);

  // Handle language change for individual scheme
  const handleLanguageChange = async (index, lang) => {
    const scheme = schemes[index];
    const translatedName = await translateText(scheme.name, lang);
    const translatedDescription = await translateText(scheme.description, lang);

    // Update the translated scheme
    const updatedSchemes = [...schemes];
    updatedSchemes[index] = {
      ...scheme,
      name: translatedName,
      description: translatedDescription,
    };

    setSchemes(updatedSchemes);
  };

  return (
    <div style={{ padding: '40px', background: 'linear-gradient(to bottom, #fdfbfb, #ebedee)', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      <style>{`
        .title {
          text-align: center;
          color: #2d3436;
          font-size: 2.5rem;
          margin-bottom: 40px;
          position: relative;
        }

        .title::after {
          content: '';
          display: block;
          width: 60px;
          height: 4px;
          background-color: #0984e3;
          margin: 10px auto 0;
          border-radius: 2px;
        }

        .schemes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .scheme-card {
          background: white;
          border-radius: 15px;
          padding: 24px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .scheme-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .scheme-name {
          font-size: 20px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 12px;
        }

        .scheme-description {
          font-size: 15px;
          color: #555;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .scheme-link {
          text-decoration: none;
          background-color: #00a8ff;
          color: white;
          padding: 10px 14px;
          border-radius: 6px;
          align-self: flex-start;
          font-weight: bold;
          transition: background-color 0.3s ease, transform 0.3s ease;
        }

        .scheme-link:hover {
          background-color: #007bb5;
          transform: scale(1.05);
        }

        @media (max-width: 600px) {
          .title {
            font-size: 1.8rem;
          }
        }
      `}</style>

      <h1 className="title">Government Schemes for Women</h1>

      <div className="schemes-grid">
        {schemes.map((scheme, index) => (
          scheme.name && scheme.description && scheme.link ? (
            <div key={index} className="scheme-card">
              <h3 className="scheme-name">{scheme.name}</h3>
              <p className="scheme-description">{scheme.description}</p>

              {/* Language Selector for individual scheme */}
              <select 
                onChange={(e) => handleLanguageChange(index, e.target.value)} 
                style={{ padding: '8px', fontSize: '16px', marginBottom: '10px' }}
              >
                <option value="en">English</option>
                <option value="kn">Kannada</option>
                <option value="mr">Marathi</option>
                <option value="ml">Malayalam</option>
              </select>

              <a
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="scheme-link"
              >
                View Scheme
              </a>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
};

export default Schemes;
