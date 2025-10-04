import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Search, BookOpen, Scale, Bookmark, ExternalLink } from "lucide-react";
import { useState } from "react";

export function LegalResearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const recentSearches = [
    "Contract formation elements",
    "Statute of limitations California",
    "Discovery procedures",
  ];

  const caseResults = [
    {
      id: 1,
      title: "Hadley v. Baxendale",
      citation: "156 Eng. Rep. 145 (1854)",
      court: "Court of Exchequer",
      date: "1854",
      relevance: 95,
      summary: "Landmark case establishing the rule for remoteness of damages in contract law. Damages must be reasonably foreseeable at the time of contract formation.",
      keyPoints: [
        "Reasonable foreseeability test",
        "Consequential damages",
        "Contract remedies",
      ],
    },
    {
      id: 2,
      title: "Palsgraf v. Long Island Railroad Co.",
      citation: "248 N.Y. 339 (1928)",
      court: "New York Court of Appeals",
      date: "1928",
      relevance: 88,
      summary: "Foundational tort law case on proximate cause. Established that duty of care is owed only to foreseeable plaintiffs within the zone of danger.",
      keyPoints: [
        "Proximate cause",
        "Duty of care",
        "Foreseeability",
      ],
    },
    {
      id: 3,
      title: "Miranda v. Arizona",
      citation: "384 U.S. 436 (1966)",
      court: "Supreme Court of the United States",
      date: "1966",
      relevance: 82,
      summary: "Established Miranda rights requiring law enforcement to inform suspects of their constitutional rights before custodial interrogation.",
      keyPoints: [
        "Fifth Amendment rights",
        "Right to counsel",
        "Custodial interrogation",
      ],
    },
  ];

  const statutes = [
    {
      id: 1,
      title: "California Civil Code § 1550",
      jurisdiction: "California",
      topic: "Essential elements of contracts",
      text: "It is essential to the existence of a contract that there should be: 1. Parties capable of contracting; 2. Their consent; 3. A lawful object; and, 4. A sufficient cause or consideration.",
    },
    {
      id: 2,
      title: "Federal Rule of Civil Procedure 26",
      jurisdiction: "Federal",
      topic: "Duty to Disclose; General Provisions Governing Discovery",
      text: "Outlines the general provisions governing discovery in federal civil litigation, including mandatory disclosures and the scope of discovery.",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2>Legal Research</h2>
        <p className="text-muted-foreground">Search case law, statutes, and legal precedents</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cases, statutes, regulations..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>Search</Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Recent:</span>
            {recentSearches.map((search, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => setSearchQuery(search)}
              >
                {search}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="cases" className="w-full">
        <TabsList>
          <TabsTrigger value="cases">
            <Scale className="h-4 w-4 mr-2" />
            Case Law
          </TabsTrigger>
          <TabsTrigger value="statutes">
            <BookOpen className="h-4 w-4 mr-2" />
            Statutes
          </TabsTrigger>
          <TabsTrigger value="saved">
            <Bookmark className="h-4 w-4 mr-2" />
            Saved Research
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Found {caseResults.length} relevant cases
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {caseResults.map((case_) => (
                <Card key={case_.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{case_.title}</CardTitle>
                        <CardDescription>
                          {case_.citation} • {case_.court} • {case_.date}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{case_.relevance}% relevant</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{case_.summary}</p>

                    <div className="space-y-2">
                      <h4 className="text-sm">Key Points:</h4>
                      <div className="flex flex-wrap gap-2">
                        {case_.keyPoints.map((point, index) => (
                          <Badge key={index} variant="secondary">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Full Text
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="statutes" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Found {statutes.length} relevant statutes
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {statutes.map((statute) => (
                <Card key={statute.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{statute.title}</CardTitle>
                        <CardDescription>{statute.topic}</CardDescription>
                      </div>
                      <Badge variant="outline">{statute.jurisdiction}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg bg-muted p-4">
                      <p className="text-sm">{statute.text}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Full Statute
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="saved">
          <Card>
            <CardContent className="py-12 text-center">
              <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="mb-2">No saved research yet</h3>
              <p className="text-sm text-muted-foreground">
                Save cases and statutes to access them quickly later
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
