// src/components/User/ThankYouPage.js (REPLACE THE ENTIRE RETURN STATEMENT BLOCK)

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ThankYouPage.css';

export default function ThankYouPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown === 0) {
      const redirectTimer = setTimeout(() => {
        navigate('/');
      }, 1000); 
      return () => clearTimeout(redirectTimer);
    }

    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <div className="thank-you-container">
      {/* Content wrapper handles the Title and Icon centering only */}
      <div className="thank-you-content-wrapper">
          <div className="thank-you-content">
            
            <h2>Thanks For Ordering</h2>
            
            <div className="check-circle">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </div>
      </div>
      
      {/* FIX: Redirect message is now a separate element, ready to be positioned at the bottom */}
      <p className="redirect-message">
        Redirecting in {countdown}...
      </p>
    </div>
  );
}