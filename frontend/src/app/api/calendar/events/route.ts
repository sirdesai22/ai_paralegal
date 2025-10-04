import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch("http://localhost:4000/calendar");
    if (!response.ok) throw new Error("Failed to fetch events");
    const data = await response.json();
    
    // Transform the data to match the expected CalendarEvent format
    const transformedData = data.map((task: any) => ({
      id: task.id,
      name: task.name,
      caseId: task.caseId,
      type: task.type,
      deadline: task.deadline,
      time: task.time,
      duration: task.duration,
      location: task.location,
      attendees: task.attendees,
      priority: task.priority,
      status: task.status
    }));
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json([], { status: 500 });
  }
}