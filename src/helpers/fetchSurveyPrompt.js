const fetchSurveyPrompt = (surveyQuestions, characteristics, individuals) => {
  return `
        You are tasked with generating survey responses. 

        Questions:
        ${surveyQuestions}

        Characteristics:
        ${characteristics || "No specific characteristics provided. Assume a general audience."}

        Requirements:
        1. Generate ${individuals || 10} profiles. Each profile must include An index number for each individual. (e.g., Profile #):

         1) - Name
            - Age
            - Gender
            - Country
            - Dynamic Relevant attributes based on the question

         upto number of ${individuals || 10}.
          
        2. Ensure that the total number of mentions matches the number of individuals (${individuals || 10}). 
              Each individual's feedback can include multiple aspects across categories.

        3. Create a **Summary Table** where the total mentions match the exact number of profiles (${individuals || 10}). 
           - Each respondent must contribute only **one mention** to the table to ensure accurate totals. Use the following table format:

          Reason Category          Total Mentions
           - [Subcategory]         [Mentions Count]
           - [Subcategory]         [Mentions Count]
           ...
             
        4. Total Mentions by Type:

           - [mention category preferance ] :   [Total Count]
           ...

        
        5. Key Categories of Preferences:

           -[mentions categories] Preferences
              - [Subcategory]: [Explanation]
              - [Subcategory]: [Explanation]
              ...
        
        6. Summary of Trends:

          -Analyze the survey responses and identify key points of interest.
           - give ponits of interest

        Be concise, relevant, and insightful.
`;
};

export default fetchSurveyPrompt;