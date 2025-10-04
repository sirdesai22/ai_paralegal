"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
  Plus,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Calendar } from "./ui/calendar";
// Removed react-datepicker dependency to fix "fn is not a function" error

type CalendarEvent = {
  id: string;
  name: string;
  caseId?: string;
  type: string;
  deadline: string;
  time?: string;
  duration?: string;
  location?: string;
  attendees?: string[];
  priority?: string;
};

const priorityColors: Record<string, string> = {
  High: "bg-red-600",
  Medium: "bg-blue-500",
  Low: "bg-gray-500",
};

function getEventBadgeVariant(type: string) {
  switch (type) {
    case "court":
    case "deadline":
      return "destructive";
    case "deposition":
      return "secondary";
    case "internal":
      return "default";
    case "meeting":
      return "outline";
    default:
      return "outline";
  }
}

function getEventIcon(type: string) {
  switch (type) {
    case "court":
      return <CalendarIcon className="h-4 w-4" />;
    case "deadline":
      return <Clock className="h-4 w-4" />;
    case "internal":
      return <Video className="h-4 w-4" />;
    default:
      return <MapPin className="h-4 w-4" />;
  }
}

// Client-only wrapper for date picker with proper typing
interface DatePickerWrapperProps {
  selected: Date | undefined;
  onChange: (date: Date | null) => void;
  placeholderText: string;
}

function DatePickerWrapper({ 
  selected, 
  onChange, 
  placeholderText 
}: DatePickerWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <input
        type="text"
        className="w-full border px-2 py-1 rounded"
        placeholder={placeholderText}
        disabled
      />
    );
  }

  return (
    <div className="w-full">
      <input
        type="date"
        value={selected ? selected.toISOString().slice(0, 10) : ""}
        onChange={(e) => {
          const value = e.target.value;
          if (value) {
            onChange(new Date(value));
          } else {
            onChange(null);
          }
        }}
        className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-foreground shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring hover:border-ring/50 [color-scheme:light] dark:[color-scheme:dark]"
        placeholder={placeholderText}
      />
    </div>
  );
}

// Custom day content component for calendar highlighting
function CustomDayContent({ day, events }: { day: { date: Date }; events: CalendarEvent[] }) {
  const hasEvent = events?.some((event: CalendarEvent) => {
    const eventDate = new Date(event.deadline);
    return (
      eventDate.getDate() === day.date.getDate() &&
      eventDate.getMonth() === day.date.getMonth() &&
      eventDate.getFullYear() === day.date.getFullYear()
    );
  });

  const dayEvents = events?.filter((event: CalendarEvent) => {
    const eventDate = new Date(event.deadline);
    return (
      eventDate.getDate() === day.date.getDate() &&
      eventDate.getMonth() === day.date.getMonth() &&
      eventDate.getFullYear() === day.date.getFullYear()
    );
  });

  const highPriorityEvent = dayEvents?.some(event => event.priority === 'High');
  const mediumPriorityEvent = dayEvents?.some(event => event.priority === 'Medium');

  return (
    <td
      className={`relative p-0 text-center ${
        hasEvent
          ? highPriorityEvent
            ? 'text-white'
            : mediumPriorityEvent
            ? 'text-white'
            : 'text-white'
          : ''
      }`}
    >
      <button
        type="button"
        className={`w-9 h-9 p-0 flex items-center justify-center rounded-full transition-colors ${
          hasEvent
            ? highPriorityEvent
              ? 'bg-red-500 hover:bg-red-600'
              : mediumPriorityEvent
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-green-500 hover:bg-green-600'
            : ''
        }`}
      >
        <time className={`${hasEvent ? 'font-semibold' : ''}`}>
          {day.date.getDate()}
        </time>
        {hasEvent && dayEvents.length > 1 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 block h-3 w-3 rounded-full bg-amber-500 border-2 border-white" />
        )}
      </button>
    </td>
  );
}

export function CalendarView() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state - using Date | null for ReactDatePicker compatibility
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [priority, setPriority] = useState("Medium");
  const [type, setType] = useState("meeting");

  // Wrapper function to handle the type conversion
  const handleDeadlineChange = (date: Date | null) => {
    setDeadline(date);
  };

  useEffect(() => {
    setIsClient(true);
    // Initialize date only on client side
    setDate(new Date());
    fetchEventsFromBackend();
  }, []);

  async function fetchEventsFromBackend() {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/calendar/events");
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name || !deadline) {
      alert("Please enter all required fields.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/calendar/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          deadline: deadline.toISOString(),
          priority,
          type,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add task");
      }
      await fetchEventsFromBackend();
      setOpen(false);
      setName("");
      setDeadline(null);
      setPriority("Medium");
      setType("meeting");
      // Navigate to calendar tab using the router
      router.push("/dashboard/calendar");
    } catch (error) {
      alert(error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }

  async function handleDeleteTask(id: string) {
    try {
      const response = await fetch(`http://localhost:4000/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete task");
      }
      await fetchEventsFromBackend();
    } catch (error) {
      alert(error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }

  const upcomingEvents = Array.isArray(events)
    ? events
        .filter(e => e?.deadline && new Date(e.deadline) >= new Date())
        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        .slice(0, 5)
    : [];

  // Loading state for SSR
  if (!isClient) {
    return (
      <div className="space-y-6 p-4">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Calendar & Deadlines</h2>
            <p className="text-muted-foreground">Manage appointments, hearings, and important dates</p>
          </div>
          <Button disabled className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add New Task
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar Skeleton */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Select a date to view events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <div className="text-center">
                  <CalendarIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Loading calendar...</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <h4 className="text-sm">Priority Levels</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-red-600" />
                    <span>High Priority</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span>Medium Priority</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-gray-500" />
                    <span>Low Priority</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Events Skeleton */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Events and deadlines for the next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Loading events...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Calendar & Deadlines</h2>
          <p className="text-muted-foreground">Manage appointments, hearings, and important dates</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2 text-foreground">Task Name (required)</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-foreground shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring hover:border-ring/50"
                  placeholder="Enter task name"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-foreground">Deadline (required)</label>
                <DatePickerWrapper
                  selected={deadline || undefined}
                  onChange={handleDeadlineChange}
                  placeholderText="Select date"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-foreground">Priority</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-foreground shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring hover:border-ring/50"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2 text-foreground">Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-foreground shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring hover:border-ring/50"
                >
                  <option value="meeting">Meeting</option>
                  <option value="court">Court</option>
                  <option value="deadline">Deadline</option>
                  <option value="deposition">Deposition</option>
                  <option value="internal">Internal</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Task</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view events</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              className="rounded-md border p-3"
              required={false}
              modifiersStyles={{
                selected: {
                  backgroundColor: "#22C55E",
                  color: "white"
                }
              }}
              classNames={{
                day_today: "bg-gray-100 font-semibold text-gray-900",
                day_selected: "bg-green-500 text-white hover:bg-green-600",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
              }}
              components={{
                Day: (props) => <CustomDayContent {...props} events={events} />
              }}
            />
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-semibold">Priority Levels</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-red-600" />
                  <span>High Priority</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span>Medium Priority</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-gray-500" />
                  <span>Low Priority</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events and deadlines for the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <p>Loading events...</p>
                </div>
              ) : Array.isArray(upcomingEvents) && upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event: CalendarEvent) => {
                    const Icon = getEventIcon(event.type);
                    const eventDate = new Date(event.deadline);
                    const formattedTime = eventDate.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    });
                    
                    return (
                      <Card key={event.id} className="overflow-hidden border-l-4 border-l-blue-500">
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1 flex-1">
                                <h4 className="font-semibold text-lg">{event.name}</h4>
                                {event.caseId && (
                                  <p className="text-sm text-muted-foreground">Case: {event.caseId}</p>
                                )}
                              </div>
                              <Badge variant={getEventBadgeVariant(event.type) as any}>
                                {event.type}
                              </Badge>
                            </div>

                            <div className="grid gap-2 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <CalendarIcon className="h-4 w-4" />
                                <span>{eventDate.toLocaleDateString()}</span>
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  {Icon} 
                                  <span>{event.location}</span>
                                </div>
                              )}
                            </div>

                            {event.priority && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Priority:</span>
                                <Badge 
                                  variant="outline" 
                                  className={`
                                    ${event.priority === 'High' ? 'bg-red-100 text-red-800 border-red-200' : ''}
                                    ${event.priority === 'Medium' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                                    ${event.priority === 'Low' ? 'bg-gray-100 text-gray-800 border-gray-200' : ''}
                                  `}
                                >
                                  {event.priority}
                                </Badge>
                              </div>
                            )}

                            {event.attendees && event.attendees.length > 0 && (
                              <div className="pt-2 border-t">
                                <p className="text-sm text-muted-foreground mb-2">Attendees:</p>
                                <div className="flex flex-wrap gap-2">
                                  {event.attendees.map((attendee: string, idx: number) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {attendee}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex gap-2 pt-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="outline" size="sm">Add to Calendar</Button>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => handleDeleteTask(event.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <CalendarIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No upcoming events found.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add a new task to see it here and on the calendar.
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}