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
import { ScrollArea } from "./ui/scroll-area";
import {
  Upload,
  FileText,
  Search,
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  X,
  ExternalLink,
} from "lucide-react";
import { useState, useRef } from "react";
import { useFileContext } from "../contexts/FileContext";
import { generateCitiations, generateIssues, generateKeyPoints, generateSummary } from "@/hooks/documentAnalysis";
import { generateTasks } from "@/hooks/generateTasks";
import { storeDataToLocalStorage } from "@/hooks/localstore";

export function DocumentAnalysis() {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadedFiles, addFile, removeFile, isUploading } = useFileContext();

  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState<string | any>(null);
  const [keyPoints, setKeyPoints] = useState<string | any>(null);
  const [issues, setIssues] = useState<string | any>(null);
  const [citations, setCitations] = useState<string | any>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    console.log(files);
    if (files) {
      // for (let i = 0; i < files.length; i++) {
      //   await addFile(files[i], "Document Analysis");
      // }
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://localhost:8000/api/ocr", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        const pdfData = data.data.pdfData;
        const tasks = await generateTasks(pdfData);
        const jsonData = JSON.stringify(tasks);
        localStorage.setItem("tasks", jsonData);
        console.log(tasks);
        await addFile(file, "Document Analysis", pdfData);
      } else {
        console.error("Failed to process file:", data.error);
      }

      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveFile = (fileId: string) => {
    removeFile(fileId);
    if (selectedDoc === fileId) {
      setSelectedDoc(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
      case "analyzed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "analyzed":
        return (
          <Badge variant="default" className="text-xs">
            analyzed
          </Badge>
        );
      case "uploading":
        return (
          <Badge variant="secondary" className="text-xs">
            uploading
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive" className="text-xs">
            error
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            pending
          </Badge>
        );
    }
  };

  const analysisResults = {
    summary:
      "This is a standard service agreement between the client and Acme Corporation for consulting services. The agreement is for a 12-month term with an option to renew.",
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
        description:
          "Broad indemnification language may expose client to significant liability. Consider negotiating narrower scope.",
      },
      {
        type: "info",
        title: "Non-Compete Period",
        description:
          "2-year non-compete period is enforceable under state law but may be challenged.",
      },
    ],
    citations: [
      "California Civil Code § 1670.5 - Unconscionable contracts",
      "Business and Professions Code § 16600 - Non-compete agreements",
    ],
  };

  const handleDocumentClick = (file: any) => {
    setSelectedDoc(file.id);
    console.log(file);
    console.log(file.pdfData);
    setLoading(true);
    generateSummary(file.pdfData).then((data) => {
      setSummary(data);
      console.log(data);
    });
    generateKeyPoints(file.pdfData).then((data) => {
      setKeyPoints(data);
      console.log(data);
    });
    generateIssues(file.pdfData).then((data) => {
      setIssues(data);
      console.log(data);
    });
    generateCitiations(file.pdfData).then((data) => {
      setCitations(data);
      console.log(data);
    });
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Document Analysis</h2>
        <p className="text-muted-foreground">
          Upload and analyze legal documents with AI-powered insights
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Uploaded documents for analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 w-full">
              <label>Upload New Documents</label>
              <div className="flex gap-2 items-center w-full">
                <input
                  ref={fileInputRef}
                  type="file"
                  name="pdfFiles"
                  accept="application/pdf,image/*"
                  className="hidden"
                  multiple
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <Button
                  type="button"
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
                  {isUploading ? "Uploading..." : "Choose Files"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                PDF and image files supported. You can select multiple files.
                Uploaded documents will be processed with OCR and available for
                selection below.
              </p>
            </div>

            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {uploadedFiles.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No documents uploaded yet</p>
                    <p className="text-xs">Upload files to get started</p>
                  </div>
                ) : (
                  uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedDoc === file.id
                          ? "bg-accent border-primary"
                          : "hover:bg-accent/50"
                      }`}
                      onClick={() => handleDocumentClick(file)}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-1 flex-shrink-0">
                          {getStatusIcon(file.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm truncate">{file.name}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile(file.id);
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {file.type}
                            </Badge>
                            {getStatusBadge(file.status)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {file.size} • {file.uploadDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              {selectedDoc
                ? `AI-powered insights for ${
                    uploadedFiles.find((f) => f.id === selectedDoc)?.name ||
                    "selected document"
                  }`
                : "Select a document to view AI-powered insights and recommendations"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDoc ? (
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
                    <p className="text-sm text-muted-foreground">
                      {uploadedFiles.find((f) => f.id === selectedDoc)
                        ?.extractedText
                        ? `Extracted text preview: ${uploadedFiles
                            .find((f) => f.id === selectedDoc)
                            ?.extractedText?.substring(0, 200)}...`
                        : analysisResults.summary}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {summary?.data}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Document Type:{" "}
                        {uploadedFiles.find((f) => f.id === selectedDoc)
                          ?.type || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Analysis Complete</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="key-points" className="space-y-3">
                  {keyPoints?.data?.map((point:any, index:any) => (
                    <div
                      key={index}
                      className="flex gap-3 p-3 rounded-lg border"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{point.keyPoint}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="issues" className="space-y-3">
                  {issues?.data.map((issue:any, index:any) => (
                    <div
                      key={index}
                      className="rounded-lg border p-4 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        {issue.priority === "high" ? (
                          <AlertTriangle className="h-5 w-5 text-orange-600" />
                        ) : issue.priority === "medium" ? (
                          <Info className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Info className="h-5 w-5 text-green-600" />
                        )}
                        <h4>{issue.issue}</h4>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="citations" className="space-y-3">
                  {citations?.data.map((citation:any, index:any) => (
                    <div
                      key={index}
                      className="flex gap-3 p-3 rounded-lg border"
                    >
                      <Search className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{citation.citation}</p>
                      <a href={citation.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      </a>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="mb-2">No document selected</h3>
                <p className="text-sm text-muted-foreground">
                  Select a document from the list to view AI analysis results
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
