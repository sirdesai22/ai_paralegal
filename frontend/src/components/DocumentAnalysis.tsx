import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Upload, FileText, Search, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useState } from "react";

export function DocumentAnalysis() {
  const [selectedDoc, setSelectedDoc] = useState<string | null>("contract-001");

  const documents = [
    {
      id: "contract-001",
      name: "Service Agreement - Acme Corp.pdf",
      type: "Contract",
      uploadDate: "2025-10-01",
      status: "analyzed",
      size: "2.4 MB",
    },
    {
      id: "brief-002",
      name: "Motion to Dismiss - Smith Case.docx",
      type: "Brief",
      uploadDate: "2025-10-02",
      status: "pending",
      size: "1.8 MB",
    },
    {
      id: "evidence-003",
      name: "Email Chain - Discovery.pdf",
      type: "Evidence",
      uploadDate: "2025-10-03",
      status: "analyzed",
      size: "856 KB",
    },
  ];

  const analysisResults = {
    summary: "This is a standard service agreement between the client and Acme Corporation for consulting services. The agreement is for a 12-month term with an option to renew.",
    keyPoints: [
      "Contract term: 12 months from execution date",
      "Payment terms: Net 30 days from invoice date",
      "Termination clause: 60 days written notice required",
      "Liability cap: $500,000 per incident",
      "Governing law: State of California",
    ],
    issues: [
      {
        type: "warning",
        title: "Indemnification Clause",
        description: "Broad indemnification language may expose client to significant liability. Consider negotiating narrower scope.",
      },
      {
        type: "info",
        title: "Non-Compete Period",
        description: "2-year non-compete period is enforceable under state law but may be challenged.",
      },
    ],
    citations: [
      "California Civil Code § 1670.5 - Unconscionable contracts",
      "Business and Professions Code § 16600 - Non-compete agreements",
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Document Analysis</h2>
        <p className="text-muted-foreground">Upload and analyze legal documents with AI-powered insights</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Uploaded documents for analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>

            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedDoc === doc.id
                        ? "bg-accent border-primary"
                        : "hover:bg-accent/50"
                    }`}
                    onClick={() => setSelectedDoc(doc.id)}
                  >
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {doc.type}
                          </Badge>
                          <Badge
                            variant={doc.status === "analyzed" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {doc.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {doc.size} • {doc.uploadDate}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>AI-powered document insights and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="key-points">Key Points</TabsTrigger>
                <TabsTrigger value="issues">Issues</TabsTrigger>
                <TabsTrigger value="citations">Citations</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2">Document Summary</h4>
                  <p className="text-sm text-muted-foreground">{analysisResults.summary}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Document Type: Service Agreement</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Analysis Complete</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="key-points" className="space-y-3">
                {analysisResults.keyPoints.map((point, index) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{point}</p>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="issues" className="space-y-3">
                {analysisResults.issues.map((issue, index) => (
                  <div key={index} className="rounded-lg border p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      {issue.type === "warning" ? (
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                      ) : (
                        <Info className="h-5 w-5 text-blue-600" />
                      )}
                      <h4>{issue.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{issue.description}</p>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="citations" className="space-y-3">
                {analysisResults.citations.map((citation, index) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg border">
                    <Search className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{citation}</p>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
