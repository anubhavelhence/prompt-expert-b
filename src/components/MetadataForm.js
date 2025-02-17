import React from 'react';
import './../css/metadataForm.css';

const MetadataForm = ({ value, onChange }) => {
  const formData = JSON.parse(value || '{}');

  const handleChange = (field, newValue) => {
    const updatedData = {
      ...formData,
      [field]: newValue
    };
    onChange(JSON.stringify(updatedData));
  };

  return (
    <div className="metadata-form">
      <div className="form-section">
        <h3>Step 1: Question Quality Assessment</h3>
        <div className="form-group">
          <label>Domain:</label>
          <input
            type="text"
            value={formData.correctDomain || ''}
            onChange={(e) => handleChange('correctDomain', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Subdomain:</label>
          <input
            type="text"
            value={formData.correctSubdomain || ''}
            onChange={(e) => handleChange('correctSubdomain', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Difficulty Score:</label>
          <input
            type="text"
            value={formData.correctDifficultyScore || ''}
            onChange={(e) => handleChange('correctDifficultyScore', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Quality of Question:</label>
          <textarea
            value={formData.questionQuality || ''}
            onChange={(e) => handleChange('questionQuality', e.target.value)}
            rows={4}
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Step 2 and 3: Grading the Solutions</h3>
        <p className="grading-scale">Grading Scale: Each answer is graded from 0 (poor understanding) to 1.00 (perfect understanding)</p>
        
        <div className="grading-group">
          <label>Correct Answer Grade:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={formData.human_grade_reference || 0}
            onChange={(e) => handleChange('human_grade_reference', parseFloat(e.target.value))}
          />
          <span className="grade-value">{formData.human_grade_reference || 0}</span>
          <textarea
            placeholder="Rationale for grading"
            value={formData.referenceRationale || ''}
            onChange={(e) => handleChange('referenceRationale', e.target.value)}
            rows={3}
          />
        </div>

        <div className="grading-group">
          <label>Incorrect Answer 1 Grade:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={formData.human_grade_candidate_incorrect_answer_1 || 0}
            onChange={(e) => handleChange('human_grade_candidate_incorrect_answer_1', parseFloat(e.target.value))}
          />
          <span className="grade-value">{formData.human_grade_candidate_incorrect_answer_1 || 0}</span>
          <textarea
            placeholder="Rationale for grading"
            value={formData.incorrect1Rationale || ''}
            onChange={(e) => handleChange('incorrect1Rationale', e.target.value)}
            rows={3}
          />
        </div>

        <div className="grading-group">
          <label>Incorrect Answer 2 Grade:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={formData.human_grade_candidate_incorrect_answer_2 || 0}
            onChange={(e) => handleChange('human_grade_candidate_incorrect_answer_2', parseFloat(e.target.value))}
          />
          <span className="grade-value">{formData.human_grade_candidate_incorrect_answer_2 || 0}</span>
          <textarea
            placeholder="Rationale for grading"
            value={formData.incorrect2Rationale || ''}
            onChange={(e) => handleChange('incorrect2Rationale', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default MetadataForm;
