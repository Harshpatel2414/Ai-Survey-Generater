const fetchSurveyPrompt = (surveyQuestions, characteristics, individuals) => {
  return `
        You are tasked with generating realistic and insightful survey responses based on the provided question.

        **Survey Question:**
        ${surveyQuestions || "No specific question provided. Please generate responses based on general themes."}

        **Respondent Characteristics:**
        ${characteristics || "No specific characteristics provided. Assume a general audience."}

        Ensure the entire response follows the order:
          1. Summary Section first.
          2. Profiles Section second.

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
        - Analyze the survey responses and generate a **breakdown of responses** dynamically in the following table format.
        - The **categories** and **subcategories** must be inferred based on the survey question and responses.
        - Ensure the **total mentions match the number of profiles** (${individuals || 10}).  For example, if 5 people are surveyed, the breakdown should reflect a total of 5 mentions across the options, with categories based on the question.
        Note : Do not give more mentions than the number of profiles. only one mention per profile and the total mentions should be equal to the number of profiles.
        
          | Reason Category       | Total Mentions |
          |-----------------------|----------------|
          | **[Category]**        |                |
          | - [Subcategory]       | [Count]        |
          | - [Subcategory]       | [Count]        |
          | **[Category]**        |                |
          | - [Subcategory]       | [Count]        |
          | - [Subcategory]       | [Count]        |

        #### Example (if the question is about famous players):  
          | Reason Category       | Total Mentions |  
          |-----------------------|----------------|  
          | **Player A**          |                |  
          | - Skill 1             | 4              |  
          | - Skill 2             | 2              |  
          | **Player B**          |                |  
          | - Skill 1             | 3              |  
          | - Skill 2             | 1              |  

          --- 

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
