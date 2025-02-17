import React, { useState, useReducer, useEffect } from "react";
import "./../css/stepper.css";
import RowRenderer from "./RowRenderer";
import TextInput from "./TextInput";
import VariableInspectorModal from "./VariableInspectorModal";
import MetadataForm from './MetadataForm';

const initialData = {
  "prompt 1": {
    heading: "Prompt 1 - Prompt and Metadata Quality Checks ",
    instruction: "Usage: Use this prompt to restructure the expert question. Consider the suggestions from Claude as optional and make necessary changes as needed",
    DOMAIN: "DOMAIN",
    SUBDOMAIN: "SUBDOMAIN",
    USE_CASE: "USE_CASE",
    DIFFICULTY_SCORE: "DIFFICULTY_SCORE",
    initial_problem: "initial_problem",
    prompt: "<n>You are an expert evaluator tasked with assessing the quality of proposed questions for testing Large Language Models (LLMs). Your evaluation is crucial for ensuring that these questions meet the required standards for difficulty, originality, and expert-level reasoning. Your assessment will contribute to the advancement of AI evaluation techniques.<n><n>Here are the details of the proposed question:<n><n>Domain: <domain>{{DOMAIN}}</domain><n>Subdomain: <subdomain>{{SUBDOMAIN}}</subdomain><n>Use Case (if provided): <use_case>{{USE_CASE}}</use_case><n>Difficulty Score: <difficulty_score>{{DIFFICULTY_SCORE}}</difficulty_score><n><n>Problem Statement:<n><problem><n>{{initial_problem}}<n></problem><n><n>Your task is to evaluate the question based on the following criteria:<n><n>1. Formatting: Is the format of the question correct?<n>2. Originality: Is this question original material?<n>3. Difficulty: Is this question difficult enough?<n>4. Information Dependencies: Does this question require information that is not included in the prompt and could not easily be found on the internet?<n>5. Temporal Retrieval: Does this question require information based on events past April 2024?<n>6. Expert-level reasoning: Does this question require expert-level reasoning and intelligence?<n>7. Outcome-based: Is the question presented in a way that there is likely an objectively correct, gradable answer (or a finite number of plausibly correct answers) that multiple domain experts could agree on?<n><n>Instructions:<n>1. Begin by carefully reading the problem statement and associated details.<n>2. For each criterion, provide a detailed assessment inside <criterion_analysis> tags. Consider the strengths and weaknesses of the question relative to each criterion by:<n>   a. Listing key points from the problem statement relevant to the criterion.<n>   b. Considering both positive and negative aspects related to the criterion.<n>   c. Summarizing the overall assessment for the criterion.<n>3. After your assessment, provide specific feedback and suggestions for improvement, if needed.<n>4. Use the following format for your evaluation of each criterion:<n><n><evaluation><n><criterion>Criterion name</criterion><n><assessment>Your assessment of whether the question meets this criterion</assessment><n><feedback>Specific feedback and suggestions for improvement, if needed</feedback><n></evaluation><n><n>5. After evaluating all criteria, provide the following:<n>   a. A difficulty rating (1-5) based on this guidance:<n>      1: Challenging but straightforward for a strong field student<n>      5: Extremely difficult even for subfield experts<n>   b. Your assessment of the appropriate domain and subdomain for this question, which may differ from the provided information.<n><n>6. Finally, provide an overall assessment of the question's quality and suitability for testing LLMs, along with any additional suggestions for improvement.<n><n>Use the following format for your final assessment:<n><n><final_assessment><n><difficulty_rating>Your assigned difficulty rating (1-5)</difficulty_rating><n><assigned_domain>Your assigned domain</assigned_domain><n><assigned_subdomain>Your assigned subdomain</assigned_subdomain><n><overall_quality>Your overall assessment of the question's quality and suitability</overall_quality><n><improvement_suggestions>Any additional suggestions for improving the question</improvement_suggestions><n></final_assessment><n><n>Remember to be thorough and critical in your evaluation. The goal is to ensure that the questions are of the highest quality for testing LLMs. Consider the following guidelines when evaluating:<n><n>- Questions should focus on evaluating reasoning and intelligence over factual knowledge.<n>- They should require multi-step reasoning and deep thinking.<n>- Questions should not be easily answerable without specific domain expertise.<n>- They should be novel and unlikely to be rote problems for models.<n>- Ensure questions can't be answered with simple fact retrieval.<n>- The target difficulty level should be such that an average Doctorate-level student or equivalent (8+ years professional experience) would score 60-80%.<n>- Questions should be challenging enough that current state-of-the-art models get <15% correct 0-shot.<n>- All content should be original and not in the public domain.<n><n>Begin your evaluation now, starting with your analysis for the first criterion.",
    recommendation: "Just verify the Quality of Question. No as such Recommendation.",
  },
  "Task 1": {
    heading: "Prompt 2 - Draft problem and/or increase difficulty (OPTIONAL)",
    instruction: "Usage: This prompt can help you increase the difficulty of the question. But this is optional",
    prompt: "<n>You are an expert in creating challenging, high-level questions for evaluating Large Language Models (LLMs) in specific domains. Your task is to design a scenario or problem that requires deep expertise and complex reasoning to solve, mimicking real-life situations in the given field.<n><n>First, review the following inputs:<n><n><domain><n>{{DOMAIN}}<n></domain><n><n><subdomain><n>{{SUBDOMAIN}}<n></subdomain><n><n><use_case><n>{{USE_CASE}}<n></use_case><n><n><problem><n>{{initial_problem}}<n></problem><n><n>Using these inputs, create an expert-level question that meets the following criteria:<n><n>1. Requires doctorate-level expertise in the given domain and subdomain.<n>2. Evaluates reasoning and intelligence over factual knowledge.<n>3. Involves multiple reasoning steps, potentially including calculations.<n>4. Mimics a real-life situation in the domain.<n>5. Uses data or information to guide interpretation or decision-making.<n>6. Has an objective, correct answer that can be graded.<n>7. Is very difficult for both LLMs and non-experts to answer correctly.<n>8. Prioritizes the reasoning process over background knowledge.<n>9. Cannot be answered without specific domain expertise.<n>10. Contains original content unlikely to be found on the internet.<n>11. Cannot be answered with simple fact retrieval.<n>12. Leans towards an outcome-based problem rather than a fuzzy problem.<n>13. Is clear in what it's asking and typically limited to one main question.<n>14. Does not rely on information beyond April 2024.<n><n>Follow these steps to create your question:<n><n>1. Develop a realistic context or background for the problem.<n>2. Provide relevant data or information necessary for solving the problem.<n>3. Formulate a clear, concise question that requires expert reasoning to answer.<n>4. Ensure the question is sufficiently complex and requires multiple steps to solve.<n><n>Before presenting your final question, wrap your thought process in <thought_process> tags. In this section:<n>- List key aspects of the domain, subdomain, and use case<n>- Brainstorm 3-5 potential problem scenarios<n>- For each scenario, evaluate how it meets the criteria<n>- Choose the best scenario and explain why<n>It's OK for this section to be quite long.<n><n>After your thought process, present your created scenario and question within <expert_question> tags.<n><n>Finally, provide a brief explanation of why this question meets the criteria for an expert-level, challenging problem for LLMs. Include this explanation within <explanation> tags.<n><n>Example output structure (do not copy the content, only the structure):<n><n><thought_process><n>[Detailed thought process addressing each step]<n></thought_process><n><n><expert_question><n>[Scenario description and expert-level question]<n></expert_question><n><n><explanation><n>[Explanation of why the question meets the criteria]<n></explanation><n><n>Remember to focus on the real-world application, provide sufficient details or data, ensure novelty, and do not include the answer or grading rubric.",
    form_task_1: JSON.stringify({
      correctDomain: '',
      correctSubdomain: '',
      correctDifficultyScore: ''
    }),
    modified_problem: "modified_problem",
    task_1_final : "task_1_final",
    recommendation: "Try to include some aspects to the initial question to make it more technical based on this prompt output.",
  },
  "prompt 3": {
    heading: "Prompt 3: Long, reasoning answer for reference answer editing. Generate incorrect answer.",
    instruction: "Usage: Use this prompt to get a detailed answer from claude. Same as the instructions that we were using earlier",
    prompt: "You are tasked with providing a detailed solution to a given problem statement. Your response should be comprehensive, clearly outlining your reasoning steps and culminating in a well-formulated answer. <n><n>Here is the problem statement you need to address:<n><n><problem><n>{{modified_problem}}<n></problem><n><n>Begin by carefully analyzing the problem. Think through each aspect methodically, considering various angles and potential approaches. Your reasoning should be thorough and explicit, leaving no logical steps unexplained.<n><n>Structure your response as follows:<n><n>1. Start with a <reasoning> section. Within this section:<n>   a. Break down the problem into its core components.<n>   b. Discuss any relevant concepts, theories, or principles that apply to the problem. Put all technical concepts in **bold** and provide a brief definition in (parentheses) immediately after.<n>   c. Present your thought process step-by-step, labeling each major point or premise (e.g., P1, P2, P3...).<n>   d. If applicable, express your argument using formal logic, stating the weakest logical system (e.g., K, S5) in which it can be expressed.<n>   e. Explain how each step in your reasoning follows from the previous ones, referring to the labeled premises as needed.<n>   f. Consider potential counterarguments or alternative viewpoints, and address them.<n><n>2. After your reasoning, provide your <answer> section. This should clearly state your conclusion or solution to the problem, synthesizing the key points from your reasoning.<n><n>Remember, your response can be extremely long. In fact, aim for your reasoning section to be at least 300 words and your answer section to be at least 100 words. The complexity of the task warrants a detailed and comprehensive response.<n><n>In both your reasoning and answer, strive for clarity, precision, and depth. Don't hesitate to explore nuances or provide examples if they help illustrate your points. Your goal is to provide a thorough, well-reasoned solution that demonstrates a deep understanding of the problem and its implications.",
    incorrect_solution_1: "Paste Anthropic Incorrect Answer 1",
    incorrect_solution_2: "Paste Anthropic Incorrect Answer 2",
    recommendation: "See if the answer is incorrect or not. Might be that you need to modify the question and make it more complex if Claude is already giving close to correct solution.",
  },
  "prompt 4": {
    heading: "Prompt 4: Claude re-write of reference answer",
    instruction: "Usage: After creating the expert answer use this prompt to restructure the answer. Consider the suggestions from Claude as optional and make necessary changes as needed",
    expert_reference_answer: "expert_reference_answer",
    prompt: "<n>You are tasked with rewriting an expert's answer to a complex, domain-specific problem. This task is crucial as it helps validate the expert's answer while ensuring the content remains accurate and comprehensive. Your goal is to rephrase the answer in your own words while maintaining all key points and technical details.<n><n>Here is the problem:<n><problem><n>{{modified_problem}}<n></problem><n><n>And here is the expert's answer:<n><reference_answer><n>{{expert_reference_answer}}<n></reference_answer><n><n>Your task is to rewrite this answer in your own words. Follow these guidelines:<n><n>1. Carefully read and understand both the problem and the expert's answer.<n>2. Identify all key points, arguments, data, and technical details in the expert's answer.<n>3. Rewrite the answer using your own phrasing and structure, but ensure that you include all the important information from the original.<n>4. Maintain the same level of technical depth and expertise as the original answer.<n>5. Do not introduce new information or concepts that weren't present in the expert's answer.<n>6. Ensure that your rewritten answer is still correct and comprehensive from an expert's perspective.<n>7. If the expert's answer includes any equations, formulas, or specific numerical data, make sure to include these exactly as they appear in the original.<n>8. If the expert's answer follows a specific logical flow or structure, try to maintain a similar flow in your rewrite.<n><n>Remember:<n>- This is a deeply technical, expert-level problem. Every detail in the original answer may be significant.<n>- Do not simplify or omit any information, even if it seems redundant or overly complex.<n>- Your goal is to rephrase while maintaining 100% of the original content and meaning.<n><n>Before you begin writing your answer, use the <scratchpad> tags to outline the key points and structure of your rewrite. This will help ensure you don't miss any crucial information.<n><n>Once you've completed your rewrite, present your answer within <rewritten_answer> tags.",
    claude_restructured_answer: "claude_restructured_answer",
    expert_final_answer: "expert_final_answer (If you want to include any improvement from Claude's answer)",
    recommendation: "let the Claude rewrite the answer for you. Try and include some aspects from the output to your expert_final_asnwer. If you don't want to inlcude any of it's suggestion, it is fine. Just copy your reference answer as it is.",
  },
  "prompt 5": {
    heading: "Prompt 5: Rubric Draft Generation",
    instruction: "Usage: Use this prompt to get a draft version of the rubirc. Consider the suggestions from Claude as optional and make necessary changes as needed",
    prompt: "<n>You are an experienced professor in the following academic domain:<n><n><domain>{{DOMAIN}}</domain><n><n>Your task is to create a detailed grading rubric for a specific problem in your field. This rubric will be used to grade students' solutions for their homework, exams, and projects. Your goal is to create a rubric that can clearly differentiate between correct and incorrect solutions.<n><n>Please review the following information carefully:<n><n>1. Problem Statement:<n><problem><n>{{modified_problem}}<n></problem><n><n>2. Reference (Correct) Answer:<n><reference_answer><n>{{expert_final_answer}}<n></reference_answer><n><n>3. Incorrect Solution 1:<n><incorrect_solution_1><n>{{incorrect_solution_1}}<n></incorrect_solution_1><n><n>4. Incorrect Solution 2:<n><incorrect_solution_2><n>{{incorrect_solution_2}}<n></incorrect_solution_2><n><n>Using this information, create a detailed rubric that breaks down the problem and its solution into essential steps. Each step should represent a key concept, calculation, reasoning, or assumption. Do not include steps that are purely for language purposes.<n><n>Rubric Creation Guidelines:<n>1. Create no more than 5 rubric items (unless the problem has multiple parts, then create up to 3 items per part).<n>2. Assign 2 points to each item.<n>3. Break down complex steps into smaller, more manageable items if necessary.<n>4. Write clear and concise grading guidelines for each item:<n>   - 2 points for fully correct<n>   - 0 points for entirely missed or major misassumption<n>   - 1 point for small mistakes (if applicable)<n>5. Explain your reasoning for the point assignment and grading guidelines.<n>6. Ensure the rubric only grades what is explicitly required in the original problem.<n>7. Base all technical content strictly on the problem statement and reference answer.<n>8. Ensure the reference answer would receive full credit on all rubric items.<n>9. Assign a weight to each item (0.00-1.00), ensuring the total weight across all items equals 1.00.<n><n>For each rubric item, use the following structure:<n><n><rubrics><n><item><n><name>[Concise name of the rubric item]</name><n><reasoning>[Justification for this rubric item and its complexity]</reasoning><n><grading_guidelines>[Clear guidelines for assigning 2, 1, or 0 points]</grading_guidelines><n><item_weight>[Importance of this criteria, 0.00-1.00]</item_weight><n></item><n></rubrics><n><n>Before creating each rubric item, wrap your analysis in <rubric_item_analysis> tags. Consider the following:<n>- What key concept or step does this item address?<n>- How does this item differentiate between correct and incorrect solutions?<n>- Is this item atomic, or should it be broken down further?<n>- How does this item relate to the problem requirements and reference answer?<n>- How does this item specifically address issues seen in the provided incorrect solutions?<n>- What aspects of this item are crucial for distinguishing between a correct and incorrect approach?<n><n>After creating your rubric, review it using this checklist:<n>- Does the rubric clearly differentiate between correct and incorrect answers?<n>- Are the criteria clear, objective, and specific to the question?<n>- Does it use a 2/1/0 scoring system for criteria?<n>- Can it assess any correct answer, not just the reference answer?<n>- Is it understandable by non-experts?<n>- Are the weights appropriate based on problem importance?<n>- Do the weights sum to 1.00?<n><n>Finally, provide feedback on the problem statement. Consider if there are clearer ways to ask the question to differentiate between correct and incorrect answers. Base your feedback on the provided reference answer and incorrect solutions. Present your feedback in the following format:<n><n><problem_feedback><n>[Your feedback on the problem statement]<n></problem_feedback><n><n>Remember, your goal is to create a rubric that can accurately assess any correct solution to the problem, not just the reference answer provided. Ensure that your rubric does not contain criteria that are not clearly needed to provide a correct answer based on the problem statement.<n><n>EXAMPLE RUBRIC<n><rubrics><n><item><n><name> Correct number of chemical bounds </name><n><reasoning> The student is asked to draw the lewis structure of CO2. The solutinon must have the correct number of bounds of the correct types. </reasoning><n><grading_guidelines> Assign full credit if the student's solution has exactly two C=O bounds. Assign zero credit if not. </grading_guidelines><n><item_weight>0.50</item_weight><n></item><n><item><n><name> Bounds in the correct positions </name><n><reasoning> The student is asked to draw the lewis structure of CO2. The bounds must be in the correct positions. </reasoning><n><grading_guidelines> Assign full credit if C=O bounds are in the correct positions. Assign zero credit if not. </grading_guidelines><n><item_weight>0.30</item_weight><n></item><n><item><n><name> Mark the electrons correctly </name><n><reasoning> The student is asked to draw the lewis structure of CO2. The electrons must be marked correctly. </reasoning><n><grading_guidelines> Assign full credit if the student marked the electrons correctly. Assign 1 point if the student marked some electrons correctly but missed some others. Assign zero credit if not. </grading_guidelines><n></item><n><item_weight>0.20</item_weight><n></rubrics>",
    rubric: "Paste the essential part of rubric from claude output",
    recommendation: "Don't copy the entire thing. Just put the rubric items.",
  },
  "prompt5.1": {
    heading: "Prompt 5.1: Redraft Rubric ",
    instruction: "Usage: Use this prompt to restructure the expert's rubric. ",
    rough_rubric: "Put your rough_rubric here",
    prompt: "You are an experienced professor in the following academic domain:<n><n><domain>{{DOMAIN}}</domain><n><n>Your task is to rewrite the mentioned rubric for a specific problem in your field. This rubric will be used to grade students' solutions for their homework, exams, and projects. Your goal is to create a rubric that can clearly differentiate between correct and incorrect solutions.<n><n>Please review the following information carefully:<n><n>1. Problem Statement:<n><problem><n>{{modified_problem}}<n></problem><n><n>2. Reference (Correct) Answer:<n><reference_answer><n>{{expert_final_answer}}<n></reference_answer><n><n>3. Incorrect Solution 1:<n><incorrect_solution_1><n>{{incorrect_solution_1}}<n></incorrect_solution_1><n><n>4. Incorrect Solution 2:<n><incorrect_solution_2><n>{{incorrect_solution_2}}<n></incorrect_solution_2><n><n>5. rubric<n><rubric><n>{{rough_rubric}}<n></rubric><n><n>Using this information, create a detailed rubric that breaks down the problem and its solution into essential steps. Each step should represent a key concept, calculation, reasoning, or assumption. Do not include steps that are purely for language purposes.<n><n>Rubric Creation Guidelines:<n>1. Create no more than 5 rubric items (unless the problem has multiple parts, then create up to 3 items per part).<n>2. Assign 2 points to each item.<n>3. Break down complex steps into smaller, more manageable items if necessary.<n>4. Write clear and concise grading guidelines for each item:<n>   - 2 points for fully correct<n>   - 0 points for entirely missed or major misassumption<n>   - 1 point for small mistakes (if applicable)<n>5. Explain your reasoning for the point assignment and grading guidelines.<n>6. Ensure the rubric only grades what is explicitly required in the original problem.<n>7. Base all technical content strictly on the problem statement and reference answer.<n>8. Ensure the reference answer would receive full credit on all rubric items.<n>9. Assign a weight to each item (0.00-1.00), ensuring the total weight across all items equals 1.00.<n><n>For each rubric item, use the following structure:<n><n><rubrics><n><item><n><name>[Concise name of the rubric item]</name><n><reasoning>[Justification for this rubric item and its complexity]</reasoning><n><grading_guidelines>[Clear guidelines for assigning 2, 1, or 0 points]</grading_guidelines><n><item_weight>[Importance of this criteria, 0.00-1.00]</item_weight><n></item><n></rubrics><n><n>Before creating each rubric item, wrap your analysis in <rubric_item_analysis> tags. Consider the following:<n>- What key concept or step does this item address?<n>- How does this item differentiate between correct and incorrect solutions?<n>- Is this item atomic, or should it be broken down further?<n>- How does this item relate to the problem requirements and reference answer?<n>- How does this item specifically address issues seen in the provided incorrect solutions?<n>- What aspects of this item are crucial for distinguishing between a correct and incorrect approach?<n><n>After creating your rubric, review it using this checklist:<n>- Does the rubric clearly differentiate between correct and incorrect answers?<n>- Are the criteria clear, objective, and specific to the question?<n>- Does it use a 2/1/0 scoring system for criteria?<n>- Can it assess any correct answer, not just the reference answer?<n>- Is it understandable by non-experts?<n>- Are the weights appropriate based on problem importance?<n>- Do the weights sum to 1.00?<n><n>Finally, provide feedback on the problem statement. Consider if there are clearer ways to ask the question to differentiate between correct and incorrect answers. Base your feedback on the provided reference answer and incorrect solutions. Present your feedback in the following format:<n><n><problem_feedback><n>[Your feedback on the problem statement]<n></problem_feedback><n><n>Remember, your goal is to create a rubric that can accurately assess any correct solution to the problem, not just the reference answer provided. Ensure that your rubric does not contain criteria that are not clearly needed to provide a correct answer based on the problem statement.<n><n>EXAMPLE RUBRIC<n><rubrics><n><item><n><name> Correct number of chemical bounds </name><n><reasoning> The student is asked to draw the lewis structure of CO2. The solutinon must have the correct number of bounds of the correct types. </reasoning><n><grading_guidelines> Assign full credit if the student's solution has exactly two C=O bounds. Assign zero credit if not. </grading_guidelines><n><item_weight>0.50</item_weight><n></item><n><item><n><name> Bounds in the correct positions </name><n><reasoning> The student is asked to draw the lewis structure of CO2. The bounds must be in the correct positions. </reasoning><n><grading_guidelines> Assign full credit if C=O bounds are in the correct positions. Assign zero credit if not. </grading_guidelines><n><item_weight>0.30</item_weight><n></item><n><item><n><name> Mark the electrons correctly </name><n><reasoning> The student is asked to draw the lewis structure of CO2. The electrons must be marked correctly. </reasoning><n><grading_guidelines> Assign full credit if the student marked the electrons correctly. Assign 1 point if the student marked some electrons correctly but missed some others. Assign zero credit if not. </grading_guidelines><n></item><n><item_weight>0.20</item_weight><n></rubrics>",
    rubric: "Paste the essential part of rubric from claude output",
    recommendation: "Don't copy the entire thing. Just put the rubric items.",
  },
  "prompt 6": {
    heading: "Prompt 6: Note differences between reference and Claude answers",
    instruction: "Usage: use this prompt to find the key differences between the experts answer and claude answer",
    prompt: "You are an AI assistant designed to help an expert educator analyze solutions to a given problem. Your task is to compare a correct solution with two incorrect solutions, identifying key differences that can be used to develop a grading rubric. This analysis will help in creating fair and comprehensive assessment criteria for similar problems.<n><n>Here's the problem you need to analyze:<n><n>Problem Statement:<n><problem><n>{{modified_problem}}<n></problem><n><n>Now, let's examine the solutions. First, here's the correct solution as determined by an expert:<n><n>Reference (Correct) Answer:<n><reference_answer><n>{{expert_final_answer}}<n></reference_answer><n><n>Next, we have two incorrect solutions for comparison:<n><n>Incorrect Solution 1:<n><incorrect_solution_1><n>{{incorrect_solution_1}}<n></incorrect_solution_1><n><n>Incorrect Solution 2:<n><incorrect_solution_2><n>{{incorrect_solution_2}}<n></incorrect_solution_2><n><n>Your task is to carefully analyze and compare these solutions. Focus on the following aspects:<n><n>1. Key differences in reasoning or approach<n>2. Specific calculation errors or misconceptions<n>3. Critical content or conceptual differences<n>4. Patterns or common mistakes between the incorrect solutions<n><n>Before providing your analysis, extract and list key elements from each solution in <key_elements> tags:<n><n><key_elements><n>1. Correct Solution:<n>   [List main steps, concepts, and methods used]<n><n>2. Incorrect Solution 1:<n>   [List main steps, concepts, and methods used]<n><n>3. Incorrect Solution 2:<n>   [List main steps, concepts, and methods used]<n><n>4. Comparison:<n>   [Explicitly compare the elements across solutions, noting similarities and differences]<n></key_elements><n><n>Now, provide your analysis inside solution_comparison tags using the following structure:<n><n><solution_comparison><n>1. Overview of the correct solution's approach:<n>   [Briefly describe the main steps and key concepts used in the correct solution]<n><n>2. Analysis of incorrect solution 1:<n>   a. Main error(s) or misconception(s):<n>      [Identify and explain the primary mistakes]<n>   b. Differences from the correct solution:<n>      [Compare the approach, calculations, or concepts used]<n>   c. Partial correctness or valid steps:<n>      [Highlight any parts of the solution that are correct or on the right track]<n><n>3. Analysis of incorrect solution 2:<n>   [Follow the same structure as for incorrect solution 1]<n><n>4. Common mistakes or patterns:<n>   [Summarize any similarities between the incorrect solutions or recurring errors]<n><n>5. Suggested rubric points:<n>   [List 3-5 key criteria that could be used to differentiate correct from incorrect answers]<n></solution_comparison><n><n>Your analysis should be thorough and specific, providing clear insights that will help the expert develop a robust grading rubric for similar problems. Use technical language appropriate for the subject matter, but ensure your explanations are clear and concise.<n><n>Example output structure (using generic content):<n><n><solution_comparison><n>1. Overview of the correct solution's approach:<n>   The correct solution follows a step-by-step process, starting with [concept A], then applying [method B], and finally deriving the result using [principle C].<n><n>2. Analysis of incorrect solution 1:<n>   a. Main error(s) or misconception(s):<n>      The primary mistake is a misunderstanding of [concept X], leading to an incorrect application of [method Y].<n>   b. Differences from the correct solution:<n>      While the correct solution uses [approach Z], this solution attempts to [incorrect approach].<n>   c. Partial correctness or valid steps:<n>      The initial setup and identification of [relevant factor] are correct, but the subsequent steps deviate from the proper method.<n><n>3. Analysis of incorrect solution 2:<n>   [Similar structure to incorrect solution 1, but with different specific points]<n><n>4. Common mistakes or patterns:<n>   Both incorrect solutions demonstrate a misunderstanding of [fundamental concept], although they manifest this misunderstanding in different ways.<n><n>5. Suggested rubric points:<n>   - Correct identification and application of [key principle]<n>   - Proper use of [specific method or formula]<n>   - Accurate calculations and unit conversions<n>   - Clear presentation of logical steps leading to the solution<n>   - Correct interpretation of the final result in the context of the problem<n></solution_comparison><n><n>Please proceed with your analysis of the given problem and solutions.<n>",
    key_differences: "paste the output of claude for key differences here",
    recommendation: "This will help you find the key differences.",
  },
  "prompt7.1": {
    heading: "Rubric Test For Incorrect Solution 1",
    instruction: "Usage: Use this prompt to perform the rubric test for the incorrect solution 1 given by Claude",
    prompt: "You are an experienced instructor tasked with grading a student's solution for a homework, exam, or project. Your goal is to provide a fair and thorough assessment based on a detailed grading rubric, along with constructive feedback for the student.<n><n>First, carefully review the following information:<n><n>1. The problem statement:<n><problem><n>{{modified_problem}}<n></problem><n><n>2. The grading rubrics:<n><rubrics><n>{{rubric}}<n></rubrics><n><n>3. The student's solution:<n><student_solution><n>{{incorrect_solution_1}}<n></student_solution><n><n>Now, follow these steps to grade the student's work:<n><n>1. Read the problem statement to fully understand what was asked of the student.<n>2. Review the grading rubrics to familiarize yourself with the evaluation criteria.<n>3. Thoroughly read the student's solution.<n>4. Grade each rubric item as follows:<n>   a. Compare the student's solution to the grading guidelines.<n>   b. Assign 0, 1, or 2 points based on how well the solution meets the criteria.<n>   c. Provide a clear justification for your point assignment.<n>   d. Calculate the weighted score using: (points assigned / 2) * item_weight.<n>5. Evaluate the solution using extra rubrics for clarity, conciseness, and logical flow.<n>6. Write comprehensive grading comments.<n>7. Review the effectiveness of the grading rubrics.<n><n>Use the following format for your output:<n><n><input_rubrics><n><item><n><index>[Rubric item index]</index><n><name>[Rubric item name and purpose]</name><n><student_points>[0, 1, or 2]</student_points><n><reasoning>[Justification for points assigned]</reasoning><n><weighted_score>[Calculated as (student_points/2) * item_weight]</weighted_score><n></item><n>[Repeat for each rubric item]<n></input_rubrics><n><n><extra_rubrics><n><clarity><n>[Assessment of solution's clarity (0-2 points)]<n></clarity><n><conciseness><n>[Assessment of solution's conciseness (0-2 points)]<n></conciseness><n><logical_flow><n>[Assessment of solution's logical flow (0-2 points)]<n></logical_flow><n></extra_rubrics><n><n><grading_comments><n>[Overall assessment of the student's work]<n>[Specific strengths and areas for improvement]<n>[Any notable aspects not covered by the rubrics]<n></grading_comments><n><n><rubric_review><n>[Assessment of rubric coverage, clarity, and sufficiency]<n></rubric_review><n><n>Before you begin grading, wrap your analysis inside <solution_analysis> tags. In this analysis:<n>1. Summarize the problem statement and key requirements.<n>2. List out each rubric item and its weight.<n>3. Identify potential strengths and weaknesses in the student's solution.<n>4. Plan how you will approach grading each rubric item.<n><n>It's OK for this section to be quite long.<n><n>Remember to be fair, consistent, and thorough in your grading process. Provide valuable feedback that helps the student understand their performance and areas for improvement.",
    rubrictest_incorrect_1: "rubrictest_incorrect_1",
    rubrictest_incorrect_1_bw_input_rubrics_tag: "rubrictest_incorrect_1_bw_input_rubrics_tag",
    recommendation: "Is it less than 50% ? Copy the full output in 1st field but Just copy the part b/w <input_rubrics> in the second field so that it can be used later on ",
  },
  "prompt7.2": {
    heading: "Rubric Test For Incorrect Solution 2",
    instruction: "Usage: Use this prompt to perform the rubric test for the incorrect solution 2 given by Claude",
    prompt: "You are an experienced instructor tasked with grading a student's solution for a homework, exam, or project. Your goal is to provide a fair and thorough assessment based on a detailed grading rubric, along with constructive feedback for the student.<n><n>First, carefully review the following information:<n><n>1. The problem statement:<n><problem><n>{{modified_problem}}<n></problem><n><n>2. The grading rubrics:<n><rubrics><n>{{rubric}}<n></rubrics><n><n>3. The student's solution:<n><student_solution><n>{{incorrect_solution_2}}<n></student_solution><n><n>Now, follow these steps to grade the student's work:<n><n>1. Read the problem statement to fully understand what was asked of the student.<n>2. Review the grading rubrics to familiarize yourself with the evaluation criteria.<n>3. Thoroughly read the student's solution.<n>4. Grade each rubric item as follows:<n>   a. Compare the student's solution to the grading guidelines.<n>   b. Assign 0, 1, or 2 points based on how well the solution meets the criteria.<n>   c. Provide a clear justification for your point assignment.<n>   d. Calculate the weighted score using: (points assigned / 2) * item_weight.<n>5. Evaluate the solution using extra rubrics for clarity, conciseness, and logical flow.<n>6. Write comprehensive grading comments.<n>7. Review the effectiveness of the grading rubrics.<n><n>Use the following format for your output:<n><n><input_rubrics><n><item><n><index>[Rubric item index]</index><n><name>[Rubric item name and purpose]</name><n><student_points>[0, 1, or 2]</student_points><n><reasoning>[Justification for points assigned]</reasoning><n><weighted_score>[Calculated as (student_points/2) * item_weight]</weighted_score><n></item><n>[Repeat for each rubric item]<n></input_rubrics><n><n><extra_rubrics><n><clarity><n>[Assessment of solution's clarity (0-2 points)]<n></clarity><n><conciseness><n>[Assessment of solution's conciseness (0-2 points)]<n></conciseness><n><logical_flow><n>[Assessment of solution's logical flow (0-2 points)]<n></logical_flow><n></extra_rubrics><n><n><grading_comments><n>[Overall assessment of the student's work]<n>[Specific strengths and areas for improvement]<n>[Any notable aspects not covered by the rubrics]<n></grading_comments><n><n><rubric_review><n>[Assessment of rubric coverage, clarity, and sufficiency]<n></rubric_review><n><n>Before you begin grading, wrap your analysis inside <solution_analysis> tags. In this analysis:<n>1. Summarize the problem statement and key requirements.<n>2. List out each rubric item and its weight.<n>3. Identify potential strengths and weaknesses in the student's solution.<n>4. Plan how you will approach grading each rubric item.<n><n>It's OK for this section to be quite long.<n><n>Remember to be fair, consistent, and thorough in your grading process. Provide valuable feedback that helps the student understand their performance and areas for improvement.",
    rubrictest_incorrect_2: "rubrictest_incorrect_2",
    rubrictest_incorrect_2_bw_input_rubrics_tag: "rubrictest_incorrect_2_bw_input_rubrics_tag",
    recommendation: "Is it less than 50% ? Copy the full output in 1st field but Just copy the part b/w <input_rubrics> in the second field so that it can be used later on",
  },
  "prompt7.3": {
    heading: "Rubric Test For Correct Solution ",
    instruction: "Usage: Use this prompt to perform the rubric test for the Correct Solution written by Expert",
    prompt: "You are an experienced instructor tasked with grading a student's solution for a homework, exam, or project. Your goal is to provide a fair and thorough assessment based on a detailed grading rubric, along with constructive feedback for the student.<n><n>First, carefully review the following information:<n><n>1. The problem statement:<n><problem><n>{{modified_problem}}<n></problem><n><n>2. The grading rubrics:<n><rubrics><n>{{rubric}}<n></rubrics><n><n>3. The student's solution:<n><student_solution><n>{{expert_final_answer}}<n></student_solution><n><n>Now, follow these steps to grade the student's work:<n><n>1. Read the problem statement to fully understand what was asked of the student.<n>2. Review the grading rubrics to familiarize yourself with the evaluation criteria.<n>3. Thoroughly read the student's solution.<n>4. Grade each rubric item as follows:<n>   a. Compare the student's solution to the grading guidelines.<n>   b. Assign 0, 1, or 2 points based on how well the solution meets the criteria.<n>   c. Provide a clear justification for your point assignment.<n>   d. Calculate the weighted score using: (points assigned / 2) * item_weight.<n>5. Evaluate the solution using extra rubrics for clarity, conciseness, and logical flow.<n>6. Write comprehensive grading comments.<n>7. Review the effectiveness of the grading rubrics.<n><n>Use the following format for your output:<n><n><input_rubrics><n><item><n><index>[Rubric item index]</index><n><name>[Rubric item name and purpose]</name><n><student_points>[0, 1, or 2]</student_points><n><reasoning>[Justification for points assigned]</reasoning><n><weighted_score>[Calculated as (student_points/2) * item_weight]</weighted_score><n></item><n>[Repeat for each rubric item]<n></input_rubrics><n><n><extra_rubrics><n><clarity><n>[Assessment of solution's clarity (0-2 points)]<n></clarity><n><conciseness><n>[Assessment of solution's conciseness (0-2 points)]<n></conciseness><n><logical_flow><n>[Assessment of solution's logical flow (0-2 points)]<n></logical_flow><n></extra_rubrics><n><n><grading_comments><n>[Overall assessment of the student's work]<n>[Specific strengths and areas for improvement]<n>[Any notable aspects not covered by the rubrics]<n></grading_comments><n><n><rubric_review><n>[Assessment of rubric coverage, clarity, and sufficiency]<n></rubric_review><n><n>Before you begin grading, wrap your analysis inside <solution_analysis> tags. In this analysis:<n>1. Summarize the problem statement and key requirements.<n>2. List out each rubric item and its weight.<n>3. Identify potential strengths and weaknesses in the student's solution.<n>4. Plan how you will approach grading each rubric item.<n><n>It's OK for this section to be quite long.<n><n>Remember to be fair, consistent, and thorough in your grading process. Provide valuable feedback that helps the student understand their performance and areas for improvement.",
    rubrictest_correct_1: "rubrictest_correct",
    recommendation: "Is it more than 90% ?  ",
  },
  "prompt 8": {
    heading: "Prompt 8: Retrieval sensitivity",
    instruction: "Usage: use this prompt to create the Retreival sensitivity of the Claude model. If the model says that it dosent have the required information then provide some supplementary material",
    prompt: "<n>You are an expert educational content reviewer tasked with evaluating and potentially improving a problem, its rubric, and associated answers. Your goal is to ensure the content meets specific criteria for difficulty, relevance, and focus on reasoning skills.<n><n>Please review the following information:<n><n><problem><n>{{modified_problem}}<n></problem><n><n><rubrics><n>{{rubric}}<n></rubrics><n><n><correct_answer><n>{{expert_final_answer}}<n></correct_answer><n><n><reference_answer><n>{{claude_restructured_answer}}<n></reference_answer><n><n><incorrect_solution_1><n>{{incorrect_solution_1}}<n></incorrect_solution_1><n><n><incorrect_solution_2><n>{{incorrect_solution_2}}<n></incorrect_solution_2><n><n><grading_solution_1><n>{{rubrictest_incorrect_1_bw_input_rubrics_tag}}<n></grading_solution_1><n><n><grading_solution_2><n>{{rubrictest_incorrect_2_bw_input_rubrics_tag}}<n></grading_solution_2><n><n>Your task is to analyze this content and provide an evaluation based on the following criteria:<n><n>1. Temporal relevance: Ensure the problem does not require information that occurred after April 2024.<n>2. Difficulty level: Verify that the problem targets expert-level difficult reasoning, not just information retrieval.<n>3. Knowledge requirements: Assess whether the problem requires niche background knowledge that would be difficult to find through a simple internet search.<n><n>If the problem meets all criteria, provide your evaluation stating that no updates are needed. If any issues are found, follow these steps:<n><n>1. Identify the key context knowledge needed to understand and solve the problem, without including information on how to reason through it or its solution.<n>2. Create an updated version of the problem that incorporates the necessary context, shifting the focus to the reasoning aspects rather than niche knowledge retrieval.<n><n>Wrap your analysis and output in the following tags:<n><n><problem_summary><n>[Summarize the main components of the problem, including its core question or task, key information provided, and any constraints or conditions.]<n></problem_summary><n><n><detailed_analysis><n>[Provide your detailed analysis here, addressing each of the three criteria separately:<n><n>1. Temporal relevance: Discuss any dates or events mentioned and their relation to the April 2024 cutoff.<n>2. Difficulty level: Evaluate the problem's complexity, considering aspects such as:<n>   - Multiple interconnected concepts<n>   - Need for abstract thinking<n>   - Requirement for synthesis of information<n>   - Application of principles to novel situations<n>3. Knowledge requirements: Identify any specific knowledge areas required and assess their accessibility through common search methods.<n><n>Explain your reasoning for each criterion.]<n></detailed_analysis><n><n><evaluation><n>[Summarize your assessment of the problem's suitability, including any issues identified.]<n></evaluation><n><n><key_context><n>[If applicable, summarize the key context knowledge needed. Omit this section if not needed.]<n></key_context><n><n><updated_problem><n>[If necessary, provide an updated version of the problem that includes the required context. Omit this section if not needed.]<n></updated_problem><n><n>Example output structure (note: this is a generic example, your actual content will vary):<n><n><problem_summary><n>The problem asks students to analyze the impact of a new environmental regulation on a specific industry's profit margins. It provides information on current industry practices, the regulation's requirements, and recent market trends.<n></problem_summary><n><n><detailed_analysis><n>1. Temporal relevance: The problem refers to a regulation implemented in 2023 and market trends from 2022, which is within the acceptable timeframe (before April 2024).<n><n>2. Difficulty level: The problem requires complex analysis of economic trends and regulatory impacts, suitable for expert-level reasoning. It involves:<n>   - Synthesizing information from multiple sources (industry practices, regulations, market trends)<n>   - Abstract thinking to predict future outcomes<n>   - Application of economic principles to a novel situation<n><n>3. Knowledge requirements: The problem assumes detailed knowledge of specific industry regulations, which may be considered niche information. While general environmental regulations might be easily searchable, the specific impact on this industry's practices might require more specialized knowledge.<n></detailed_analysis><n><n><evaluation><n>The problem meets the criteria for temporal relevance and difficulty level. However, it requires niche knowledge that may not be easily accessible, potentially shifting focus away from reasoning skills.<n></evaluation><n><n><key_context><n>Key context needed: Overview of industry-specific regulations, including main regulatory bodies and core principles of compliance in the given sector.<n></key_context><n><n><updated_problem><n>[Provide the updated problem text here, incorporating the key context identified above.]<n></updated_problem><n><n>Remember, if the problem does not require updating, state this in your evaluation and omit the <key_context> and <updated_problem> sections.<n>",
    retrieval_sensitivity: "Paste the output from Claude for retrieval_sensitivity ",
    recommendation: "Final step. You can proceed to download all data after this.",
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
    const savedState = localStorage.getItem('stepperState');
    return savedState ? JSON.parse(savedState) : initialState;
  };

  const [state, dispatch] = useReducer(stepperReducer, loadSavedState());
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem('currentStep');
    return savedStep || "prompt 1";
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('stepperState', JSON.stringify(state));
    localStorage.setItem('currentStep', currentStep);
  }, [state, currentStep]);

  const updateVariable = (step, key, value) => {
    // First update the current step's variable
    dispatch({
      type: ACTIONS.UPDATE_VARIABLE,
      payload: { step, key, value }
    });

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

  const resetState = () => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      dispatch({ type: ACTIONS.RESET_STATE });
      localStorage.removeItem('stepperState');
      localStorage.removeItem('currentStep');
      window.location.reload(); // Force reload to ensure clean state
    }
  };

  return {
    state,
    currentStep,
    setCurrentStep,
    updateVariable,
    resetState
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

const Stepper = () => {
  const [showInspector, setShowInspector] = useState(false);
  const {
    state,
    currentStep,
    setCurrentStep,
    updateVariable,
    resetState
  } = useStepperState(initialData);

  const getAllVariables = () => {
    const variables = {
      DOMAIN: state["prompt 1"]?.DOMAIN || '',
      SUBDOMAIN: state["prompt 1"]?.SUBDOMAIN || '',
      USE_CASE: state["prompt 1"]?.USE_CASE || '',
      DIFFICULTY_SCORE: state["prompt 1"]?.DIFFICULTY_SCORE || '',
      initial_problem: state["prompt 1"]?.initial_problem || '',
      modified_problem: state["Task 1"]?.modified_problem || '',
      incorrect_solution_1: state["prompt 3"]?.incorrect_solution_1 || '',
      incorrect_solution_2: state["prompt 3"]?.incorrect_solution_2 || '',
      expert_reference_answer: state["prompt 4"]?.expert_reference_answer || '',
      claude_restructured_answer: state["prompt 4"]?.claude_restructured_answer || '',
      expert_final_answer: state["prompt 4"]?.expert_final_answer || '',
      rough_rubric: state["prompt5.1"]?.rough_rubric || '',
      rubric: state["prompt5.1"]?.rubric || '',
      rubrictest_incorrect_1: state["prompt7.1"]?.rubrictest_incorrect_1 || '',
      rubrictest_incorrect_2: state["prompt7.2"]?.rubrictest_incorrect_2 || '',
      rubrictest_correct: state["prompt7.3"]?.rubrictest_correct || '',
      key_differences: state["prompt 6"]?.key_differences || '',
      retrieval_sensitivity: state["prompt 8"]?.retrieval_sensitivity || ''
    };
    return variables;
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
          />
        ))}
      </>
    );
  };

  const getInputVariables = () => {
    const allKeys = Object.keys(state[currentStep]);
    const promptIndex = allKeys.indexOf('prompt');
    return allKeys.slice(0, promptIndex).filter(key => 
      !['heading', 'instruction'].includes(key)
    );
  };

  const getOutputVariables = () => {
    const allKeys = Object.keys(state[currentStep]);
    const promptIndex = allKeys.indexOf('prompt');
    return allKeys.slice(promptIndex + 1).filter(key => 
      !['recommendation'].includes(key)
    );
  };

  return (
    <>
      <div className="project-header">
        Anthropic DS P12 Hybrid Questions 01_22_2025
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
            {renderVariables(getOutputVariables(), "Outputs required after running the prompt")}
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
