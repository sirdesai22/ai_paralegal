import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { CaseDashboard } from "./components/CaseDashboard";
import { DocumentAnalysis } from "./components/DocumentAnalysis";
import { LegalResearch } from "./components/LegalResearch";
import { TaskManager } from "./components/TaskManager";
import { CalendarView } from "./components/CalendarView";
import { CorporateAnalysis } from "./components/CorporateAnalysis";
import { LitigationAnalysis } from "./components/LitigationAnalysis";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./components/ui/collapsible";
import { Switch } from "./components/ui/switch";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  CheckSquare,
  Calendar,
  Scale,
  Settings,
  User,
  ChevronDown,
  Brain,
  Building2,
  Gavel,
  Moon,
  Sun,
} from "lucide-react";

type ViewType = "dashboard" | "documents" | "research" | "tasks" | "calendar" | "corporate" | "litigation";

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [legalAnalysisOpen, setLegalAnalysisOpen] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      view: "dashboard" as ViewType,
    },
    {
      title: "Document Analysis",
      icon: FileText,
      view: "documents" as ViewType,
    },
    {
      title: "Legal Research",
      icon: BookOpen,
      view: "research" as ViewType,
    },
    {
      title: "Task Manager",
      icon: CheckSquare,
      view: "tasks" as ViewType,
    },
    {
      title: "Calendar",
      icon: Calendar,
      view: "calendar" as ViewType,
    },
  ];

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <CaseDashboard />;
      case "documents":
        return <DocumentAnalysis />;
      case "research":
        return <LegalResearch />;
      case "tasks":
        return <TaskManager />;
      case "calendar":
        return <CalendarView />;
      case "corporate":
        return <CorporateAnalysis />;
      case "litigation":
        return <LitigationAnalysis />;
      default:
        return <CaseDashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Scale className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg">LegalPro</h1>
                <p className="text-xs text-muted-foreground">Legal Analysis Suite</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.view}>
                        <SidebarMenuButton
                          onClick={() => setActiveView(item.view)}
                          isActive={activeView === item.view}
                          tooltip={item.title}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>AI Analysis</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <Collapsible open={legalAnalysisOpen} onOpenChange={setLegalAnalysisOpen}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip="Legal Analysis">
                          <Brain className="h-4 w-4" />
                          <span>Legal Analysis</span>
                          <ChevronDown
                            className={`ml-auto h-4 w-4 transition-transform ${
                              legalAnalysisOpen ? "rotate-180" : ""
                            }`}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              onClick={() => setActiveView("corporate")}
                              isActive={activeView === "corporate"}
                            >
                              <Building2 className="h-4 w-4" />
                              <span>Corporate</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              onClick={() => setActiveView("litigation")}
                              isActive={activeView === "litigation"}
                            >
                              <Gavel className="h-4 w-4" />
                              <span>Litigation</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Profile">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <div className="flex items-center justify-between px-2 py-2">
                      <div className="flex items-center gap-2">
                        {isDarkMode ? (
                          <Moon className="h-4 w-4" />
                        ) : (
                          <Sun className="h-4 w-4" />
                        )}
                        <span className="text-sm">Dark Mode</span>
                      </div>
                      <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                    </div>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1 text-sm">
                <p>Sarah Johnson</p>
                <p className="text-xs text-muted-foreground">Senior Paralegal</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <div className="flex-1" />
            </div>
          </div>

          <div className="container mx-auto p-6">
            {renderView()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
