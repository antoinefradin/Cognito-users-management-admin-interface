import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Building2, 
  Cog,
  LayoutDashboard, 
  KeySquare, 
  BarChart3,
  LogOut, 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import '@/styles/app.scss'; // Import SCSS instead of inline styles
import { useAuth } from "react-oidc-context";




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

  const auth = useAuth();

  const handleLogout = () => {
    auth.removeUser();
    window.location.href = `${import.meta.env.VITE_APP_COGNITO_DOMAIN}/logout?client_id=${import.meta.env.VITE_APP_USER_POOL_CLIENT_ID}&logout_uri=${encodeURIComponent(import.meta.env.VITE_APP_REDIRECT_SIGNOUT_URL)}`;

    //auth.signoutRedirect();
  };


  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50">        
        <Sidebar className="border-r border-white/20 bg-white/60 backdrop-blur-xl">
          <SidebarHeader className="border-b border-white/20 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-cyan-700 rounded-xl flex items-center justify-center shadow-lg">
                <Cog className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">IQ Agent</h2>
                <p className="text-xs text-gray-500 font-medium">Users Management Panel</p>
              </div>
            </div>
            {/*<Separator className="bg-gray-200 m-1 my-2" />*/}
          </SidebarHeader>
          
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              {/*<SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-3">
                MENU
              </SidebarGroupLabel>*/}
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-50 hover:text-blue-700 rounded-xl group ${
                          location.pathname === item.url 
                            ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                            : 'text-gray-600 hover:shadow-sm'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className={`w-5 h-5 ${
                            location.pathname === item.url ? 'text-blue-600' : 'text-gray-400'
                          }hover:text-blue-600`} />
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
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600" onClick={handleLogout}>
                <LogOut className="w-4 h-4"/>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0">
          <header className="bg-white/60 backdrop-blur-xl border-b border-white/20 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-gray-900">IQ Agent Admin</h1>
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

