interface FlaskAPIRequest {
  question: string;
  document_type?: string;
  specific_instructions?: string;
}

interface FlaskAPIResponse {
  question: string;
  answer: string;
  status: string;
  error?: string;
}

class FlaskAPIService {
  private baseURL: string;

  constructor() {
    this.baseURL = 'http://localhost:5000/api';
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Flask API health check failed:', error);
      return false;
    }
  }

  async analyzeWithTinyLlama(request: FlaskAPIRequest): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: this.buildQuestion(request)
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: FlaskAPIResponse = await response.json();
      
      if (data.status === 'success') {
        return data.answer;
      } else {
        throw new Error(data.error || 'Unknown error from Flask API');
      }
    } catch (error) {
      console.error('Flask API analysis failed:', error);
      throw new Error(`TinyLlama analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildQuestion(request: FlaskAPIRequest): string {
    let question = request.question;
    
    if (request.document_type) {
      question = `Document Type: ${request.document_type}\n${question}`;
    }
    
    if (request.specific_instructions) {
      question = `${question}\n\nSpecific Instructions: ${request.specific_instructions}`;
    }
    
    return question;
  }

  async getSampleQuestions(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseURL}/sample-questions`);
      if (response.ok) {
        const data = await response.json();
        return data.questions || [];
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch sample questions:', error);
      return [];
    }
  }
}

export const flaskAPIService = new FlaskAPIService();