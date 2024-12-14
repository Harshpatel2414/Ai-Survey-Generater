'use client'
import React, { useEffect, useState } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';

const TypingEffect = ({ content }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const speed = 20; 
  const stepSize = 50;

  useEffect(() => {
    if (!content) {
      setDisplayedContent('');
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      const isComplete = currentIndex >= content.length;
      if (isComplete) {
        clearInterval(interval);
        return;
      }

      setDisplayedContent((prev) => content.slice(0, currentIndex + stepSize));
      currentIndex += stepSize;
    }, speed);

    return () => clearInterval(interval); // Cleanup
  }, [content]);

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedContent}</ReactMarkdown>;
};

export default TypingEffect;
