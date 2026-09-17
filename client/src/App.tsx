import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import DashboardLayout from "./components/DashboardLayout";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import QrPrint from "./pages/QrPrint";

function Protected({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

function Router() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/dashboard"><Protected><Dashboard /></Protected></Route>
    <Route path="/dashboard/feedback"><Protected><Dashboard /></Protected></Route>
    <Route path="/dashboard/qr"><Protected><QrPrint /></Protected></Route>
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
