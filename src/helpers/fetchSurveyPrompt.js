const fetchSurveyPrompt = (surveyQuestions, characteristics, individuals = 10) => {
  return `
        You are tasked with generating survey responses. 

        Questions:
        ${surveyQuestions}

        Characteristics:
        ${characteristics || "No specific characteristics provided. Assume a general audience."}

        Requirements:
        1. Generate ${individuals} profiles. Each profile must include An index number for each individual. (e.g., Profile #):
         1) - Name
            - Age
            - Gender
            - Country
            - Relevant attributes based on the question
         upto number of ${individuals}.
          
        2. Create a summary of these profiles in tabular format:
          - Use the format below for the summary table:

          Reason Category      Total Mentions
          Positive Preferences
          - [Subcategory]         [Mentions Count]
          - [Subcategory]         [Mentions Count]
          ...
          Neutral Preferences
          - [Subcategory]         [Mentions Count]
          ...
          Negative Preferences
          - [Subcategory]         [Mentions Count]
          ...

        3. Total Mentions by Type:
        - Positive Preferences:   [Total Count]
        - Neutral Preferences:    [Total Count]
        - Negative Preferences:   [Total Count]

        4. Ensure that the total number of mentions matches the number of individuals (${individuals}). 
           Each individual's feedback can include multiple aspects across categories.
        
        5. Key Categories of Preferences:
           Positive Preferences
              - [Subcategory]: [Explanation]
              - [Subcategory]: [Explanation]
              ...
           Neutral Preferences
              - [Subcategory]: [Explanation]
              ...
           Negative Preferences
              - [Subcategory]: [Explanation]
              ...
        
        6. Summary of Trends:
        - Analyze the survey responses and identify key trends pointing out the most common preferences and dislikes.

        Be concise, relevant, and insightful.
`;
};

export default fetchSurveyPrompt;

