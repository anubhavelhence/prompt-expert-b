import React from "react";
import "./../css/rowRenderer.css";

const RowRenderer = ({ keyLabel, value, onGenerate, toUpload }) => {
  // Function to safely render HTML content
  const createMarkup = (content) => {
    if (typeof content !== 'string') return { __html: '' };
    
    // Escape all < and > characters except for <n> tags
    const escapedContent = content
      .replace(/</g, '&lt;')  // First escape all < characters
      .replace(/>/g, '&gt;')  // Then escape all > characters
      .replace(/&lt;n&gt;/g, '<n>');  // Restore <n> tags
    
    // Now replace <n> with line breaks
    const processedContent = escapedContent.replace(/<n>/g, '<br/>');
    
    return { __html: processedContent };
  };

  return (
    <div className="row-renderer">
      <div className="key">
        {keyLabel}
        {onGenerate && (
          <button className="generate-button" onClick={onGenerate}>
            Generate
          </button>
        )}
        {toUpload && (
        <input
          type="file"
          accept=".docx"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              toUpload(file);
            }
          }}
        />
      )}
      </div>
      <div className="value">
        {keyLabel === "Prompt" ? (
          <div dangerouslySetInnerHTML={createMarkup(value)} />
        ) : (
          value
        )}
      </div>
    </div>
  );
};

export default RowRenderer;
