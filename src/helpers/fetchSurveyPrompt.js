const fetchSurveyPrompt = (surveyQuestions, characteristics, individuals) => {
  return `
        You are tasked with generating realistic and insightful survey responses based on the provided question.

        **Survey Question:**
        ${surveyQuestions || "No specific question provided. Please generate responses based on general themes."}

        **Respondent Characteristics:**
        ${characteristics || "No specific characteristics provided. Assume a general audience."}

         **Requirements:**
            Generate ${individuals || 10} profiles. Ensure each profile must include an index number for each individual. (e.g., Profile 1, Profile 2, etc.):
              **[profile number] :** 
                - Name
                - Age
                - Gender
                - Country
                - [add some attributes based on the survey questions]

            Ensure that each profile is well-rounded, with a mix of responses related to the main topic. 
            Generate up to ${individuals || 10} profiles in same formate below the one.

        **Mentions and Totals:**
           - The total number of mentions in the **Summary Table** must **exactly match the number of profiles (${individuals || 10})**.

        **Summary Table:**
           - Create a table summarizing the responses in the following format:
             
             Reason Category          Total Mentions
              ---------------------------------------
            1.**[category]**       |         
             - [Subcategory]       |  [Count]
             - [Subcategory]       |  [Count]
            2.**[category]**       |         
             - [Subcategory]       |  [Count]
             - [Subcategory]       |  [Count]
             ...

           - Ensure the total mentions equal the number of profiles (${individuals || 10}) and each profile next to it not inline atributes and total mentions count must be correct.

        **Mentions by Type:**
          Provide a detailed breakdown of preferences by type in the following format:
             - [Mention Category]: [Total Count]
             - [Mention Category]: [Total Count]
             ...

        **Key Categories of Preferences:**
            Analyze the responses to identify key categories of preferences.
            Use the following format to explain:
             - **[Subcategory]**: [Explanation of its relevance or importance]
             - **[Subcategory]**: [Explanation of its relevance or importance]
             ...

        **Summary of Trends:**
            Analyze all survey responses and identify key trends or points of interest.
            Give short explanations of each trend in the following format:
                 - [Trend]: [Explanation of the trend and its implications]
                 - [Trend]: [Explanation of the trend and its implications]
             ...
  `;
};

export default fetchSurveyPrompt;
