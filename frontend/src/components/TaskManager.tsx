'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar, Clock, User, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getDataFromLocalStorage } from "@/hooks/localstore";

interface Task {
  id: string;
  name: string;
  caseId?: string;
  type: string;
  deadline: string;
  time?: string;
  duration?: string;
  location?: string;
  attendees?: string[];
  priority: "High" | "Medium" | "Low";
  status: "in-progress" | "completed";
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Fetch tasks from backend
  useEffect(() => {
    setIsMounted(true);
    //write a function to fetch tasks from local storage named 
    const tasks = getDataFromLocalStorage("tasks");
    if (tasks) {
      setTasks(tasks);
      setLoading(false);
      console.log(tasks);
    } 
    fetchTasksFromBackend();
  }, []);

  async function fetchTasksFromBackend() {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/calendar/events");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(prevTasks => [...prevTasks, ...(Array.isArray(data) ? data : [])]);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  const toggleTaskStatus = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Toggle between in-progress and completed
    let newStatus: "in-progress" | "completed";
    if (task.status === "in-progress") {
      newStatus = "completed";
    } else {
      newStatus = "in-progress";
    }
    
    try {
      // Update task status in backend
      const response = await fetch(`http://localhost:4000/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update task status");
      }

      // Refresh tasks to get updated data
      await fetchTasksFromBackend();
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task status");
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const renderTaskCard = (task: Task) => {
    const taskDate = new Date(task.deadline);
    const formattedDate = taskDate.toLocaleDateString();
    const formattedTime = taskDate.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Check if task is overdue
    const now = new Date();
    const deadlineDate = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const isOverdue = deadlineDate < today && task.status === "in-progress";
    
    return (
      <Card key={task.id} className={isOverdue ? "border-l-4 border-l-red-500 bg-red-50" : ""}>
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
                  <div className="flex items-center gap-2">
                    <h4 className={task.status === "completed" ? "line-through text-muted-foreground" : ""}>
                      {task.name}
                    </h4>
                    {isOverdue && (
                      <Badge variant="destructive" className="text-xs">
                        OVERDUE
                      </Badge>
                    )}
                  </div>
                  {task.caseId && (
                    <p className="text-sm text-muted-foreground">
                      Case: {task.caseId}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Click checkbox to toggle: In Progress ↔ Completed
                  </p>
                </div>
                <div className="flex flex-col gap-2">
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
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      task.status === "completed" 
                        ? "bg-green-100 text-green-800 border-green-200" 
                        : "bg-blue-100 text-blue-800 border-blue-200"
                    }`}
                  >
                    {task.status === "completed" ? "Completed" : "In Progress"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {task.type}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className={isOverdue ? "text-red-600 font-semibold" : ""}>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className={isOverdue ? "text-red-600 font-semibold" : ""}>{formattedTime}</span>
                </div>
                {task.location && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{task.location}</span>
                  </div>
                )}
              </div>

              {task.attendees && task.attendees.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Attendees:</p>
                  <div className="flex flex-wrap gap-2">
                    {task.attendees.map((attendee: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {attendee}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const upcomingTasks = tasks.filter(t => t.status === "in-progress").sort((a, b) => 
    new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );

  const overdueTasks = upcomingTasks.filter(t => {
    const deadline = new Date(t.deadline);
    const now = new Date();
    // Set time to start of day for fair comparison (ignore time, only compare dates)
    const deadlineDate = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return deadlineDate < today;
  });

  // Prevent hydration mismatch by not rendering complex UI until mounted
  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2>Task Management</h2>
            <p className="text-muted-foreground">Track and manage legal tasks and deadlines</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">-</div>
                <p className="text-xs text-muted-foreground">Loading...</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex items-center justify-center h-32">
          <p>Loading task manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Task Management</h2>
          <p className="text-muted-foreground">Track and manage legal tasks and deadlines</p>
        </div>
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
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
            <SelectItem value="court">Court</SelectItem>
            <SelectItem value="deadline">Deadline</SelectItem>
            <SelectItem value="deposition">Deposition</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="High">High Priority</SelectItem>
            <SelectItem value="Medium">Medium Priority</SelectItem>
            <SelectItem value="Low">Low Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <p>Loading tasks...</p>
            </div>
          ) : tasks.length > 0 ? (
            tasks.map(task => renderTaskCard(task))
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No tasks found.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add tasks from the calendar to see them here.
              </p>
            </div>
          )}
        </TabsContent>


        <TabsContent value="in-progress" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <p>Loading tasks...</p>
            </div>
          ) : getTasksByStatus("in-progress").length > 0 ? (
            getTasksByStatus("in-progress").map(task => renderTaskCard(task))
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No tasks in progress.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <p>Loading tasks...</p>
            </div>
          ) : getTasksByStatus("completed").length > 0 ? (
            getTasksByStatus("completed").map(task => renderTaskCard(task))
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No completed tasks.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
