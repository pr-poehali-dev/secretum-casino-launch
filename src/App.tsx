
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { GameProvider } from "@/contexts/GameContext";
import Header from "@/components/Header";
import Index from "./pages/Index";
import Games from "./pages/Games";
import Cases from "./pages/Cases";
import Balance from "./pages/Balance";
import Profile from "./pages/Profile";
import Rules from "./pages/Rules";
import Login from "./pages/Login";
import TapGame from "./pages/TapGame";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <GameProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/games" element={<Games />} />
              <Route path="/cases" element={<Cases />} />
              <Route path="/balance" element={<Balance />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/tap" element={<TapGame />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </GameProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;