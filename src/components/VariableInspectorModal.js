import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Document, Paragraph, Packer } from 'docx';

const VariableInspectorModal = ({ isOpen, onClose, variables, onUpdate }) => {
  const [expandedVariable, setExpandedVariable] = useState(null);
  const [filePrefix, setFilePrefix] = useState('');

  const createWordDoc = (content) => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: content.split('\n').map(line => 
          new Paragraph({
            text: line,
            spacing: {
              line: 360, // 1.5 line spacing
            }
          })
        )
      }]
    });
    return doc;
  };

  const downloadAsZip = async () => {
    const zip = new JSZip();
    
    for (const [name, content] of Object.entries(variables)) {
      try {
        const doc = createWordDoc(content || '');
        const blob = await Packer.toBlob(doc);
        const arrayBuffer = await blob.arrayBuffer();
        const fileName = filePrefix ? `${filePrefix}_${name}.docx` : `${name}.docx`;
        zip.file(fileName, arrayBuffer);
      } catch (error) {
        console.error(`Error creating document for ${name}:`, error);
      }
    }

    try {
      // Generate and save the zip file
      const blob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9
        }
      });
      saveAs(blob, 'variables.zip');
    } catch (error) {
      console.error('Error generating zip:', error);
    }
  };

  const downloadSingleDoc = async (name, content) => {
    try {
      const doc = createWordDoc(content || '');
      const blob = await Packer.toBlob(doc);
      const fileName = filePrefix ? `${filePrefix}_${name}.docx` : `${name}.docx`;
      saveAs(blob, fileName);
    } catch (error) {
      console.error(`Error downloading ${name}:`, error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="variable-inspector-modal">
        <div className="modal-header">
          <h2>Variable Inspector</h2>
          <div className="header-controls">
            <input
              type="text"
              value={filePrefix}
              onChange={(e) => setFilePrefix(e.target.value)}
              placeholder="File name prefix"
              className="prefix-input"
            />
            <button className="download-button" onClick={downloadAsZip}>
              Download All as ZIP
            </button>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
        </div>
        <div className="variables-list">
          {Object.entries(variables).map(([name, content]) => (
            <div key={name} className="variable-item">
              <div 
                className="variable-header"
                onClick={() => setExpandedVariable(expandedVariable === name ? null : name)}
              >
                <span className="variable-name">{name}</span>
                <div className="variable-actions">
                  <button 
                    className="download-single"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadSingleDoc(name, content);
                    }}
                  >
                    Download
                  </button>
                  <span className="expand-icon">{expandedVariable === name ? '−' : '+'}</span>
                </div>
              </div>
              {expandedVariable === name && (
                <textarea
                  className="variable-content"
                  value={content || ''}
                  onChange={(e) => onUpdate(name, e.target.value)}
                  spellCheck={false}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default VariableInspectorModal;