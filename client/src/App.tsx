import { TRPCProvider } from '@trpc/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpcClient';

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Register from "./pages/Register";
import RequestAmigurumi from "./pages/RequestAmigurumi";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import MyRequests from "./pages/MyRequests";
import AdminDashboard from "./pages/AdminDashboard";
import GalleryManager from "./pages/GalleryManager";
import TrackingPage from "./pages/TrackingPage";
import AdminLogin from "./pages/AdminLogin";
import CustomerDashboard from "./pages/CustomerDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import CommunityHub from "./pages/CommunityHub";
import TrackRequest from "./pages/TrackRequest";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/test"} component={Test} />
      <Route path={"/register"} component={Register} />
      <Route path={"/request"} component={RequestAmigurumi} />
      <Route path={"/payment"} component={Payment} />
      <Route path={"/payment-success"} component={PaymentSuccess} />
      <Route path={"/my-requests"} component={MyRequests} />
      <Route path={"/customer-panel"} component={CustomerDashboard} />
      <Route path={"/admin/login"} component={AdminLogin} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/gallery"} component={GalleryManager} />
      <Route path={"/admin/analytics"} component={AnalyticsDashboard} />
      <Route path={"/community"} component={CommunityHub} />
      <Route path={"/track-request"} component={TrackRequest} />
      <Route path={"/:requestId/track"} component={TrackingPage} />
      <Route path={"/track"} component={TrackingPage} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider client={trpcClient} queryClient={queryClient}>
        <ErrorBoundary>
          <ThemeProvider defaultTheme="light">
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </TRPCProvider>
    </QueryClientProvider>
  );
}

export default App;
