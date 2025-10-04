import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import { ScrollArea } from "./ui/scroll-area";
import { Calendar as CalendarIcon, Clock, MapPin, Video, Plus } from "lucide-react";
import { useState } from "react";

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const events = [
    {
      id: "1",
      title: "Client Meeting - Smith Case",
      date: "2025-10-08",
      time: "10:00 AM",
      duration: "1 hour",
      type: "meeting",
      location: "Conference Room A",
      caseId: "CASE-2025-001",
      attendees: ["Sarah Johnson", "John Smith"],
    },
    {
      id: "2",
      title: "Court Hearing - Williams IP",
      date: "2025-10-08",
      time: "2:00 PM",
      duration: "2 hours",
      type: "court",
      location: "Superior Court, Room 304",
      caseId: "CASE-2025-003",
      attendees: ["Michael Chen", "Judge Roberts"],
    },
    {
      id: "3",
      title: "Deposition - Anderson Corp",
      date: "2025-10-10",
      time: "9:00 AM",
      duration: "3 hours",
      type: "deposition",
      location: "Anderson Corp Offices",
      caseId: "CASE-2025-001",
      attendees: ["Sarah Johnson", "David Miller", "Witness"],
    },
    {
      id: "4",
      title: "Team Strategy Session",
      date: "2025-10-12",
      time: "3:00 PM",
      duration: "1.5 hours",
      type: "internal",
      location: "Virtual - Zoom",
      caseId: "CASE-2025-002",
      attendees: ["All Team"],
    },
    {
      id: "5",
      title: "Document Filing Deadline",
      date: "2025-10-15",
      time: "5:00 PM",
      duration: "Deadline",
      type: "deadline",
      location: "Court Filing System",
      caseId: "CASE-2025-002",
      attendees: ["David Miller"],
    },
  ];

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date + " " + a.time).getTime() - new Date(b.date + " " + b.time).getTime())
    .slice(0, 5);

  const getEventBadgeVariant = (type: string) => {
    switch (type) {
      case "court":
        return "destructive";
      case "deadline":
        return "destructive";
      case "deposition":
        return "default";
      case "meeting":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "court":
        return CalendarIcon;
      case "deadline":
        return Clock;
      case "internal":
        return Video;
      default:
        return MapPin;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Calendar & Deadlines</h2>
          <p className="text-muted-foreground">Manage appointments, hearings, and important dates</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view events</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />

            <div className="mt-4 space-y-2">
              <h4 className="text-sm">Event Types</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span>Court Hearings & Deadlines</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span>Depositions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-gray-500" />
                  <span>Meetings</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events and deadlines for the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {upcomingEvents.map((event) => {
                  const Icon = getEventIcon(event.type);
                  return (
                    <Card key={event.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <h4>{event.title}</h4>
                              <p className="text-sm text-muted-foreground">{event.caseId}</p>
                            </div>
                            <Badge variant={getEventBadgeVariant(event.type)}>
                              {event.type}
                            </Badge>
                          </div>

                          <div className="grid gap-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <CalendarIcon className="h-4 w-4" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>
                                {event.time} • {event.duration}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Icon className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t">
                            <p className="text-sm text-muted-foreground mb-2">Attendees:</p>
                            <div className="flex flex-wrap gap-2">
                              {event.attendees.map((attendee, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {attendee}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              Add to Calendar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
