const fetchSurveyPrompt = (surveyQuestions, characteristics, individuals) => {
  return `
        You are tasked with generating realistic and insightful survey responses based on the provided question.

        **Survey Question:**
        ${surveyQuestions || "No specific question provided. Please generate responses based on general themes."}

        **Respondent Characteristics:**
        ${characteristics || "No specific characteristics provided. Assume a general audience."}

        **Requirements:**
         1. Generate ${individuals || 10} profiles. Each profile must include An index number for each individual. (e.g., Profile #):

            1)  - Name
                - Age
                - Gender
                - Country
                - Dynamic Relevant attributes based on the question

            upto number of ${individuals || 10}.

        2. **Mentions and Totals:**
           - The total number of mentions in the **Summary Table** must **exactly match the number of profiles (${individuals || 10})**.

        3. **Summary Table:**
           - Create a table summarizing the responses in the following format:
             
             Reason Category          Total Mentions
             - [Subcategory]         [Mentions Count]
             - [Subcategory]         [Mentions Count]
             ...

           - Ensure the total mentions equal the number of profiles (${individuals || 10}) and each profile next to it not inline atributes.

        4. **Mentions by Type:**
           - Provide a detailed breakdown of preferences by type in the following format:
             - [Mention Category]: [Total Count]
             - [Mention Category]: [Total Count]
             ...

        5. **Key Categories of Preferences:**
           - Analyze the responses to identify key categories of preferences.
           - Use the following format to explain:
             - [Subcategory]: [Explanation of its relevance or importance]
             - [Subcategory]: [Explanation of its relevance or importance]
             ...

        6. **Summary of Trends:**
           - Analyze all survey responses and identify key trends or points of interest.
           - Provide a concise, insightful summary highlighting notable findings.

        **Important Notes:**
        - Ensure all profiles, mentions, and trends are **directly tied to the survey question**.
        - Avoid stereotypes or irrelevant assumptions unrelated to the survey or characteristics.
        - Provide **complete responses without truncation**. If output length is constrained, prioritize profile details, summary totals, and trends.
  `;
};

export default fetchSurveyPrompt;
