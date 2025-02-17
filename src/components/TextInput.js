import React, { useState, useEffect, useRef } from "react";
import "./../css/textInput.css";

const TextInput = ({ label, value, onChange }) => {
  const [inputValue, setInputValue] = useState(value);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Automatically adjust the height of the textarea based on the content
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to scrollHeight
    }
  }, [inputValue]); // Runs whenever the input value changes

  const handleChange = (e) => {
    setInputValue(e.target.value);
    onChange(e);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    
    // Get clipboard data
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('text/html') || clipboardData.getData('text/plain');
    
    // Process the pasted text
    let processedText;
    
    if (clipboardData.getData('text/html')) {
      // Create a temporary div to parse HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = pastedData;
      
      // Convert bullet points and lists
      const listItems = tempDiv.querySelectorAll('li');
      listItems.forEach(li => {
        const parent = li.parentElement;
        if (parent.tagName === 'UL') {
          const depth = getElementDepth(li);
          const indent = '  '.repeat(depth);
          li.textContent = `\n${indent}• ${li.textContent.trim()}\n`;
        } else if (parent.tagName === 'OL') {
          const depth = getElementDepth(li);
          const indent = '  '.repeat(depth);
          const index = Array.from(parent.children).indexOf(li) + 1;
          li.textContent = `\n${indent}${index}. ${li.textContent.trim()}\n`;
        }
      });

      // Handle paragraphs and line breaks
      const paragraphs = tempDiv.querySelectorAll('p, div');
      paragraphs.forEach(p => {
        if (p.textContent.trim()) {
          p.textContent = `${p.textContent.trim()}\n\n`;
        }
      });

      // Handle line breaks
      const lineBreaks = tempDiv.querySelectorAll('br');
      lineBreaks.forEach(br => {
        br.replaceWith('\n');
      });
      
      // Get the processed text and handle XML tags
      processedText = tempDiv.innerText
        .split('\n')
        .map(line => line.replace(/\s+$/, '')) // Only trim right side
        .join('\n')
        .replace(/\n{3,}/g, '\n\n') // Replace multiple line breaks with double line break
        .replace(/(<[^>]+>)/g, '\n$1\n') // Add line breaks around XML tags
        .replace(/\n{3,}/g, '\n\n'); // Clean up any excessive line breaks
    } else {
      // Fallback to plain text with preserved line breaks
      processedText = pastedData
        .split('\n')
        .map(line => line.replace(/\s+$/, '')) // Only trim right side
        .join('\n')
        .replace(/\n{3,}/g, '\n\n') // Replace multiple line breaks with double line break
        .replace(/(<[^>]+>)/g, '\n$1\n') // Add line breaks around XML tags
        .replace(/\n{3,}/g, '\n\n'); // Clean up any excessive line breaks
    }
    
    // Insert the processed text at cursor position
    const startPos = textareaRef.current.selectionStart;
    const endPos = textareaRef.current.selectionEnd;
    const currentValue = textareaRef.current.value;
    
    const newValue = 
      currentValue.substring(0, startPos) + 
      processedText + 
      currentValue.substring(endPos);
    
    // Update the state and trigger onChange
    setInputValue(newValue);
    onChange({ target: { value: newValue } });
  };

  // Helper function to get element nesting depth
  const getElementDepth = (element) => {
    let depth = 0;
    let parent = element.parentElement;
    while (parent && parent.tagName !== 'DIV' && depth < 10) {
      if (parent.tagName === 'UL' || parent.tagName === 'OL' || parent.tagName === 'LI') {
        depth++;
      }
      parent = parent.parentElement;
    }
    return depth;
  };

  return (
    <div className="text-input-container">
      <label className="input-label">{label}</label>
      <textarea
        ref={textareaRef}
        className="text-input"
        value={inputValue}
        onChange={handleChange}
        onPaste={handlePaste}
        placeholder="Type or paste content here..."
        style={{
          width: '100%',
          minHeight: '100px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          fontFamily: 'monospace',
          padding: '8px',
          lineHeight: '1.5',
          tabSize: 2
        }}
      />
    </div>
  );
};

export default TextInput;
