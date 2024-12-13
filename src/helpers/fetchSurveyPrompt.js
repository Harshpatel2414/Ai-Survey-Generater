const fetchSurveyPrompt = (surveyQuestions, characteristics, individuals) => {
  return `
        You are tasked with generating realistic and insightful survey responses based on the provided question.

        **Survey Question:**
        ${surveyQuestions || "No specific question provided. Please generate responses based on general themes."}

        **Respondent Characteristics:**
        ${characteristics || "No specific characteristics provided. Assume a general audience."}

        **Requirements:**
        - Generate **${individuals || 10} profiles** in **Markdown format**.
        - Each profile must include an index number (e.g., Profile 1, Profile 2, etc.).
        - **Format** each profile as follows:

          **Profile [Number]:**  
          - **Name**:  
          - **Age**:  
          - **Gender**:  
          - **Country**:  
          - [Include attributes relevant to the survey questions]

        **Summary Totals:**  
        Generate a table summarizing the responses in Markdown format:

          | Reason Category       | Total Mentions |
          |-----------------------|----------------|
          | **[Category]**        |                |
          | - [Subcategory]       | [Count]        |
          | - [Subcategory]       | [Count]        |
          | **[Category]**        |                |
          | - [Subcategory]       | [Count]        |
          | - [Subcategory]       | [Count]        |

        Ensure the **total mentions equal the number of profiles** (${individuals || 10}).

        **Mentions by Type:**  
        Provide a detailed breakdown of preferences in Markdown, such as:  
        - **[Mention Category]**: [Total Count]  
        - **[Mention Category]**: [Total Count]  
        ...

        **Key Categories of Preferences:**  
        Analyze responses and explain key categories of preferences in Markdown format:  
        - **[Subcategory]**: [Explanation of relevance]  
        - **[Subcategory]**: [Explanation of relevance]  
        ...

        **Summary of Trends:**  
        Analyze all responses to identify trends and present them in Markdown format:  
        - **[Trend]**: [Explanation of the trend]  
        - **[Trend]**: [Explanation of the trend]  
  `;
};

export default fetchSurveyPrompt;
