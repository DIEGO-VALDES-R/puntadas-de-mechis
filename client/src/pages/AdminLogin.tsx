import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, LogIn } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.admin.login.useMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginMutation.mutateAsync({ username, password });
      
      // Guardar token en localStorage
      localStorage.setItem("adminToken", result.token);
      localStorage.setItem("adminRole", result.role);
      
      toast.success("Sesión iniciada correctamente");
      setLocation("/admin");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-pink-500 text-white p-3 rounded-full">
              <Lock className="w-6 h-6" />
            </div>
          </div>
          <CardTitle className="text-2xl">Panel de Administración</CardTitle>
          <p className="text-sm text-muted-foreground">
            Ingresa tus credenciales para acceder
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Usuario</label>
              <Input
                type="text"
                placeholder="Tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading || loginMutation.isPending}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Contraseña</label>
              <Input
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || loginMutation.isPending}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || loginMutation.isPending}
              className="w-full gap-2"
            >
              <LogIn className="w-4 h-4" />
              {isLoading || loginMutation.isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
            <p className="font-medium mb-2">Información de acceso:</p>
            <p className="text-xs">
              Si no tienes credenciales, contacta al administrador del sistema.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
