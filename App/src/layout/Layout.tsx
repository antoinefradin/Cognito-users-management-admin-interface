import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// KEPT: Original @/ imports (you'll need to configure path alias in vite.config.js)
import { createPageUrl } from "@/utils";
import { 
  Building2, 
  LayoutDashboard, 
  Users, // Kept this import as per instruction to "keep existing code (rest of lucide imports)"
  KeySquare, 
  BarChart3,
  Settings,
  LogOut, // Kept this import as per instruction to "keep existing code (rest of lucide imports)"
  Menu,
  X
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ADDED: Import your page components
// import Dashboard from "@/pages/Dashboard";
// import Enterprises from "@/pages/Enterprises";
// import Licenses from "@/pages/Licenses";
// import Analytics from "@/pages/Analytics";


/** ADDED */
import '@/styles/app.scss'; // Import SCSS instead of inline styles




const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Enterprises",
    url: createPageUrl("Enterprises"),
    icon: Building2,
  },
  {
    title: "Licenses",
    url: createPageUrl("Licenses"),
    icon: KeySquare,
  },
  // The "Users" item has been removed as per the outline
  {
    title: "Analytics",
    url: createPageUrl("Analytics"),
    icon: BarChart3,
  },
];



/* This is a Layout component that provides the application shell/structure.
* It doesn't import "Pages" because individual page components are passed 
* as the {children} prop from a parent component or routing system.
* The Layout defines navigation, sidebar, and renders page content via {children}.*/
// TypeScript interface for component props
interface LayoutProps {
  children: React.ReactNode;
  currentPageName?: string;
}


export default function Layout({ children, currentPageName }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate(); // ADDED: useNavigate hook for programmatic navigation

  // Handle logout functionality using navigate
  const handleLogout = () => {
    // Add your logout logic here (clear tokens, etc.)
    //...
    navigate('/login'); // Navigate to login page
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50">
        {/* REMOVED: Style tags with CSS variables */}
        
        <Sidebar className="border-r border-white/20 bg-white/60 backdrop-blur-xl">
          <SidebarHeader className="border-b border-white/20 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">LicenseHub</h2>
                <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-3">
                Management
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl group ${
                          location.pathname === item.url 
                            ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                            : 'text-gray-600 hover:shadow-sm'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className={`w-5 h-5 transition-colors ${
                            location.pathname === item.url ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                          }`} />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-white/20 p-4">
            <div className="flex items-center gap-3 px-2">
              <Avatar className="w-10 h-10 ring-2 ring-blue-100">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                  SA
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">Sales Admin</p>
                <p className="text-xs text-gray-500 truncate">admin@company.com</p>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0">
          <header className="bg-white/60 backdrop-blur-xl border-b border-white/20 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-gray-900">LicenseHub Admin</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children} {/* Individual page components are passed here from parent routing system */}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

