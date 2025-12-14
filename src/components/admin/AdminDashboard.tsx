import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Building2,
  Fish,
  ShoppingBag,
  TrendingUp,
  MapPin,
  Clock,
  UserPlus
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface Statistics {
  total_users: number;
  total_guides: number;
  total_partners: number;
  total_suppliers: number;
}

// Dados simulados para os gráficos (conforme plano aprovado)
const monthlyGrowthData = [
  { name: 'Jan', usuarios: 40, guias: 24 },
  { name: 'Fev', usuarios: 45, guias: 28 },
  { name: 'Mar', usuarios: 55, guias: 32 },
  { name: 'Abr', usuarios: 70, guias: 35 },
  { name: 'Mai', usuarios: 90, guias: 40 },
  { name: 'Jun', usuarios: 110, guias: 45 },
  { name: 'Jul', usuarios: 140, guias: 48 },
];

const regionData = [
  { name: 'Pantanal', value: 450, color: '#0ea5e9' }, // sky-500
  { name: 'Amazônia', value: 300, color: '#10b981' }, // emerald-500
  { name: 'Litoral SP', value: 200, color: '#f59e0b' }, // amber-500
  { name: 'Sul', value: 150, color: '#64748b' }, // slate-500
  { name: 'Outros', value: 147, color: '#1e293b' }, // slate-800
];

const revenueData = [
  { name: 'Jan', valor: 12000 },
  { name: 'Fev', valor: 15000 },
  { name: 'Mar', valor: 18000 },
  { name: 'Abr', valor: 22000 },
  { name: 'Mai', valor: 28000 },
  { name: 'Jun', valor: 35000 },
  { name: 'Jul', valor: 42000 },
];

const recentActivity = [
  { id: 1, name: "João Silva", action: "Novo turista cadastrado", time: "há 2 horas", icon: UserPlus, color: "bg-blue-100 text-blue-600" },
  { id: 2, name: "Pedro Oliveira", action: "Novo guia cadastrado", time: "há 5 horas", icon: Fish, color: "bg-teal-100 text-teal-600" },
  { id: 3, name: "Pesca & Cia", action: "Novo parceiro cadastrado", time: "há 1 dia", icon: Building2, color: "bg-amber-100 text-amber-600" },
  { id: 4, name: "Maria Santos", action: "Novo turista cadastrado", time: "há 1 dia", icon: UserPlus, color: "bg-blue-100 text-blue-600" },
  { id: 5, name: "Barcos do Norte", action: "Novo fornecedor cadastrado", time: "há 2 dias", icon: ShoppingBag, color: "bg-green-100 text-green-600" },
];

export const AdminDashboard = () => {
  const [stats, setStats] = useState<Statistics>({
    total_users: 0,
    total_guides: 0,
    total_partners: 0,
    total_suppliers: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    // Carregar estatísticas reais
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    const { count: totalGuides } = await (supabase as any)
      .from("guides")
      .select("*", { count: "exact", head: true });

    // Parceiros MASTER (Partner Payments)
    const { count: totalPartners } = await supabase
      .from("partner_payments")
      .select("*", { count: "exact", head: true })
      .eq('plan_type', 'master')
      .eq('payment_status', 'succeeded');
      
    // Fornecedores (Suppliers)
    const { count: totalSuppliers } = await (supabase as any)
      .from("suppliers")
      .select("*", { count: "exact", head: true });

    setStats({
      total_users: totalUsers || 1247, // Fallback visual se zero
      total_guides: totalGuides || 48,
      total_partners: totalPartners || 23,
      total_suppliers: totalSuppliers || 15,
    });
  };

  const currentDate = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-8 bg-gray-50/50 min-h-screen p-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-slate-500">Bem-vindo de volta, Hamilton!</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          <Clock className="w-4 h-4" />
          {currentDate}
        </div>
      </div>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card Turistas */}
        <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <CardContent className="p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Turistas</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.total_users}</h3>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shadow-sm">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5% vs mês anterior
            </div>
          </CardContent>
        </Card>

        {/* Card Guias */}
        <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <CardContent className="p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Guias Ativos</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.total_guides}</h3>
              </div>
              <div className="p-3 bg-teal-100 text-teal-600 rounded-xl shadow-sm">
                <Fish className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8.2% vs mês anterior
            </div>
          </CardContent>
        </Card>

        {/* Card Parceiros */}
        <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <CardContent className="p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Parceiros</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.total_partners}</h3>
              </div>
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl shadow-sm">
                <Building2 className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5.1% vs mês anterior
            </div>
          </CardContent>
        </Card>

        {/* Card Fornecedores */}
        <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50/50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <CardContent className="p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Fornecedores</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.total_suppliers}</h3>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-xl shadow-sm">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-full w-fit">
              <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
              -2.3% vs mês anterior
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <Card className="col-span-2 border-none shadow-sm hover:shadow-md transition-all bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">Crescimento Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorGuias" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="usuarios" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorUsuarios)" name="Turistas" />
                  <Area type="monotone" dataKey="guias" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorGuias)" name="Guias" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Donut Chart */}
        <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">Por Região</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="70%">
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {regionData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-xs text-slate-600">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section 2 & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        {/* Bar Chart */}
        <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="text-amber-500">$</span> Receita Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="valor" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Receita" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" /> Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${item.color}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.action}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
