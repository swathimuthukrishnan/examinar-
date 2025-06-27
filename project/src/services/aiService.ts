export interface AIEvaluationRequest {
  question: string;
  studentAnswer: string;
  maxPoints: number;
}

export interface AIEvaluationResponse {
  score: number;
  feedback: string;
  suggestions: string[];
}

// Mock AI service - In production, this would connect to OpenAI API
export class AIEvaluationService {
  private static instance: AIEvaluationService;
  
  private constructor() {}
  
  static getInstance(): AIEvaluationService {
    if (!AIEvaluationService.instance) {
      AIEvaluationService.instance = new AIEvaluationService();
    }
    return AIEvaluationService.instance;
  }
  
  async evaluateSubjectiveAnswer(request: AIEvaluationRequest): Promise<AIEvaluationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock evaluation logic - In production, this would call OpenAI API
    const answerLength = request.studentAnswer.length;
    const hasKeywords = this.checkForKeywords(request.question, request.studentAnswer);
    
    let score = 0;
    let feedback = "";
    let suggestions: string[] = [];
    
    if (answerLength < 50) {
      score = Math.min(request.maxPoints * 0.3, 1);
      feedback = "Answer is too brief. More detailed explanation needed.";
      suggestions.push("Provide more comprehensive explanation");
      suggestions.push("Include specific examples");
    } else if (answerLength < 150) {
      score = Math.min(request.maxPoints * 0.6, 2);
      feedback = "Good attempt but could be more detailed.";
      suggestions.push("Expand on key concepts");
    } else {
      score = hasKeywords ? request.maxPoints : Math.min(request.maxPoints * 0.8, 2.5);
      feedback = hasKeywords 
        ? "Excellent comprehensive answer with good understanding."
        : "Good length but missing some key concepts.";
      if (!hasKeywords) {
        suggestions.push("Include more technical terminology");
      }
    }
    
    return {
      score: Math.round(score * 10) / 10,
      feedback,
      suggestions
    };
  }
  
  private checkForKeywords(question: string, answer: string): boolean {
    const questionLower = question.toLowerCase();
    const answerLower = answer.toLowerCase();
    
    // Define keyword mappings for different topics
    const keywordMappings: { [key: string]: string[] } = {
      'closure': ['closure', 'scope', 'lexical', 'function', 'variable', 'encapsulation'],
      'database': ['sql', 'nosql', 'relational', 'document', 'acid', 'consistency', 'scalability'],
      'javascript': ['javascript', 'js', 'function', 'variable', 'object', 'prototype'],
      'api': ['api', 'rest', 'http', 'endpoint', 'request', 'response']
    };
    
    for (const [topic, keywords] of Object.entries(keywordMappings)) {
      if (questionLower.includes(topic)) {
        const foundKeywords = keywords.filter(keyword => answerLower.includes(keyword));
        return foundKeywords.length >= 2;
      }
    }
    
    return false;
  }
  
  async batchEvaluate(requests: AIEvaluationRequest[]): Promise<AIEvaluationResponse[]> {
    const results = await Promise.all(
      requests.map(request => this.evaluateSubjectiveAnswer(request))
    );
    return results;
  }
}

// Production implementation would look like this:
/*
export class OpenAIEvaluationService {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async evaluateSubjectiveAnswer(request: AIEvaluationRequest): Promise<AIEvaluationResponse> {
    const prompt = `
      Evaluate the following student answer for the given question.
      
      Question: ${request.question}
      Student Answer: ${request.studentAnswer}
      Maximum Points: ${request.maxPoints}
      
      Please provide:
      1. A score out of ${request.maxPoints} points
      2. Constructive feedback
      3. Suggestions for improvement
      
      Respond in JSON format with fields: score, feedback, suggestions
    `;
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert educator evaluating student responses. Be fair, constructive, and provide specific feedback.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        })
      });
      
      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      
      return {
        score: Math.min(result.score, request.maxPoints),
        feedback: result.feedback,
        suggestions: result.suggestions || []
      };
    } catch (error) {
      console.error('AI Evaluation Error:', error);
      // Fallback to basic evaluation
      return {
        score: request.maxPoints * 0.5,
        feedback: 'Unable to evaluate automatically. Manual review required.',
        suggestions: ['Please review manually']
      };
    }
  }
}
*/