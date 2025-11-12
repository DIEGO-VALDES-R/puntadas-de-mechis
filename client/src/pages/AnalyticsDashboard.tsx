import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Plus, Download, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AnalyticsDashboard() {
  const [inventoryForm, setInventoryForm] = useState({
    productType: "",
    quantity: "",
    cost: "",
    referenceNumber: "",
  });

  const chartData = [
    { month: "Ene", ingresos: 2400, gastos: 1200, ganancia: 1200 },
    { month: "Feb", ingresos: 3200, gastos: 1400, ganancia: 1800 },
    { month: "Mar", ingresos: 2800, gastos: 1600, ganancia: 1200 },
    { month: "Abr", ingresos: 3900, gastos: 1800, ganancia: 2100 },
    { month: "May", ingresos: 4200, gastos: 2000, ganancia: 2200 },
    { month: "Jun", ingresos: 3800, gastos: 1900, ganancia: 1900 },
  ];

  const inventoryData = [
    { id: 1, productType: "Hilo Acrílico", quantity: 50, cost: 250000, referenceNumber: "REF-001", status: "completed" },
    { id: 2, productType: "Relleno Poliéster", quantity: 20, cost: 180000, referenceNumber: "REF-002", status: "pending" },
  ];

  const handleAddInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventoryForm.productType || !inventoryForm.quantity || !inventoryForm.cost) {
      toast.error("Completa todos los campos");
      return;
    }
    toast.success("Compra registrada correctamente");
    setInventoryForm({ productType: "", quantity: "", cost: "", referenceNumber: "" });
  };

  const totalIncome = chartData.reduce((sum, item) => sum + item.ingresos, 0);
  const totalExpense = chartData.reduce((sum, item) => sum + item.gastos, 0);
  const totalProfit = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard de Análitica</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <p className="text-green-600 text-sm font-medium mb-2">Ingresos Totales</p>
              <p className="text-3xl font-bold text-green-600">${(totalIncome / 100).toLocaleString("es-CO")}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <p className="text-red-600 text-sm font-medium mb-2">Gastos Totales</p>
              <p className="text-3xl font-bold text-red-600">${(totalExpense / 100).toLocaleString("es-CO")}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <p className="text-blue-600 text-sm font-medium mb-2">Ganancia Neta</p>
              <p className="text-3xl font-bold text-blue-600">${(totalProfit / 100).toLocaleString("es-CO")}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <p className="text-purple-600 text-sm font-medium mb-2">Margen</p>
              <p className="text-3xl font-bold text-purple-600">{totalIncome > 0 ? ((totalProfit / totalIncome) * 100).toFixed(1) : 0}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Ingresos vs Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ingresos" fill="#10b981" />
                  <Bar dataKey="gastos" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Tendencia de Ganancias</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ganancia" stroke="#8b5cf6" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Management */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Gestión de Inventario</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddInventory} className="space-y-4 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Tipo de producto"
                  value={inventoryForm.productType}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, productType: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Cantidad"
                  value={inventoryForm.quantity}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, quantity: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Costo"
                  value={inventoryForm.cost}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, cost: e.target.value })}
                />
                <Input
                  placeholder="Referencia"
                  value={inventoryForm.referenceNumber}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, referenceNumber: e.target.value })}
                />
              </div>
              <Button type="submit" className="gap-2">
                <Plus className="w-4 h-4" />
                Agregar Compra
              </Button>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Producto</th>
                    <th className="px-4 py-2 text-left">Cantidad</th>
                    <th className="px-4 py-2 text-left">Costo</th>
                    <th className="px-4 py-2 text-left">Referencia</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryData.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-4 py-2">{item.productType}</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2">${(item.cost / 100).toLocaleString("es-CO")}</td>
                      <td className="px-4 py-2">{item.referenceNumber}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                          {item.status === "completed" ? "Completada" : "Pendiente"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Export Button */}
        <Button className="gap-2 mb-8">
          <Download className="w-4 h-4" />
          Exportar a Google Sheets
        </Button>
      </div>
    </div>
  );
}
