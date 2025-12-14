import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fish, Store, Calendar, Users, Save, Star } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

const Dashboard = () => {
  const { t } = useLanguage();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const userGrowthData = [
    { month: "Jan", users: 1200 },
    { month: "Fev", users: 1800 },
    { month: "Mar", users: 2500 },
    { month: "Abr", users: 3100 },
    { month: "Mai", users: 4200 },
    { month: "Jun", users: 5320 },
  ];

  const bookingsData = [
    { month: "Jan", bookings: 78 },
    { month: "Fev", bookings: 105 },
    { month: "Mar", bookings: 145 },
    { month: "Abr", bookings: 128 },
    { month: "Mai", bookings: 198 },
    { month: "Jun", bookings: 215 },
  ];

  const recentActivities = [
    {
      id: 1,
      user: "Carlos Silva",
      action: 'agendou uma pescaria com João "Pé de Pano"',
      time: "2 horas atrás",
      avatar: "CS"
    },
    {
      id: 2,
      user: "Ana Pereira",
      action: "avaliou a Pousada do Pescador Feliz",
      time: "5 horas atrás",
      avatar: "AP"
    },
    {
      id: 3,
      user: "Pedro Martins",
      action: "se cadastrou como Pescador",
      time: "1 dia atrás",
      avatar: "PM"
    },
    {
      id: 4,
      user: "Mariana Costa",
      action: "adicionou novas fotos ao seu perfil de Guia de Pesca",
      time: "2 dias atrás",
      avatar: "MC"
    },
  ];

  const stats = [
    {
      title: t('dashboard.registeredGuides'),
      value: "152",
      change: "+10% no último mês",
      icon: Fish,
      color: "text-primary"
    },
    {
      title: t('dashboard.partnerCompanies'),
      value: "78",
      change: "+5% no último mês",
      icon: Store,
      color: "text-secondary"
    },
    {
      title: t('dashboard.bookings'),
      value: "1245",
      change: "+150 este mês",
      icon: Calendar,
      color: "text-accent"
    },
    {
      title: t('dashboard.activeAnglers'),
      value: "5320",
      change: "+20% no último mês",
      icon: Users,
      color: "text-primary"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t('dashboard.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('dashboard.subtitle')}
            </p>
          </div>
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            {t('dashboard.saveProjectState')}
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-primary">
                  +10% {t('common.lastMonthGrowth')}
                </p>
              </CardContent>
            </Card>
          ))}

          {/* Rating Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('dashboard.averageRating')}
              </CardTitle>
              <Star className="w-5 h-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t('dashboard.guides')}:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm font-semibold ml-1">4.8</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t('dashboard.companies')}:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm font-semibold ml-1">4.6</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.userGrowth')}</CardTitle>
              <CardDescription>
                {t('dashboard.userGrowthDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bookings Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.bookingsPerMonth')}</CardTitle>
              <CardDescription>
                {t('dashboard.bookingsPerMonthDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bookingsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar 
                    dataKey="bookings" 
                    fill="hsl(var(--primary))" 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentActivities')}</CardTitle>
            <CardDescription>
              {t('dashboard.recentActivitiesDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-ocean text-primary-foreground">
                      {activity.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">{activity.user}</span>{" "}
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 px-4 mt-12">
        <div className="container mx-auto text-center">
          <p className="text-sm opacity-90">
            © 2025 MasterFisher. {t('common.allRightsReserved')}.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
