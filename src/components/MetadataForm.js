import React from 'react';
import '../css/metadataForm.css';

const MetadataForm = ({ value, onChange }) => {
  // Try to parse JSON if value exists and is valid JSON, otherwise use default state
  const getInitialState = () => {
    if (!value) return {
      correctDomain: '',
      correctSubdomain: '',
      correctDifficultyScore: ''
    };

    try {
      return JSON.parse(value);
    } catch (e) {
      return {
        correctDomain: '',
        correctSubdomain: '',
        correctDifficultyScore: ''
      };
    }
  };

  const formData = getInitialState();

  const handleChange = (field, newValue) => {
    const updatedFormData = {
      ...formData,
      [field]: newValue
    };
    onChange(JSON.stringify(updatedFormData));
  };

  return (
    <div className="metadata-form">
      <h3>Metadata Quality Check</h3>
      
      <div className="form-group">
        <label>Correct Domain?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="correctDomain"
              value="yes"
              checked={formData.correctDomain === 'yes'}
              onChange={(e) => handleChange('correctDomain', e.target.value)}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="correctDomain"
              value="no"
              checked={formData.correctDomain === 'no'}
              onChange={(e) => handleChange('correctDomain', e.target.value)}
            />
            No
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Correct Subdomain?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="correctSubdomain"
              value="yes"
              checked={formData.correctSubdomain === 'yes'}
              onChange={(e) => handleChange('correctSubdomain', e.target.value)}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="correctSubdomain"
              value="no"
              checked={formData.correctSubdomain === 'no'}
              onChange={(e) => handleChange('correctSubdomain', e.target.value)}
            />
            No
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Correct Difficulty Score?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="correctDifficultyScore"
              value="yes"
              checked={formData.correctDifficultyScore === 'yes'}
              onChange={(e) => handleChange('correctDifficultyScore', e.target.value)}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="correctDifficultyScore"
              value="no"
              checked={formData.correctDifficultyScore === 'no'}
              onChange={(e) => handleChange('correctDifficultyScore', e.target.value)}
            />
            No
          </label>
        </div>
      </div>
    </div>
  );
};

export default MetadataForm;
