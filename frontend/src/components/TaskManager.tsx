'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Calendar, Clock, User, AlertCircle } from "lucide-react";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  caseId: string;
  caseName: string;
  assignee: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "pending" | "in-progress" | "completed";
  category: string;
  description: string;
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "TASK-001",
      title: "Draft motion to dismiss",
      caseId: "CASE-2025-001",
      caseName: "Smith v. Anderson Corp",
      assignee: "Sarah Johnson",
      dueDate: "2025-10-08",
      priority: "High",
      status: "in-progress",
      category: "Drafting",
      description: "Prepare motion to dismiss based on lack of jurisdiction",
    },
    {
      id: "TASK-002",
      title: "Review discovery documents",
      caseId: "CASE-2025-001",
      caseName: "Smith v. Anderson Corp",
      assignee: "Michael Chen",
      dueDate: "2025-10-10",
      priority: "High",
      status: "pending",
      category: "Review",
      description: "Review and categorize incoming discovery documents",
    },
    {
      id: "TASK-003",
      title: "Prepare witness list",
      caseId: "CASE-2025-003",
      caseName: "Williams IP Litigation",
      assignee: "Sarah Johnson",
      dueDate: "2025-10-12",
      priority: "Medium",
      status: "pending",
      category: "Preparation",
      description: "Compile and finalize list of potential witnesses",
    },
    {
      id: "TASK-004",
      title: "File estate documents",
      caseId: "CASE-2025-002",
      caseName: "Johnson Estate Matter",
      assignee: "David Miller",
      dueDate: "2025-10-15",
      priority: "Medium",
      status: "pending",
      category: "Filing",
      description: "File estate planning documents with the court",
    },
    {
      id: "TASK-005",
      title: "Client meeting preparation",
      caseId: "CASE-2025-001",
      caseName: "Smith v. Anderson Corp",
      assignee: "Sarah Johnson",
      dueDate: "2025-10-06",
      priority: "Low",
      status: "completed",
      category: "Meeting",
      description: "Prepare materials for client status update meeting",
    },
  ]);

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: task.status === "completed" ? "pending" : "completed"
        };
      }
      return task;
    }));
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const renderTaskCard = (task: Task) => (
    <Card key={task.id}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Checkbox
            checked={task.status === "completed"}
            onCheckedChange={() => toggleTaskStatus(task.id)}
            className="mt-1"
          />
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h4 className={task.status === "completed" ? "line-through text-muted-foreground" : ""}>
                  {task.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {task.caseId} • {task.caseName}
                </p>
              </div>
              <Badge
                variant={
                  task.priority === "High"
                    ? "destructive"
                    : task.priority === "Medium"
                    ? "default"
                    : "secondary"
                }
              >
                {task.priority}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">{task.description}</p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{task.assignee}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{task.dueDate}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {task.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const upcomingTasks = tasks.filter(t => t.status !== "completed").sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const overdueTasks = upcomingTasks.filter(t => 
    new Date(t.dueDate) < new Date()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Task Management</h2>
          <p className="text-muted-foreground">Track and manage legal tasks and deadlines</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">Across all cases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{getTasksByStatus("in-progress").length}</div>
            <p className="text-xs text-muted-foreground">Currently being worked on</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Completed</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{getTasksByStatus("completed").length}</div>
            <p className="text-xs text-muted-foreground">Finished tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{overdueTasks.length}</div>
            <p className="text-xs text-muted-foreground">Needs immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by case" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cases</SelectItem>
            <SelectItem value="CASE-2025-001">CASE-2025-001</SelectItem>
            <SelectItem value="CASE-2025-002">CASE-2025-002</SelectItem>
            <SelectItem value="CASE-2025-003">CASE-2025-003</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {tasks.map(task => renderTaskCard(task))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {getTasksByStatus("pending").map(task => renderTaskCard(task))}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {getTasksByStatus("in-progress").map(task => renderTaskCard(task))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {getTasksByStatus("completed").map(task => renderTaskCard(task))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
