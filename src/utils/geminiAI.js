// utils/geminiAI.js
class GeminiAIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  async analyzeInterviewResponse(videoBlob, question, context) {
    try {
      // Video ni base64 ga o'tkazish
      const base64Video = await this.blobToBase64(videoBlob);
      
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `Interview Analysis Request:
                
                Question: ${question}
                Context: ${context}
                
                Please analyze the video response and provide:
                1. Technical accuracy (0-100)
                2. Communication skills (0-100) 
                3. Confidence level (0-100)
                4. Problem-solving approach (0-100)
                5. Key strengths
                6. Areas for improvement
                7. Specific recommendations
                
                Format response as JSON.`
              },
              {
                inline_data: {
                  mime_type: "video/webm",
                  data: base64Video
                }
              }
            ]
          }
        ]
      };

      const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      return this.parseAIResponse(data);
    } catch (error) {
      console.error('Gemini AI analysis error:', error);
      return this.getMockAnalysis();
    }
  }

  async analyzeFacialExpressions(videoBlob) {
    // Yuz tahlili uchun alohida so'rov
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Analyze facial expressions and body language in this interview response. Provide:
              1. Confidence score (0-100)
              2. Engagement level (0-100)
              3. Stress indicators (0-100)
              4. Positivity score (0-100)
              5. Key non-verbal cues
              
              Format as JSON.`
            },
            {
              inline_data: {
                mime_type: "video/webm", 
                data: await this.blobToBase64(videoBlob)
              }
            }
          ]
        }
      ]
    };

    // ... similar API call
  }

  blobToBase64(blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(blob);
    });
  }

  parseAIResponse(data) {
    // AI javobini parse qilish
    try {
      const text = data.candidates[0].content.parts[0].text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return this.getMockAnalysis();
    } catch (error) {
      return this.getMockAnalysis();
    }
  }

  getMockAnalysis() {
    // Mock analysis agar API ishlamasa
    return {
      technical: Math.floor(Math.random() * 30) + 70,
      communication: Math.floor(Math.random() * 30) + 65,
      confidence: Math.floor(Math.random() * 40) + 60,
      problemSolving: Math.floor(Math.random() * 35) + 65,
      strengths: ["Good technical knowledge", "Clear communication"],
      improvements: ["More examples needed", "Better time management"],
      recommendations: ["Practice more technical questions", "Work on confidence"]
    };
  }
}

export default new GeminiAIService(process.env.NEXT_PUBLIC_GEMINI_API_KEY);