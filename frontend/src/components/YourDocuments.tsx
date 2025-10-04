import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { 
  FileText, 
  Upload, 
  Search, 
  Trash2, 
  Download, 
  Eye,
  BookOpen,
  Scale,
  Filter
} from "lucide-react";
import { useState } from "react";

interface Document {
  id: string;
  name: string;
  type: "case" | "reference";
  category: string;
  uploadDate: string;
  size: string;
  tags: string[];
}

export function YourDocuments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "DOC-001",
      name: "California Civil Code § 1550-1701.pdf",
      type: "reference",
      category: "Contract Law",
      uploadDate: "2025-09-15",
      size: "1.2 MB",
      tags: ["Contract", "California", "Civil Code"],
    },
    {
      id: "DOC-002",
      name: "Federal Rules of Civil Procedure.pdf",
      type: "reference",
      category: "Litigation",
      uploadDate: "2025-09-20",
      size: "2.8 MB",
      tags: ["Federal", "Procedure", "Civil"],
    },
    {
      id: "DOC-003",
      name: "SEC Regulations Handbook.pdf",
      type: "reference",
      category: "Corporate Compliance",
      uploadDate: "2025-09-22",
      size: "3.5 MB",
      tags: ["SEC", "Compliance", "Corporate"],
    },
    {
      id: "DOC-004",
      name: "Service Agreement - Acme Corp.pdf",
      type: "case",
      category: "Contract Review",
      uploadDate: "2025-10-01",
      size: "2.4 MB",
      tags: ["Contract", "M&A", "Corporate"],
    },
    {
      id: "DOC-005",
      name: "Employment Law Compendium.pdf",
      type: "reference",
      category: "Employment Law",
      uploadDate: "2025-09-10",
      size: "4.2 MB",
      tags: ["Employment", "Labor", "Discrimination"],
    },
    {
      id: "DOC-006",
      name: "Criminal Evidence Analysis - Smith Case.pdf",
      type: "case",
      category: "Criminal Defense",
      uploadDate: "2025-10-03",
      size: "1.8 MB",
      tags: ["Criminal", "Evidence", "Defense"],
    },
  ]);

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderDocumentCard = (doc: Document) => (
    <Card key={doc.id}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
            {doc.type === "reference" ? (
              <BookOpen className="h-6 w-6 text-primary" />
            ) : (
              <FileText className="h-6 w-6 text-primary" />
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h4>{doc.name}</h4>
                <p className="text-sm text-muted-foreground">{doc.category}</p>
              </div>
              <Badge variant={doc.type === "reference" ? "default" : "secondary"}>
                {doc.type === "reference" ? "Reference" : "Case Document"}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              {doc.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{doc.size}</span>
              <span>•</span>
              <span>Uploaded {doc.uploadDate}</span>
              <span>•</span>
              <span>ID: {doc.id}</span>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(doc.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const referenceDocuments = filteredDocs.filter(doc => doc.type === "reference");
  const caseDocuments = filteredDocs.filter(doc => doc.type === "case");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Your Documents</h2>
          <p className="text-muted-foreground">Manage your uploaded documents and reference materials</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload New Document
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{documents.length}</div>
            <p className="text-xs text-muted-foreground">All files</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Reference Docs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{documents.filter(d => d.type === "reference").length}</div>
            <p className="text-xs text-muted-foreground">Rules & regulations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Case Documents</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{documents.filter(d => d.type === "case").length}</div>
            <p className="text-xs text-muted-foreground">For analysis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Storage Used</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">15.9 MB</div>
            <p className="text-xs text-muted-foreground">Of 1 GB</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents by name, category, or tags..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Documents ({documents.length})</TabsTrigger>
          <TabsTrigger value="reference">Reference ({referenceDocuments.length})</TabsTrigger>
          <TabsTrigger value="case">Case Documents ({caseDocuments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredDocs.map(doc => renderDocumentCard(doc))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="reference" className="space-y-4">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Reference documents are legal rules, regulations, and statutes that AI agents can use for analysis context
            </p>
          </div>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {referenceDocuments.map(doc => renderDocumentCard(doc))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="case" className="space-y-4">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Case documents are files uploaded for specific analysis by AI agents
            </p>
          </div>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {caseDocuments.map(doc => renderDocumentCard(doc))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
