import React, { useEffect, useState } from 'react';

const Gemini = ({ videoData }) => {
  const [qaData, setQaData] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQA = async () => {
      setLoading(true);
      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({
          model: 'gemini-2.0-flash-exp',
        });

        const prompt = `${videoData} — This is the caption of a YouTube video I am currently watching. Based only on the above content, generate all possible questions someone might ask **and** provide clear answers to each question. Make sure both the questions and answers are written in the **same language**, **style**, and **tone** as the given content. Do not translate or change the language or style. Format your response clearly with "Q:" and "A:" before each question and answer.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/\*/g, '');
        setQaData(text);
      } catch (error) {
        console.error('Error fetching Q&A:', error);
        setQaData('Failed to load Q&A content.');
      } finally {
        setLoading(false);
      }
    };

    if (videoData) fetchQA();
  }, [videoData]);

  // Convert plain text into a list of Q&A objects
  const parseQA = (text) => {
    const qaPairs = text.split(/(?:^|\n)Q[:：]/).filter(Boolean);
    return qaPairs.map(pair => {
      const [question, ...answerParts] = pair.split(/A[:：]/);
      return {
        question: question.trim(),
        answer: answerParts.join('A:').trim()
      };
    });
  };

  const qaList = parseQA(qaData);

  return (
    <div style={{
      padding: '2rem',
      fontFamily: 'Segoe UI, sans-serif',
      backgroundColor: '#f4f6f8',
      minHeight: '100vh',
    }}>
      <h2 style={{
        marginBottom: '1rem',
        color: '#333',
        textAlign: 'center'
      }}>Questions & Answers based on Video Content</h2>

      {loading ? (
        <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>⏳ Generating questions and answers...</p>
      ) : (
        qaList.map((qa, index) => (
          index > 0 &&
          <div
            key={index}
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <p style={{
              fontWeight: '600',
              fontSize: '1.05rem',
              color: '#1976d2',
              marginBottom: '0.5rem',
            }}>
              Q{index}: {qa.question}
            </p>
            <p style={{
              fontSize: '1rem',
              color: '#333',
              lineHeight: '1.6',
            }}>
              <strong>Ans:</strong> {qa.answer}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Gemini;
