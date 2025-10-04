import { AIAgent } from "../types/ai-agents";

export const AI_AGENTS: AIAgent[] = [
  // InLegalBERT Agents
  {
    id: "inlegalbert-corporate",
    name: "InLegalBERT - Corporate",
    description: "Advanced legal language model for corporate document analysis",
    specialty: "Contract Review, Compliance Analysis, Corporate Governance",
    accuracy: "98.5%",
    status: "active",
    cases: 3420,
    category: "corporate",
    modelType: "inlegalbert",
    supportedDocumentTypes: [
      "Merger Agreement",
      "Stock Purchase Agreement",
      "Service Agreement",
      "Employment Contract",
      "NDA",
      "Corporate Bylaws"
    ],
    analysisCapabilities: [
      "Contract clause analysis",
      "Risk assessment",
      "Compliance checking",
      "Term identification",
      "Legal precedent matching"
    ]
  },
  {
    id: "inlegalbert-civil",
    name: "InLegalBERT - Civil Law",
    description: "Specialized in civil litigation case analysis and strategy",
    specialty: "Contract Disputes, Tort Claims, Property Law",
    accuracy: "98.2%",
    status: "active",
    cases: 2893,
    category: "litigation",
    modelType: "inlegalbert",
    supportedDocumentTypes: [
      "Complaint",
      "Motion to Dismiss",
      "Discovery Documents",
      "Evidence Files",
      "Legal Briefs"
    ],
    analysisCapabilities: [
      "Case strategy analysis",
      "Evidence evaluation",
      "Legal argument assessment",
      "Precedent research",
      "Liability analysis"
    ]
  },
  {
    id: "inlegalbert-criminal",
    name: "InLegalBERT - Criminal Law",
    description: "Criminal defense and prosecution case analysis",
    specialty: "Evidence Review, Case Law Research, Criminal Procedure",
    accuracy: "97.9%",
    status: "active",
    cases: 1764,
    category: "litigation",
    modelType: "inlegalbert",
    supportedDocumentTypes: [
      "Criminal Complaint",
      "Evidence Reports",
      "Witness Statements",
      "Police Reports",
      "Forensic Analysis"
    ],
    analysisCapabilities: [
      "Evidence admissibility",
      "Constitutional rights analysis",
      "Sentencing guidelines",
      "Plea bargain evaluation",
      "Appeal strategy"
    ]
  },

  // Indian Legal GPT Agents
  {
    id: "indian-legal-gpt-corporate",
    name: "Indian Legal GPT - Corporate",
    description: "Specialized in Indian corporate law and compliance regulations",
    specialty: "Indian Companies Act, SEBI Regulations, FEMA Compliance",
    accuracy: "96.8%",
    status: "active",
    cases: 2156,
    category: "corporate",
    modelType: "indian-legal-gpt",
    supportedDocumentTypes: [
      "Indian M&A Agreements",
      "SEBI Filing Documents",
      "ROC Compliance Forms",
      "FEMA Declaration",
      "Corporate Governance Reports"
    ],
    analysisCapabilities: [
      "Indian regulatory compliance",
      "SEBI guideline analysis",
      "Companies Act compliance",
      "FEMA regulation checking",
      "Indian case law precedent"
    ]
  },
  {
    id: "indian-legal-gpt-civil",
    name: "Indian Legal GPT - Civil Litigation",
    description: "Civil litigation analysis with focus on Indian legal system",
    specialty: "CPC, Indian Contract Act, Specific Relief Act",
    accuracy: "95.7%",
    status: "active",
    cases: 1872,
    category: "litigation",
    modelType: "indian-legal-gpt",
    supportedDocumentTypes: [
      "Indian Civil Suits",
      "Contract Agreements",
      "Property Documents",
      "Injunction Applications",
      "Appeal Memorandums"
    ],
    analysisCapabilities: [
      "CPC procedure analysis",
      "Indian contract law interpretation",
      "Property rights assessment",
      "Indian precedent research",
      "Court jurisdiction analysis"
    ]
  },
  {
    id: "indian-legal-gpt-criminal",
    name: "Indian Legal GPT - Criminal Law",
    description: "Criminal law analysis specialized in Indian Penal Code and CrPC",
    specialty: "IPC, CrPC, Evidence Act, Bail Applications",
    accuracy: "96.2%",
    status: "active",
    cases: 1432,
    category: "litigation",
    modelType: "indian-legal-gpt",
    supportedDocumentTypes: [
      "FIR Copies",
      "Charge Sheets",
      "Bail Applications",
      "Criminal Appeals",
      "Evidence Documents"
    ],
    analysisCapabilities: [
      "IPC section analysis",
      "CrPC procedure checking",
      "Bail probability assessment",
      "Evidence Act compliance",
      "Indian criminal precedent"
    ]
  },

  // TinyLlama QLoRA Agents
  {
    id: "tinyllama-corporate",
    name: "TinyLlama QLoRA - Corporate",
    description: "Efficient legal AI fine-tuned on comprehensive Indian corporate law",
    specialty: "Quick Contract Review, Compliance Checks, Document Analysis",
    accuracy: "95.2%",
    status: "active",
    cases: 892,
    category: "corporate",
    modelType: "tinyllama-qlora",
    supportedDocumentTypes: [
      "All Contract Types",
      "Corporate Documents",
      "Compliance Reports",
      "M&A Agreements",
      "Corporate Governance"
    ],
    analysisCapabilities: [
      "Fast document analysis",
      "Multi-domain legal knowledge",
      "Indian law compliance",
      "Risk identification",
      "Quick turnaround"
    ]
  },
  {
    id: "tinyllama-civil",
    name: "TinyLlama QLoRA - Civil Law",
    description: "Rapid civil litigation analysis with broad legal knowledge",
    specialty: "Contract Disputes, Civil Procedure, Property Matters",
    accuracy: "94.8%",
    status: "active",
    cases: 756,
    category: "litigation",
    modelType: "tinyllama-qlora",
    supportedDocumentTypes: [
      "Civil Suits",
      "Contract Agreements",
      "Property Documents",
      "Legal Notices",
      "Case Briefs"
    ],
    analysisCapabilities: [
      "Quick case assessment",
      "Multi-domain expertise",
      "Procedure analysis",
      "Evidence evaluation",
      "Fast response"
    ]
  },
  {
    id: "tinyllama-criminal",
    name: "TinyLlama QLoRA - Criminal Law",
    description: "Efficient criminal law analysis with comprehensive legal training",
    specialty: "IPC Analysis, Criminal Procedure, Evidence Review",
    accuracy: "95.1%",
    status: "active",
    cases: 623,
    category: "litigation",
    modelType: "tinyllama-qlora",
    supportedDocumentTypes: [
      "Criminal Complaints",
      "FIR Copies",
      "Evidence Documents",
      "Bail Applications",
      "Charge Sheets"
    ],
    analysisCapabilities: [
      "Quick legal analysis",
      "IPC section interpretation",
      "Procedure checking",
      "Evidence assessment",
      "Fast processing"
    ]
  },

  // Specialized Agents
  {
    id: "contract-analyzer",
    name: "Contract Analyzer AI",
    description: "Specialized in corporate contract review and risk assessment",
    specialty: "M&A, Commercial Agreements, Contract Risk",
    accuracy: "97.2%",
    status: "active",
    cases: 2156,
    category: "corporate",
    modelType: "custom",
    supportedDocumentTypes: [
      "All Contract Types",
      "Commercial Agreements",
      "M&A Documents",
      "Partnership Agreements"
    ],
    analysisCapabilities: [
      "Risk identification",
      "Clause standardization",
      "Negotiation points",
      "Industry benchmarking"
    ]
  },
  {
    id: "compliance-guardian",
    name: "Compliance Guardian",
    description: "Corporate compliance and regulatory analysis agent",
    specialty: "SEC, SOX, Corporate Governance, Regulatory Compliance",
    accuracy: "96.8%",
    status: "active",
    cases: 1892,
    category: "corporate",
    modelType: "custom",
    supportedDocumentTypes: [
      "Compliance Reports",
      "Regulatory Filings",
      "Audit Documents",
      "Governance Policies"
    ],
    analysisCapabilities: [
      "Regulatory compliance check",
      "Policy gap analysis",
      "Best practices recommendation",
      "Compliance risk assessment"
    ]
  }
];

export const getAgentsByCategory = (category: 'corporate' | 'litigation' | 'all') => {
  if (category === 'all') return AI_AGENTS;
  return AI_AGENTS.filter(agent => agent.category === category);
};

export const getAgentsByModelType = (modelType: 'inlegalbert' | 'indian-legal-gpt' | 'tinyllama-qlora' | 'all') => {
  if (modelType === 'all') return AI_AGENTS;
  return AI_AGENTS.filter(agent => agent.modelType === modelType);
};

export const findAgentById = (id: string) => {
  return AI_AGENTS.find(agent => agent.id === id);
};