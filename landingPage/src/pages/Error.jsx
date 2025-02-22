import React from 'react';
import { useNavigate } from 'react-router-dom';

function Error() {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Sorry, the page you are looking for doesn't exist.</p>
      <button onClick={() => navigate('/')} className="home-button">
        Return Home
      </button>
      <style jsx>{`
        .error-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        h1 {
          font-size: 6rem;
          margin: 0;
          color: #ff4444;
        }
        h2 {
          font-size: 2rem;
          margin: 1rem 0;
        }
        .home-button {
          margin-top: 2rem;
          padding: 0.8rem 1.5rem;
          font-size: 1.1rem;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .home-button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}

export default Error;

