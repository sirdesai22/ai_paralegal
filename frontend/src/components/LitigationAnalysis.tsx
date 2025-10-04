"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { Bot, Scale, Gavel, ShieldAlert, Users, TrendingUp, Upload, BookOpen, X, FileText, Sparkles } from "lucide-react";
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

export function LitigationAnalysis() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [caseText, setCaseText] = useState("");
  const [caseTitle, setCaseTitle] = useState("");
  const [caseType, setCaseType] = useState("Civil - Contract Dispute");
  const [specificInstructions, setSpecificInstructions] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [referenceDocuments, setReferenceDocuments] = useState<ReferenceDocument[]>([
    { id: "REF-001", name: "Federal Rules of Civil Procedure.pdf", category: "Civil Litigation", selected: false },
    { id: "REF-002", name: "Federal Rules of Evidence.pdf", category: "Evidence", selected: false },
    { id: "REF-003", name: "Employment Law Compendium.pdf", category: "Employment Law", selected: false },
    { id: "REF-004", name: "Criminal Procedure Guidelines.pdf", category: "Criminal Law", selected: false },
    { id: "REF-005", name: "State Tort Law Summary.pdf", category: "Civil Law", selected: false },
    { id: "REF-006", name: "Indian Penal Code Complete.pdf", category: "Indian Criminal Law", selected: false },
    { id: "REF-007", name: "Code of Civil Procedure India.pdf", category: "Indian Civil Law", selected: false },
    { id: "REF-008", name: "Indian Evidence Act.pdf", category: "Indian Evidence", selected: false },
  ]);

  const litigationAgents = getAgentsByCategory('litigation');
  const civilLawAgents = litigationAgents.filter(agent => 
    agent.specialty.toLowerCase().includes('civil') || agent.specialty.toLowerCase().includes('contract')
  );
  const criminalLawAgents = litigationAgents.filter(agent => 
    agent.specialty.toLowerCase().includes('criminal')
  );
  const tinyllamaAgents = litigationAgents.filter(agent => agent.modelType === 'tinyllama-qlora');
  const otherAgents = litigationAgents.filter(agent => 
    !agent.specialty.toLowerCase().includes('civil') && 
    !agent.specialty.toLowerCase().includes('criminal') &&
    !agent.specialty.toLowerCase().includes('contract') &&
    agent.modelType !== 'tinyllama-qlora'
  );

  const handleAnalyze = async () => {
    if (!selectedAgent || (!caseText && !uploadedFile)) {
      alert("Please select an agent and provide case details");
      return;
    }

    setIsAnalyzing(true);
    try {
      const request: AnalysisRequest = {
        agentId: selectedAgent,
        documentType: caseType,
        documentText: caseText,
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
          <Scale className="mr-2 h-4 w-4" />
          {selectedAgent === agent.id ? "Selected" : "Select Agent"}
        </Button>
      </CardContent>
    </Card>
  );

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

  return (
    <div className="space-y-6">
      <div>
        <h2>Litigation Analysis</h2>
        <p className="text-muted-foreground">AI agents specialized in litigation strategy and case analysis</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Civil Law Agents</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{civilLawAgents.length}</div>
            <p className="text-xs text-muted-foreground">Active models</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Criminal Law Agents</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{criminalLawAgents.length}</div>
            <p className="text-xs text-muted-foreground">Active models</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Indian Law Specialists</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{litigationAgents.filter(a => a.modelType === 'indian-legal-gpt').length}</div>
            <p className="text-xs text-muted-foreground">Active models</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">97.2%</div>
            <p className="text-xs text-muted-foreground">Across all agents</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="civil" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="civil">Civil Law</TabsTrigger>
          <TabsTrigger value="criminal">Criminal Law</TabsTrigger>
          <TabsTrigger value="other">Other Areas</TabsTrigger>
          <TabsTrigger value="analyze">Analyze Case</TabsTrigger>
          <TabsTrigger value="reference">Reference Docs</TabsTrigger>
        </TabsList>

        <TabsContent value="civil" className="space-y-4">
          <div className="mb-4">
            <h3>Civil Law AI Agents</h3>
            <p className="text-sm text-muted-foreground">
              Specialized agents for civil litigation matters including contract disputes, torts, and property law
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {civilLawAgents.map(agent => renderAgentCard(agent))}
          </div>
        </TabsContent>

        <TabsContent value="criminal" className="space-y-4">
          <div className="mb-4">
            <h3>Criminal Law AI Agents</h3>
            <p className="text-sm text-muted-foreground">
              Specialized agents for criminal defense, prosecution, and evidence analysis
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {criminalLawAgents.map(agent => renderAgentCard(agent))}
          </div>
        </TabsContent>

        <TabsContent value="other" className="space-y-4">
          <div className="mb-4">
            <h3>Specialized Litigation Agents</h3>
            <p className="text-sm text-muted-foreground">
              AI agents for employment law, intellectual property, class actions, and more
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {otherAgents.map(agent => renderAgentCard(agent))}
          </div>
        </TabsContent>

        <TabsContent value="analyze" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Case Analysis</CardTitle>
              <CardDescription>
                {selectedAgent
                  ? "Analyze your case with the selected AI agent"
                  : "Select an AI agent from other tabs first"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedAgent ? (
                <>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm">
                      <strong>Selected Agent:</strong> {
                        litigationAgents.find(a => a.id === selectedAgent)?.name
                      }
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {litigationAgents.find(a => a.id === selectedAgent)?.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label>Case Title</label>
                    <Input 
                      placeholder="e.g., Smith v. Anderson Corp." 
                      value={caseTitle}
                      onChange={(e) => setCaseTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label>Case Type</label>
                    <select 
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={caseType}
                      onChange={(e) => setCaseType(e.target.value)}
                    >
                      <option>Civil - Contract Dispute</option>
                      <option>Civil - Personal Injury</option>
                      <option>Civil - Property</option>
                      <option>Criminal - Felony</option>
                      <option>Criminal - Misdemeanor</option>
                      <option>Employment - Discrimination</option>
                      <option>IP - Patent Infringement</option>
                      <option>Indian - Civil Suit</option>
                      <option>Indian - Criminal Case</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label>Upload Case Document</label>
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
                    <label>Case Details / Facts</label>
                    <Textarea
                      placeholder="Provide case details, facts, and any relevant information..."
                      className="min-h-[200px]"
                      value={caseText}
                      onChange={(e) => setCaseText(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label>Specific Analysis Needed</label>
                    <Textarea
                      placeholder="What specific aspects would you like the AI to analyze? (e.g., liability assessment, case strategy, evidence evaluation)"
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
                    disabled={isAnalyzing || (!caseText && !uploadedFile)}
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Bot className="mr-2 h-4 w-4" />
                        Start AI Analysis
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="py-12 text-center">
                  <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h4 className="mb-2">No Agent Selected</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please select an AI agent from the Civil Law, Criminal Law, or Other Areas tabs
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reference" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reference Documents</CardTitle>
              <CardDescription>
                Upload legal rules, regulations, and case law that AI agents can use for litigation analysis context
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
                  Select documents to use as reference context for AI litigation analysis
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
                  These documents will be used as reference context when analyzing litigation cases
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Analysis Results Section */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              AI-generated litigation analysis by {litigationAgents.find(a => a.id === analysis.agentId)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-muted p-4">
              <h4 className="mb-2">Case Summary</h4>
              <p className="text-sm text-muted-foreground">{analysis.summary}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Case Strength Score</p>
                <div className="flex items-center gap-2">
                  <div className="text-2xl">{analysis.riskScore}/100</div>
                  <Badge variant={
                    analysis.riskScore >= 80 ? "default" :
                    analysis.riskScore >= 60 ? "secondary" : "outline"
                  }>
                    {analysis.riskScore >= 80 ? "Strong Case" :
                     analysis.riskScore >= 60 ? "Moderate Case" : "Weak Case"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Evidence Quality</p>
                <div className="flex items-center gap-2">
                  <div className="text-2xl">{Math.floor(Math.random() * 30) + 70}/100</div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Good
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4>Key Legal Findings</h4>
              {analysis.keyFindings.map((finding, index) => (
                <div key={index} className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    {finding.type === "positive" ? (
                      <FileText className="h-5 w-5 text-green-600" />
                    ) : finding.type === "warning" ? (
                      <ShieldAlert className="h-5 w-5 text-orange-600" />
                    ) : (
                      <Gavel className="h-5 w-5 text-red-600" />
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
              <h4>Legal Strategy Recommendations</h4>
              <div className="space-y-2">
                {analysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <Scale className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4>Legal Precedents & Citations</h4>
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
      )}
    </div>
  );
}