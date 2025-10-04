import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { FileText, Scale, Clock, AlertCircle } from "lucide-react";

export function CaseDashboard() {
  const stats = [
    {
      title: "Active Cases",
      value: "12",
      icon: Scale,
      description: "+2 from last month",
      color: "text-blue-600",
    },
    {
      title: "Pending Documents",
      value: "8",
      icon: FileText,
      description: "3 urgent reviews",
      color: "text-orange-600",
    },
    {
      title: "Upcoming Deadlines",
      value: "5",
      icon: Clock,
      description: "Next: Oct 8, 2025",
      color: "text-purple-600",
    },
    {
      title: "Critical Issues",
      value: "2",
      icon: AlertCircle,
      description: "Requires attention",
      color: "text-red-600",
    },
  ];

  const recentCases = [
    {
      id: "CASE-2025-001",
      title: "Smith v. Anderson Corp",
      type: "Contract Dispute",
      status: "Discovery",
      progress: 65,
      priority: "High",
      deadline: "2025-10-15",
    },
    {
      id: "CASE-2025-002",
      title: "Johnson Estate Matter",
      type: "Estate Planning",
      status: "Document Review",
      progress: 80,
      priority: "Medium",
      deadline: "2025-10-20",
    },
    {
      id: "CASE-2025-003",
      title: "Williams IP Litigation",
      type: "Intellectual Property",
      status: "Pre-Trial",
      progress: 45,
      priority: "High",
      deadline: "2025-10-08",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2>Dashboard</h2>
        <p className="text-muted-foreground">Overview of your legal matters and tasks</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Cases</CardTitle>
          <CardDescription>Cases currently in progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentCases.map((case_) => (
              <div key={case_.id} className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4>{case_.title}</h4>
                      <Badge
                        variant={
                          case_.priority === "High"
                            ? "destructive"
                            : case_.priority === "Medium"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {case_.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {case_.id} • {case_.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{case_.status}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">Due: {case_.deadline}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{case_.progress}%</span>
                  </div>
                  <Progress value={case_.progress} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
