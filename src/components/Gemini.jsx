import React, { useEffect, useState } from 'react';

const Gemini = ({ videoData }) => {
  const [qaData, setQaData] = useState('');
  const [loading, setLoading] = useState(true);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

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

        const prompt = `${videoData} — This is the caption of a YouTube video I am currently watching. Based only on the above content, generate multiple-choice questions with 4 options each (A, B, C, D). Each question should be followed by the 4 options and then clearly indicate the correct option. 

Format each set like this:
Q: <question>
A. <option 1>
B. <option 2>
C. <option 3>
D. <option 4>
Answer: <correct option letter>

Make sure the language, tone, and style match the original content exactly.`;

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

  const parseQA = (text) => {
    if (!text || typeof text !== 'string') return [];

    const qaBlocks = text.split(/(?:^|\n)Q[:：]/).filter(Boolean);

    return qaBlocks.map(block => {
      const lines = block.trim().split('\n').filter(Boolean);
      const question = lines[0]?.trim();

      const options = {};
      lines.slice(1, 5).forEach(line => {
        const match = line.match(/^([A-D])[.．]\s*(.*)/);
        if (match) {
          options[match[1]] = match[2].trim();
        }
      });

      const answerLine = lines.find(line => line.startsWith('Answer:'));
      const correctKey = answerLine?.match(/Answer:\s*([A-D])/i)?.[1];
      const correctAnswer = options[correctKey];

      return {
        question,
        options: Object.values(options),
        answer: correctAnswer,
      };
    }).filter(qa => qa.question && qa.answer && qa.options?.length === 4);
  };

  const qaList = parseQA(qaData);

  const handleAnswer = (selected) => {
    const current = qaList[currentQuestion];
    const isCorrect = selected === current.answer;
    setUserAnswers(prev => [...prev, isCorrect]);
    if (currentQuestion + 1 === qaList.length) {
      setShowResult(true);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowResult(false);
    setQuizMode(false);
  };

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
      }}>
        {quizMode ? 'Quiz Mode' : 'Questions & Answers based on Video Content'}
      </h2>

      {loading ? (
        <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>⏳ Generating questions and answers...</p>
      ) : (
        <>
          {!quizMode ? (
            <>
              <button
                onClick={() => setQuizMode(true)}
                style={{
                  display: 'block',
                  margin: '1rem auto',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                🎯 Take a Quiz
              </button>
              {qaList.map((qa, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <p style={{
                    fontWeight: '600',
                    fontSize: '1.05rem',
                    color: '#1976d2',
                    marginBottom: '0.5rem',
                  }}>
                    Q{index + 1}: {qa.question}
                  </p>
                  <p style={{
                    fontSize: '1rem',
                    color: '#333',
                    lineHeight: '1.6',
                  }}>
                    <strong>Ans:</strong> {qa.answer}
                  </p>
                </div>
              ))}
            </>
          ) : showResult ? (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <h3>🎉 You scored {userAnswers.filter(ans => ans).length} out of {qaList.length}</h3>
              <button onClick={restartQuiz}
                style={{
                  marginTop: '1rem',
                  padding: '0.6rem 1.2rem',
                  fontSize: '1rem',
                  backgroundColor: '#43a047',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                🔄 Restart
              </button>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease-in-out',
            }}>
              <p style={{
                fontWeight: '600',
                fontSize: '1.1rem',
                color: '#1976d2',
                marginBottom: '1rem',
              }}>
                Q{currentQuestion + 1}: {qaList[currentQuestion]?.question}
              </p>
              {qaList[currentQuestion]?.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  style={{
                    display: 'block',
                    marginBottom: '0.8rem',
                    padding: '0.6rem 1rem',
                    width: '100%',
                    textAlign: 'left',
                    fontSize: '1rem',
                    backgroundColor: '#e3f2fd',
                    border: '1px solid #90caf9',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: '#333'
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Gemini;
