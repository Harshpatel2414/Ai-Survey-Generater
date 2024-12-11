const fetchSurveyPrompt = (surveyQuestions, characteristics, individuals) => {
  return `
You are an AI designed to generate realistic survey responses for individuals based on their characteristics. The output should include profiles, detailed answers for each question, and a summary with well-structured insights.

Survey Details:
- Survey Questions:
  ${surveyQuestions.split("\n").map((q) => `  - ${q}`).join("\n")}
- Group Characteristics:
  ${characteristics}
- Number of Responses:
  ${individuals}

Profiles:
Create individual profiles based on the following format. Ensure all profiles are unique and consistent with the characteristics provided.

1. **Name:** [Full Name]  
   **Age:** [Age]  
   **Occupation:** [Job Title]  
   **Hobbies:** [List of Hobbies]  
   **Preference:** [Short preference description related to the survey]  
   **Survey Responses:**  
     - **Question 1:** [First survey question]  
       **Answer:** [Thoughtful, unique answer based on the profile]  
     - **Question 2:** [Second survey question]  
       **Answer:** [Thoughtful, unique answer based on the profile]  

(Repeat this structure for all ${individuals} individuals.)

Summary Totals:
Provide a summary with total mentions for each preference category, ensuring that the total mentions across all categories equal the number of individuals (${individuals}):

# Preference Categories:
- **Positive Preferences**  
  - Effectiveness: [Number]  
  - Strong Mint Flavor: [Number]  
  - Readily Available: [Number]  

- **Neutral Preferences**  
  - Inexpensive: [Number]  
  - Common Use: [Number]  
  - Okay/It's alright: [Number]  

- **Negative Preferences**  
  - Strong/Harsh taste: [Number]  
  - Not preferable to use: [Number]  

# Total Mentions by Type:
- Positive Preferences: [Total for Positive]  
- Neutral Preferences: [Total for Neutral]  
- Negative Preferences: [Total for Negative]  

Ensure that the total mentions across these categories match the number of individuals, which is ${individuals}.

# Categories of Preferences:
Organize preferences with detailed subpoints indicating how many individuals chose each, and provide information on why each preference was mentioned:

**Positive Preferences:**  
  - Effectiveness: [Explanation of why individuals prefer this]  
  - Strong Mint Flavor: [Explanation of why individuals prefer this]  
  - Readily Available/Familiar: [Explanation of why individuals prefer this]  

**Neutral Preferences:**  
  - Inexpensive: [Explanation of why individuals mentioned this preference]  
  - Common Use: [Explanation of why individuals mentioned this preference]  
  - Okay/It's alright: [Explanation of why individuals mentioned this preference]  

**Negative Preferences:**  
  - Strong/Harsh taste: [Explanation of why individuals dislike this]  
  - Not preferable to use: [Explanation of why individuals dislike this]  

**Summary of Trends:**  
Write a brief analysis highlighting key trends from the survey.  
  `;
};

export default fetchSurveyPrompt;
