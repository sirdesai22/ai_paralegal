"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { Bot, Building2, FileText, TrendingUp, AlertCircle, CheckCircle2, Upload, BookOpen, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { AI_AGENTS, getAgentsByCategory } from "../data/ai-agents";
import { aiAnalysisService } from "../services/ai-analysis-service";
import { AIAgent, AnalysisRequest, AnalysisResult } from "../types/ai-agents";

interface ReferenceDocument {
  id: string;
  name: string;
  category: string;
  selected: boolean;
}

export function CorporateAnalysis() {
  const [query, setQuery] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>("inlegalbert-corporate");
  const [documentType, setDocumentType] = useState("");
  const [specificInstructions, setSpecificInstructions] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [referenceDocuments, setReferenceDocuments] = useState<ReferenceDocument[]>([
    { id: "REF-001", name: "California Civil Code § 1550-1701.pdf", category: "Contract Law", selected: false },
    { id: "REF-002", name: "SEC Regulations Handbook.pdf", category: "Corporate Compliance", selected: false },
    { id: "REF-003", name: "Delaware General Corporation Law.pdf", category: "Corporate Law", selected: false },
    { id: "REF-004", name: "SOX Compliance Guidelines.pdf", category: "Compliance", selected: false },
    { id: "REF-005", name: "Indian Companies Act 2013.pdf", category: "Indian Law", selected: false },
    { id: "REF-006", name: "SEBI Regulations Compendium.pdf", category: "Indian Compliance", selected: false },
  ]);

  const corporateAgents = getAgentsByCategory('corporate');
  const inlegalbertAgents = corporateAgents.filter(agent => agent.modelType === 'inlegalbert');
  const indianLegalGPTAgents = corporateAgents.filter(agent => agent.modelType === 'indian-legal-gpt');
  const tinyllamaAgents = corporateAgents.filter(agent => agent.modelType === 'tinyllama-qlora');
  const otherAgents = corporateAgents.filter(agent => agent.modelType === 'custom');

  const handleAnalyze = async () => {
    if (!selectedAgent || (!query && !uploadedFile)) {
      alert("Please select an agent and provide document content");
      return;
    }

    setIsAnalyzing(true);
    try {
      const request: AnalysisRequest = {
        agentId: selectedAgent,
        documentType: documentType || "Corporate Document",
        documentText: query,
        uploadedFile: uploadedFile || undefined,
        referenceDocumentIds: referenceDocuments.filter(doc => doc.selected).map(doc => doc.id),
        specificInstructions: specificInstructions || undefined
      };

      const result = await aiAnalysisService.analyzeDocument(request);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const toggleReferenceDocument = (id: string) => {
    setReferenceDocuments(referenceDocuments.map(doc =>
      doc.id === id ? { ...doc, selected: !doc.selected } : doc
    ));
  };

  const selectedReferenceDocs = referenceDocuments.filter(doc => doc.selected);

  const renderAgentCard = (agent: AIAgent) => (
    <Card
      key={agent.id}
      className={`cursor-pointer transition-all ${
        selectedAgent === agent.id ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => setSelectedAgent(agent.id)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              agent.modelType === 'inlegalbert' ? 'bg-blue-100 text-blue-600' :
              agent.modelType === 'indian-legal-gpt' ? 'bg-green-100 text-green-600' :
              agent.modelType === 'tinyllama-qlora' ? 'bg-purple-100 text-purple-600' :
              'bg-primary/10 text-primary'
            }`}>
              {agent.modelType === 'indian-legal-gpt' ? (
                <Sparkles className="h-5 w-5" />
              ) : agent.modelType === 'tinyllama-qlora' ? (
                <Sparkles className="h-5 w-5" />
              ) : (
                <Bot className="h-5 w-5" />
              )}
            </div>
            <div>
              <CardTitle className="text-base">{agent.name}</CardTitle>
              <CardDescription className="text-sm">{agent.description}</CardDescription>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={
              agent.modelType === 'inlegalbert' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              agent.modelType === 'indian-legal-gpt' ? 'bg-green-50 text-green-700 border-green-200' :
              agent.modelType === 'tinyllama-qlora' ? 'bg-purple-50 text-purple-700 border-purple-200' :
              'bg-gray-50 text-gray-700 border-gray-200'
            }
          >
            {agent.modelType === 'inlegalbert' ? 'InLegalBERT' :
             agent.modelType === 'indian-legal-gpt' ? 'Indian Legal GPT' :
             agent.modelType === 'tinyllama-qlora' ? 'TinyLlama QLoRA' : 'Custom'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Specialty:</span>
            <span className="text-right">{agent.specialty}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Accuracy:</span>
            <Badge variant="outline">{agent.accuracy}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Cases Analyzed:</span>
            <span>{agent.cases.toLocaleString()}</span>
          </div>
        </div>

        <Button 
          className="w-full" 
          variant={selectedAgent === agent.id ? "default" : "outline"}
          onClick={() => setSelectedAgent(agent.id)}
        >
          <Building2 className="mr-2 h-4 w-4" />
          {selectedAgent === agent.id ? "Selected" : "Select Agent"}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2>Corporate Legal Analysis</h2>
        <p className="text-muted-foreground">AI-powered analysis for corporate legal matters</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{corporateAgents.length}</div>
            <p className="text-xs text-muted-foreground">AI models ready</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">InLegalBERT</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{inlegalbertAgents.length}</div>
            <p className="text-xs text-muted-foreground">Advanced models</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Indian Legal GPT</CardTitle>
            <Sparkles className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{indianLegalGPTAgents.length}</div>
            <p className="text-xs text-muted-foreground">Indian law specialists</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Success Rate</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">97.5%</div>
            <p className="text-xs text-muted-foreground">Across all models</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="analyze">Analyze Document</TabsTrigger>
          <TabsTrigger value="reference">Reference Docs</TabsTrigger>
          <TabsTrigger value="results">Analysis Results</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3>InLegalBERT Agents</h3>
              <p className="text-sm text-muted-foreground">
                Advanced legal language models for comprehensive corporate document analysis
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {inlegalbertAgents.map(agent => renderAgentCard(agent))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3>Indian Legal GPT Agents</h3>
              <p className="text-sm text-muted-foreground">
                Specialized in Indian corporate law, SEBI regulations, and Companies Act compliance
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {indianLegalGPTAgents.map(agent => renderAgentCard(agent))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3>TinyLlama QLoRA Agents</h3>
              <p className="text-sm text-muted-foreground">
                Efficient AI agents fine-tuned with QLoRA for fast legal document analysis
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tinyllamaAgents.map(agent => renderAgentCard(agent))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3>Specialized Agents</h3>
              <p className="text-sm text-muted-foreground">
                Custom AI agents for specific corporate legal functions
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {otherAgents.map(agent => renderAgentCard(agent))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analyze" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Analysis</CardTitle>
              <CardDescription>Upload or paste corporate document text for AI analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label>Document Type</label>
                <Input 
                  placeholder="e.g., Merger Agreement, Stock Purchase Agreement" 
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label>Upload Document</label>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="flex-1"
                  />
                  {uploadedFile && (
                    <Button variant="outline" size="sm" onClick={() => setUploadedFile(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {uploadedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {uploadedFile.name}
                  </p>
                )}
              </div>

              <div className="relative flex items-center gap-4 py-2">
                <div className="flex-1 border-t border-border"></div>
                <span className="text-sm text-muted-foreground">OR</span>
                <div className="flex-1 border-t border-border"></div>
              </div>

              <div className="space-y-2">
                <label>Paste Document Text</label>
                <Textarea
                  placeholder="Paste document text here..."
                  className="min-h-[200px]"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label>Select AI Agent</label>
                <select 
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                >
                  {corporateAgents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} ({agent.modelType === 'inlegalbert' ? 'InLegalBERT' : 
                                    agent.modelType === 'indian-legal-gpt' ? 'Indian Legal GPT' : 
                                    agent.modelType === 'tinyllama-qlora' ? 'TinyLlama QLoRA' : 'Custom'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label>Specific Analysis Instructions (Optional)</label>
                <Textarea
                  placeholder="What specific aspects would you like the AI to focus on?"
                  className="min-h-[100px]"
                  value={specificInstructions}
                  onChange={(e) => setSpecificInstructions(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label>Selected Reference Documents ({selectedReferenceDocs.length})</label>
                {selectedReferenceDocs.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedReferenceDocs.map((doc) => (
                      <Badge key={doc.id} variant="secondary">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {doc.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No reference documents selected. Go to "Reference Docs" tab to select documents for context.
                  </p>
                )}
              </div>

              <Button 
                className="w-full" 
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!query && !uploadedFile)}
              >
                {isAnalyzing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-4 w-4" />
                    Analyze with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reference" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reference Documents</CardTitle>
              <CardDescription>
                Upload legal rules, regulations, and statutes that AI agents can use for analysis context
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Reference Document
              </Button>

              <div className="space-y-2">
                <label>Available Reference Documents</label>
                <p className="text-sm text-muted-foreground">
                  Select documents to use as reference context for AI analysis
                </p>
              </div>

              <ScrollArea className="h-[400px] rounded-md border p-4">
                <div className="space-y-3">
                  {referenceDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        checked={doc.selected}
                        onCheckedChange={() => toggleReferenceDocument(doc.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">{doc.name}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {doc.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm">
                  <strong>Selected: {selectedReferenceDocs.length} document(s)</strong>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  These documents will be used as reference context when analyzing corporate documents
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {analysis ? (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>
                  AI-generated insights and recommendations by {corporateAgents.find(a => a.id === analysis.agentId)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground">{analysis.summary}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Risk Score</p>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">{analysis.riskScore}/100</div>
                      <Badge variant={
                        analysis.riskScore >= 80 ? "destructive" :
                        analysis.riskScore >= 60 ? "default" : "secondary"
                      }>
                        {analysis.riskScore >= 80 ? "High Risk" :
                         analysis.riskScore >= 60 ? "Moderate Risk" : "Low Risk"}
                      </Badge>
                    </div>
                  </div>
                  {analysis.complianceScore && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Compliance Score</p>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl">{analysis.complianceScore}/100</div>
                        <Badge variant="outline" className={
                          analysis.complianceScore >= 90 ? "bg-green-50 text-green-700 border-green-200" :
                          analysis.complianceScore >= 80 ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                          "bg-red-50 text-red-700 border-red-200"
                        }>
                          {analysis.complianceScore >= 90 ? "Excellent" :
                           analysis.complianceScore >= 80 ? "Good" : "Needs Improvement"}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h4>Key Findings</h4>
                  {analysis.keyFindings.map((finding, index) => (
                    <div key={index} className="rounded-lg border p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        {finding.type === "positive" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : finding.type === "warning" ? (
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                        <h4>{finding.title}</h4>
                        <Badge variant="outline" className="ml-auto">
                          {finding.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{finding.description}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4>Recommendations</h4>
                  <div className="space-y-2">
                    {analysis.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4>Legal Citations</h4>
                  <div className="space-y-2">
                    {analysis.citations.map((citation, index) => (
                      <div key={index} className="text-sm text-muted-foreground border-l-4 border-primary pl-3 py-1">
                        {citation}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="mb-2">No analysis results yet</h3>
                <p className="text-sm text-muted-foreground">
                  Use the "Analyze Document" tab to start AI analysis
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}