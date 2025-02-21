import React, { useState, useReducer, useEffect } from "react";
import "./../css/stepper.css";
import RowRenderer from "./RowRenderer";
import TextInput from "./TextInput";
import VariableInspectorModal from "./VariableInspectorModal";
import MetadataForm from './MetadataForm';
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const initialData = {
  "Task 0": {
    heading: "Task 0: Fill these variables with required information from Expert A's folder",
    instruction: "Fill these variables with required information from Expert A's folder",
    expert_a_domain: "",
    expert_a_subdomain: "",
    expert_a_difficulty_score: "",
    expert_a_problem: "",
    expert_a_rubric: "",
    expert_a_incorrect_1: "",
    expert_a_incorrect_2: "",
    expert_a_correct: "",
    expert_a_incorrect_1_rubric_test: "",
    expert_a_incorrect_2_rubric_test: "",
    expert_a_correct_rubric_test: "",
  },
  "Task 1": {
    heading: "Task 1: Review and Grade Solutions",
    instruction: "Based on the information from Task 0, fill out the grading form below",
    form_task_1: JSON.stringify({
      expert_b_domain: '',
      expert_b_subdomain: '',
      expert_b_difficultyscore: '',
      expert_b_questionQuality: '',
      human_grade_reference: 0,
      referenceRationale: '',
      human_grade_candidate_incorrect_answer_1: 0,
      incorrect1Rationale: '',
      human_grade_candidate_incorrect_answer_2: 0,
      incorrect2Rationale: ''
    }),
    task_1_final: "" // This will be auto-populated based on form data
  }
};

// Define step dependencies
const stepDependencies = {
  "prompt 1": {
    variables: ["problem_old", "solution_old"],
    dependsOn: []
  },
  "prompt 2": {
    variables: ["problem_new"],
    dependsOn: ["prompt 1.problem_old", "prompt 1.solution_old"]
  },
  // ... define for other steps
};

// Action types
const ACTIONS = {
  UPDATE_VARIABLE: 'UPDATE_VARIABLE',
  UPDATE_DEPENDENT_PROMPTS: 'UPDATE_DEPENDENT_PROMPTS',
  RESET_STATE: 'RESET_STATE'
};

// Reducer to handle state updates
function stepperReducer(state, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_VARIABLE: {
      const { step, key, value } = action.payload;
      return {
        ...state,
        [step]: {
          ...state[step],
          [key]: value
        }
      };
    }
    case ACTIONS.UPDATE_DEPENDENT_PROMPTS: {
      const { dependencies } = action.payload;
      const updatedState = { ...state };

      // Update all dependent prompts
      dependencies.forEach(depStep => {
        if (state[depStep] && state[depStep].prompt) {
          const promptTemplate = state[depStep].prompt;
          const updatedPrompt = resolvePromptTemplate(promptTemplate, state);
          updatedState[depStep] = {
            ...updatedState[depStep],
            prompt: updatedPrompt
          };
        }
      });

      return updatedState;
    }
    case ACTIONS.RESET_STATE: {
      return initialData;
    }
    default:
      return state;
  }
}

// Custom hook to manage stepper state
function useStepperState(initialState) {
  const loadSavedState = () => {
    try {
      const savedState = localStorage.getItem('stepperState');
      return savedState ? JSON.parse(savedState) : initialState;
    } catch (error) {
      console.error('Error loading saved state:', error);
      return initialState;
    }
  };

  const [state, dispatch] = useReducer(stepperReducer, loadSavedState());
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const savedStep = localStorage.getItem('currentStep');
      return savedStep || Object.keys(initialState)[0]; // Default to first step
    } catch (error) {
      console.error('Error loading current step:', error);
      return Object.keys(initialState)[0];
    }
  });

  // Add state validation
  useEffect(() => {
    if (!state || !currentStep || !state[currentStep]) {
      console.log('Resetting to initial state due to invalid state');
      dispatch({ type: ACTIONS.RESET_STATE });
      setCurrentStep(Object.keys(initialState)[0]);
    }
  }, [state, currentStep]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('stepperState', JSON.stringify(state));
      localStorage.setItem('currentStep', currentStep);
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }, [state, currentStep]);

  const updateVariable = (step, key, value) => {
    if (!state[step]) {
      console.error(`Invalid step: ${step}`);
      return;
    }

    // First update the current step's variable
    dispatch({
      type: ACTIONS.UPDATE_VARIABLE,
      payload: { step, key, value }
    });

    // If updating form_task_1, also update task_1_final
    if (key === 'form_task_1') {
      dispatch({
        type: ACTIONS.UPDATE_VARIABLE,
        payload: {
          step,
          key: 'task_1_final',
          value: formatTaskFinal(value)
        }
      });
    }

    // Handle special case for rubric synchronization
    if (key === 'rubric') {
      if (step === 'prompt 5') {
        dispatch({
          type: ACTIONS.UPDATE_VARIABLE,
          payload: { step: 'prompt5.1', key: 'rubric', value }
        });
      } else if (step === 'prompt5.1') {
        dispatch({
          type: ACTIONS.UPDATE_VARIABLE,
          payload: { step: 'prompt 5', key: 'rubric', value }
        });
      }
    }

    // Handle other dependencies
    const dependentSteps = Object.entries(stepDependencies)
      .filter(([_, deps]) =>
        deps.dependsOn.includes(`${step}.${key}`)
      )
      .map(([stepName]) => stepName);

    if (dependentSteps.length > 0) {
      dispatch({
        type: ACTIONS.UPDATE_DEPENDENT_PROMPTS,
        payload: {
          dependencies: dependentSteps,
          state
        }
      });
    }
  };

  return {
    state,
    currentStep,
    setCurrentStep,
    updateVariable,
    resetState: () => {
      if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
        dispatch({ type: ACTIONS.RESET_STATE });
        setCurrentStep(Object.keys(initialState)[0]);
        localStorage.removeItem('stepperState');
        localStorage.removeItem('currentStep');
      }
    }
  };
}

// Helper function to resolve prompt templates
function resolvePromptTemplate(template, state) {
  if (!template) return '';

  let resolvedPrompt = template;

  Object.entries(state).forEach(([step, stepData]) => {
    if (stepData) {
      Object.entries(stepData).forEach(([key, value]) => {
        if (value !== undefined) {
          const placeholder = `{{${key}}}`;
          if (resolvedPrompt.includes(placeholder)) {
            const valueWithPreservedBreaks = value.toString().replace(/\n/g, '<n>');
            resolvedPrompt = resolvedPrompt.replace(placeholder, valueWithPreservedBreaks);
          }
        }
      });
    }
  });

  return resolvedPrompt;
}

const formatTaskFinal = (formData) => {
  try {
    const data = JSON.parse(formData);
    return `Step 1: Review Problem and Metadata:

- Metadata Quality Check:
    Domain: ${data.expert_b_domain}
    Subdomain: ${data.expert_b_subdomain}
    Rating: ${data.expert_b_difficultyscore}
    Quality: ${data.expert_b_questionQuality}

Step 2 and 3: Grading the Solutions

1. Correct answer:
    - Grade: ${data.human_grade_reference}/1
    - Rationale: ${data.referenceRationale}
2. Incorrect answer 1
    - Grade: ${data.human_grade_candidate_incorrect_answer_1}/1
    - Rationale: ${data.incorrect1Rationale}
3. Incorrect answer 2
    - Grade: ${data.human_grade_candidate_incorrect_answer_2}/1
    - Rationale: ${data.incorrect2Rationale}

Summary of Grading Results:
- human_grade_reference (correct answer): ${data.human_grade_reference}/1
- human_grade_candidate (incorrect answer 1): ${data.human_grade_candidate_incorrect_answer_1}/1
- human_grade_candidate (incorrect answer 2): ${data.human_grade_candidate_incorrect_answer_2}/1`;
  } catch (error) {
    return 'Invalid form data';
  }
};









const Stepper = () => {
  const [showInspector, setShowInspector] = useState(false);
  const {
    state,
    currentStep,
    setCurrentStep,
    updateVariable,
    resetState
  } = useStepperState(initialData);

  // Add safety check
  if (!state || !currentStep || !state[currentStep]) {
    return <div>Loading...</div>;
  }

  const getAllVariables = () => {
    const variables = {
      expert_a_domain: state["Task 0"]?.expert_a_domain || '',
      expert_a_subdomain: state["Task 0"]?.expert_a_subdomain || '',
      expert_a_difficultyscore: state["Task 0"]?.expert_a_difficultyscore || '',
      expert_a_problem: state["Task 0"]?.expert_a_problem || '',      
      expert_a_rubric: state["Task 0"]?.expert_a_rubric || '',
      expert_a_incorrect_1: state["Task 0"]?.expert_a_incorrect_1 || '',      
      expert_a_incorrect_2: state["Task 0"]?.expert_a_incorrect_2 || '',      
      expert_a_correct: state["Task 0"]?.expert_a_correct || '',
      expert_a_incorrect_1_rubric_test: state["Task 0"]?.expert_a_incorrect_1_rubric_test || '',
      expert_a_incorrect_2_rubric_test: state["Task 0"]?.expert_a_incorrect_2_rubric_test || '',
      expert_a_correct_rubric_test: state["Task 0"]?.expert_a_correct_rubric_test || '',  
    };
    return variables;
  };


  // Function to extract text from a .docx file
  const extractTextFromDocx = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const zip = new PizZip(arrayBuffer);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    const text = doc.getFullText();
    return text;
  };

  // Function to handle file upload
  const handleFileUpload = async (file, currentStep, key) => {
    try {
      const text = await extractTextFromDocx(file);
      updateVariable(currentStep, key, text);
    } catch (error) {
      console.error("Error extracting text from .docx file:", error);
    }
  };

  const renderVariables = (variables, heading) => {
    return (
      <>
        <h4>{heading}</h4>
        {variables.map((key) => (
          <RowRenderer
            key={key}
            keyLabel={key}
            value={
              key === 'form_task_1' ? (
                <MetadataForm
                  value={state[currentStep][key]}
                  onChange={(value) => updateVariable(currentStep, key, value)}
                />
              ) : (
                <TextInput
                  value={state[currentStep][key]}
                  onChange={(e) => updateVariable(currentStep, key, e.target.value)}
                />
              )
            }
            onGenerate={key === 'form_task_1' ? () => {
              const formData = state[currentStep][key];
              updateVariable(currentStep, 'task_1_final', formatTaskFinal(formData));
            } : undefined}

            toUpload={
              ['expert_a_problem', 'expert_a_rubric', 'expert_a_incorrect_1', 'expert_a_incorrect_2', 'expert_a_correct', 'expert_a_incorrect_1_rubric_test', 'expert_a_incorrect_2_rubric_test', 'expert_a_correct_rubric_test'].includes(key) ? 
              (file) => {
                handleFileUpload(file, currentStep, key);
              } : undefined}
          />
        ))}
      </>
    );
  };

  const getInputVariables = () => {
    const allKeys = Object.keys(state[currentStep]);
    const promptIndex = allKeys.indexOf('prompt');
    const inputVars = allKeys.filter(key => 
      key !== 'prompt' && key !== 'task_1_final' && key !== 'recommendation'
    && key !== 'heading' && key !== 'instruction');

    return inputVars;
  };

  const getOutputVariables = () => {
    const allKeys = Object.keys(state[currentStep]);
    const promptIndex = allKeys.indexOf('prompt');
    return allKeys.slice(promptIndex + 1).filter(key =>
      !['recommendation'].includes(key) && key !== 'heading' && key !== 'instruction'
    );
  };



  return (
    <>
      <div className="project-header">
        Expert B/C Reviewer Portal
      </div>
      <div className="stepper-layout">
        <div className="stepper-navigation">
          {Object.keys(state).map((step) => (
            <button
              key={step}
              className={`step-btn ${currentStep === step ? "active" : ""}`}
              onClick={() => setCurrentStep(step)}
            >
              {step}
            </button>
          ))}
        </div>
        <div className="stepper-container">
          <div className="step-content">
            <div className="step-heading">{state[currentStep].heading}</div>
            <RowRenderer
              keyLabel="Instruction"
              value={<div className="instruction-text">{state[currentStep].instruction}</div>}
            />
            {renderVariables(getInputVariables(), "Inputs To the Below Prompt")}
            <RowRenderer
              keyLabel="Prompt"
              value={resolvePromptTemplate(state[currentStep].prompt, state)}
            />
            {/* {renderVariables(getOutputVariables(), "Outputs required after running the prompt")} */}
            <h4>Recommendation</h4>
            <h5>{state[currentStep]?.recommendation}</h5>
          </div>
        </div>
      </div>

      <VariableInspectorModal
        isOpen={showInspector}
        onClose={() => setShowInspector(false)}
        variables={getAllVariables()}
        onUpdate={(name, value) => {
          Object.entries(state).forEach(([step, data]) => {
            Object.keys(data).forEach(key => {
              if (key === name) {
                updateVariable(step, key, value);
              }
            });
          });
        }}
      />

      <div className="sticky-bar">
        <button className="inspector-button" onClick={() => setShowInspector(true)}>
          Open Variable Inspector
        </button>
        <button className="reset-button" onClick={resetState}>
          Reset All Data
        </button>
      </div>
    </>
  );
};

export default Stepper;
