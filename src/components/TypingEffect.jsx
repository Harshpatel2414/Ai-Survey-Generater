"use client"
import React, { useEffect, useState } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';

const TypingEffect = ({ content }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  
  useEffect(() => {
    if (content === "") {
      setDisplayedContent(""); 
      return;
    }
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < content.length) {
        setDisplayedContent(content.substring(0, currentIndex + 1));
        currentIndex += 1;
      } else {
        clearInterval(interval); 
      }
    }, 0); 

    return () => clearInterval(interval); 
  }, [content]);

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedContent}</ReactMarkdown>;
};

export default TypingEffect;


