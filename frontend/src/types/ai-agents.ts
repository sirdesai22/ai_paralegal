export interface AIAgent {
  id: string;
  name: string;
  description: string;
  specialty: string;
  accuracy: string;
  status: "active" | "inactive" | "maintenance";
  cases: number;
  category: "corporate" | "litigation" | "general";
  modelType: "inlegalbert" | "indian-legal-gpt" | "tinyllama-qlora" | "custom";
  supportedDocumentTypes: string[];
  analysisCapabilities: string[];
}

export interface AnalysisRequest {
  agentId: string;
  documentType: string;
  documentText?: string;
  uploadedFile?: File;
  referenceDocumentIds: string[];
  specificInstructions?: string;
}

export interface AnalysisResult {
  id: string;
  agentId: string;
  summary: string;
  keyFindings: AnalysisFinding[];
  riskScore: number;
  complianceScore?: number;
  recommendations: string[];
  citations: string[];
  timestamp: string;
}

export interface AnalysisFinding {
  type: "positive" | "warning" | "critical" | "info";
  title: string;
  description: string;
  severity?: "low" | "medium" | "high";
}