import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
// ...otros imports de páginas

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc"; // tu cliente trpc generado con createTRPCReact
import { httpBatchLink } from "@trpc/client";

const queryClient = new QueryClient();

// crear trpcClient manualmente si no lo tienes
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc", // o tu VITE_API_URL si quieres usar la variable de entorno
    }),
  ],
});

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      {/* todas tus rutas */}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <ErrorBoundary>
          <ThemeProvider defaultTheme="light">
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </trpc.Provider>
    </QueryClientProvider>
  );
}

export default App;
