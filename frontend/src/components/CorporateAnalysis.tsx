"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import {
  Bot,
  Building2,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Upload,
  BookOpen,
  X,
} from "lucide-react";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { useFileContext } from "../contexts/FileContext";
import { Loader2 } from "lucide-react";

interface ReferenceDocument {
  id: string;
  name: string;
  category: string;
  selected: boolean;
}

export function CorporateAnalysis() {
  const [query, setQuery] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const referenceInputRef = useRef<HTMLInputElement>(null);
  const {
    uploadedFiles,
    addFile,
    removeFile,
    isUploading,
    toggleFileSelection,
    getSelectedFiles,
  } = useFileContext();

  const agents = [
    {
      id: "inlegalbert",
      name: "InLegalBERT",
      description:
        "Advanced legal language model for corporate document analysis",
      specialty: "Contract Review, Compliance Analysis",
      accuracy: "98.5%",
      status: "active",
    },
    {
      id: "contract-ai",
      name: "Contract Analyzer AI",
      description:
        "Specialized in corporate contract review and risk assessment",
      specialty: "M&A, Commercial Agreements",
      accuracy: "97.2%",
      status: "active",
    },
    {
      id: "compliance-ai",
      name: "Compliance Guardian",
      description: "Corporate compliance and regulatory analysis agent",
      specialty: "SEC, SOX, Corporate Governance",
      accuracy: "96.8%",
      status: "active",
    },
  ];

  const sampleAnalysis = {
    summary:
      "The corporate merger agreement demonstrates standard M&A structure with comprehensive representations and warranties.",
    keyFindings: [
      {
        type: "positive",
        title: "Well-Defined Termination Rights",
        description:
          "Clear termination provisions protect both parties with balanced break-up fees.",
      },
      {
        type: "warning",
        title: "Material Adverse Effect Clause",
        description:
          "MAE definition may be too broad and could create ambiguity in execution.",
      },
      {
        type: "positive",
        title: "Robust Indemnification",
        description:
          "Comprehensive indemnification structure with appropriate baskets and caps.",
      },
    ],
    riskScore: 72,
    complianceScore: 95,
  };

  const handleAnalyze = () => {
    // Simulate AI analysis
    setAnalysis("Analysis complete");
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        await addFile(files[i], "Corporate Analysis");
      }
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleReferenceUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        await addFile(files[i], "Reference Document");
      }
      // Reset the input
      if (referenceInputRef.current) {
        referenceInputRef.current.value = "";
      }
    }
  };

  const toggleReferenceDocument = (id: string) => {
    toggleFileSelection(id);
  };

  const selectedReferenceDocs = getSelectedFiles();

  return (
    <div className="space-y-6">
      <div>
        <h2>Corporate Legal Analysis</h2>
        <p className="text-muted-foreground">
          AI-powered analysis for corporate legal matters
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{agents.length}</div>
            <p className="text-xs text-muted-foreground">AI models ready</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Avg. Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">97.5%</div>
            <p className="text-xs text-muted-foreground">Across all models</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Documents Analyzed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">1,247</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="analyze">Analyze Document</TabsTrigger>
          <TabsTrigger value="reference">Reference Docs</TabsTrigger>
          <TabsTrigger value="results">Recent Results</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <CardDescription>{agent.description}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {agent.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Specialty</p>
                      <p className="text-sm">{agent.specialty}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Accuracy Rate
                      </p>
                      <p className="text-sm">{agent.accuracy}</p>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Building2 className="mr-2 h-4 w-4" />
                    Use {agent.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analyze" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Analysis</CardTitle>
              <CardDescription>
                Upload or paste corporate document text for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label>Document Type</label>
                <Input placeholder="e.g., Merger Agreement, Stock Purchase Agreement" />
              </div>

              <div className="space-y-2">
                <label>Upload Document</label>
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex-1"
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {isUploading ? "Uploading..." : "Choose File"}
                  </Button>
                </div>
                {isUploading && (
                  <p className="text-sm text-muted-foreground">
                    Processing files...
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
                <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label>
                  Selected Reference Documents ({selectedReferenceDocs.length})
                </label>
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
                    No reference documents selected. Go to "Reference Docs" tab
                    to select documents for context.
                  </p>
                )}
              </div>

              <Button className="w-full" onClick={handleAnalyze}>
                <Bot className="mr-2 h-4 w-4" />
                Analyze with AI
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reference" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reference Documents</CardTitle>
              <CardDescription>
                Upload legal rules, regulations, and statutes that AI agents can
                use for analysis context
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label>Upload New Reference Documents</label>
                <div className="flex gap-2 items-center">
                  <input
                    ref={referenceInputRef}
                    type="file"
                    name="pdfFiles"
                    accept="application/pdf,image/*"
                    className="hidden"
                    multiple
                    onChange={handleReferenceUpload}
                    disabled={isUploading}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => referenceInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex-1"
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {isUploading ? "Uploading..." : "Choose Files"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  PDF and image files supported. You can select multiple files.
                  Uploaded documents will be processed with OCR and available
                  for selection below.
                </p>
              </div>

              <div className="space-y-2">
                <label>Available Reference Documents</label>
                <p className="text-sm text-muted-foreground">
                  Select documents to use as reference context for AI analysis
                </p>
              </div>

              <ScrollArea className="h-[400px] rounded-md border p-4">
                <div className="space-y-3">
                  {uploadedFiles.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        No reference documents uploaded yet
                      </p>
                      <p className="text-xs">Upload files to get started</p>
                    </div>
                  ) : (
                    uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                      >
                        <Checkbox
                          checked={file.selected || false}
                          onCheckedChange={() =>
                            toggleReferenceDocument(file.id)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm">{file.name}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {file.category || file.type}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm">
                  <strong>
                    Selected: {selectedReferenceDocs.length} document(s)
                  </strong>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  These documents will be used as reference context when
                  analyzing corporate documents
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {analysis && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>
                  AI-generated insights and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {sampleAnalysis.summary}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Risk Score</p>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">
                        {sampleAnalysis.riskScore}/100
                      </div>
                      <Badge variant="secondary">Moderate</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Compliance Score
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">
                        {sampleAnalysis.complianceScore}/100
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Excellent
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4>Key Findings</h4>
                  {sampleAnalysis.keyFindings.map((finding, index) => (
                    <div
                      key={index}
                      className="rounded-lg border p-4 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        {finding.type === "positive" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                        )}
                        <h4>{finding.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {finding.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {!analysis && (
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
