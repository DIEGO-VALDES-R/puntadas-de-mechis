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
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
