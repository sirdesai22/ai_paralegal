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
  Scale,
  Gavel,
  ShieldAlert,
  Users,
  TrendingUp,
  Upload,
  BookOpen,
  X,
  FileText,
} from "lucide-react";
import { useState, useRef } from "react";
import { useFileContext } from "../contexts/FileContext";
import { Loader2 } from "lucide-react";

interface ReferenceDocument {
  id: string;
  name: string;
  category: string;
  selected: boolean;
}

export function LitigationAnalysis() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const referenceInputRef = useRef<HTMLInputElement>(null);
  const [caseText, setCaseText] = useState("");
  const {
    uploadedFiles,
    addFile,
    removeFile,
    isUploading,
    toggleFileSelection,
    getSelectedFiles,
  } = useFileContext();

  const civilLawAgents = [
    {
      id: "civil-inlegalbert",
      name: "InLegalBERT - Civil Law",
      description: "Specialized in civil litigation case analysis and strategy",
      specialty: "Contract Disputes, Tort Claims, Property Law",
      accuracy: "98.2%",
      cases: 3420,
    },
    {
      id: "civil-liability",
      name: "Liability Analyzer",
      description:
        "AI agent for assessing liability and damages in civil cases",
      specialty: "Negligence, Damages Assessment",
      accuracy: "96.8%",
      cases: 2156,
    },
    {
      id: "civil-discovery",
      name: "Discovery Intelligence",
      description: "Document review and discovery strategy optimization",
      specialty: "E-Discovery, Document Classification",
      accuracy: "97.5%",
      cases: 4892,
    },
  ];

  const criminalLawAgents = [
    {
      id: "criminal-inlegalbert",
      name: "InLegalBERT - Criminal Law",
      description: "Criminal defense and prosecution case analysis",
      specialty: "Evidence Review, Case Law Research",
      accuracy: "97.9%",
      cases: 2893,
    },
    {
      id: "criminal-evidence",
      name: "Evidence Evaluator",
      description: "Analyzes admissibility and strength of criminal evidence",
      specialty: "4th Amendment, Evidence Rules",
      accuracy: "96.2%",
      cases: 1764,
    },
    {
      id: "criminal-sentencing",
      name: "Sentencing Advisor",
      description: "Sentencing guidelines and precedent analysis",
      specialty: "Federal Guidelines, Mitigation",
      accuracy: "95.8%",
      cases: 1445,
    },
  ];

  const otherAgents = [
    {
      id: "employment-ai",
      name: "Employment Law AI",
      description: "Employment disputes and labor law analysis",
      specialty: "Discrimination, Wrongful Termination",
      accuracy: "97.1%",
      cases: 2341,
    },
    {
      id: "ip-litigation",
      name: "IP Litigation Agent",
      description: "Intellectual property litigation support",
      specialty: "Patent, Trademark, Copyright",
      accuracy: "98.5%",
      cases: 1876,
    },
    {
      id: "class-action",
      name: "Class Action Analyzer",
      description: "Class action certification and management",
      specialty: "Class Certification, Settlement",
      accuracy: "96.5%",
      cases: 892,
    },
  ];

  const renderAgentCard = (agent: any) => (
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{agent.name}</CardTitle>
              <CardDescription className="text-sm">
                {agent.description}
              </CardDescription>
            </div>
          </div>
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
        >
          <Scale className="mr-2 h-4 w-4" />
          {selectedAgent === agent.id ? "Selected" : "Select Agent"}
        </Button>
      </CardContent>
    </Card>
  );

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        await addFile(files[i], "Litigation Analysis");
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
        <h2>Litigation Analysis</h2>
        <p className="text-muted-foreground">
          AI agents specialized in litigation strategy and case analysis
        </p>
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
            <CardTitle className="text-sm">Other Specialties</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{otherAgents.length}</div>
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
              Specialized agents for civil litigation matters including contract
              disputes, torts, and property law
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {civilLawAgents.map((agent) => renderAgentCard(agent))}
          </div>
        </TabsContent>

        <TabsContent value="criminal" className="space-y-4">
          <div className="mb-4">
            <h3>Criminal Law AI Agents</h3>
            <p className="text-sm text-muted-foreground">
              Specialized agents for criminal defense, prosecution, and evidence
              analysis
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {criminalLawAgents.map((agent) => renderAgentCard(agent))}
          </div>
        </TabsContent>

        <TabsContent value="other" className="space-y-4">
          <div className="mb-4">
            <h3>Specialized Litigation Agents</h3>
            <p className="text-sm text-muted-foreground">
              AI agents for employment law, intellectual property, class
              actions, and more
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {otherAgents.map((agent) => renderAgentCard(agent))}
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
                      <strong>Selected Agent:</strong>{" "}
                      {
                        [
                          ...civilLawAgents,
                          ...criminalLawAgents,
                          ...otherAgents,
                        ].find((a) => a.id === selectedAgent)?.name
                      }
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label>Case Title</label>
                    <Input placeholder="e.g., Smith v. Anderson Corp." />
                  </div>

                  <div className="space-y-2">
                    <label>Case Type</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                      <option>Civil - Contract Dispute</option>
                      <option>Civil - Personal Injury</option>
                      <option>Civil - Property</option>
                      <option>Criminal - Felony</option>
                      <option>Criminal - Misdemeanor</option>
                      <option>Employment - Discrimination</option>
                      <option>IP - Patent Infringement</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label>Upload Case Document</label>
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
                    />
                  </div>

                  <div className="space-y-2">
                    <label>
                      Selected Reference Documents (
                      {selectedReferenceDocs.length})
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
                        No reference documents selected. Go to "Reference Docs"
                        tab to select documents for context.
                      </p>
                    )}
                  </div>

                  <Button className="w-full">
                    <Bot className="mr-2 h-4 w-4" />
                    Start AI Analysis
                  </Button>
                </>
              ) : (
                <div className="py-12 text-center">
                  <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h4 className="mb-2">No Agent Selected</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please select an AI agent from the Civil Law, Criminal Law,
                    or Other Areas tabs
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
                Upload legal rules, regulations, and case law that AI agents can
                use for litigation analysis context
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
                  Select documents to use as reference context for AI litigation
                  analysis
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
                  analyzing litigation cases
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
