import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, AlertTriangle, Activity, TrendingUp, MapPin, Zap, User, Settings, LogOut } from 'lucide-react';
import { mockApi } from '@/services/mockApi';
import { PheromoneMap } from '@/components/PheromoneMap';
import { SimulatorPanel } from '@/components/SimulatorPanel';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { authService } from '@/services/auth';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  activeTourists: number;
  recentSOS: number;
  networkHealthPct: number;
}

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = authService.getUser();

  const loadStats = async () => {
    try {
      const data = await mockApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: 'Active Tourists',
      value: stats?.activeTourists || 0,
      icon: Users,
      description: 'Currently connected devices',
      trend: '+12%',
      color: 'text-primary'
    },
    {
      title: 'Active Alerts',
      value: stats?.recentSOS || 0,
      icon: AlertTriangle,
      description: 'Emergency signals detected',
      trend: '-8%',
      color: 'text-warning'
    },
    {
      title: 'Network Health',
      value: `${stats?.networkHealthPct || 0}%`,
      icon: Activity,
      description: 'Mesh network status',
      trend: '+3%',
      color: 'text-success'
    },
    {
      title: 'Performance',
      value: '99.2%',
      icon: TrendingUp,
      description: 'System uptime',
      trend: '+0.1%',
      color: 'text-primary'
    }
  ];

  const riskPredictions = [
    { area: 'Sector A-7', risk: 'High', reason: 'Weather conditions deteriorating' },
    { area: 'Sector B-3', risk: 'Medium', reason: 'Increased tourist density' },
    { area: 'Sector C-1', risk: 'Low', reason: 'Stable conditions' }
  ];

  const culturalInsights = [
    { insight: 'Peak activity hours', value: '2-4 PM local time' },
    { insight: 'Popular gathering spots', value: 'Viewpoint Alpha, Trail Junction' },
    { insight: 'Communication patterns', value: 'Increased mesh relay usage' }
  ];

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const goToSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Real-time system overview and analytics</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button className="bg-gradient-to-r from-primary to-primary-glow">
            <Zap className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          
          {/* Admin Profile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt={currentUser?.name || 'Admin'} />
                  <AvatarFallback>
                    {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block">{currentUser?.name || 'Admin'}</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Admin Profile</SheetTitle>
                <SheetDescription>
                  Account information and quick actions
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg" alt={currentUser?.name || 'Admin'} />
                    <AvatarFallback className="text-xl">
                      {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{currentUser?.name || 'Admin User'}</h3>
                    <p className="text-muted-foreground">{currentUser?.email || 'admin@lovable.dev'}</p>
                    <Badge variant="outline">{currentUser?.role || 'Administrator'}</Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button onClick={goToSettings} className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Go to Settings
                  </Button>
                  <Button onClick={handleLogout} variant="destructive" className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Session Info</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Logged in since: {new Date().toLocaleDateString()}</p>
                    <p>Access Level: Full Administrator</p>
                    <p>Session: Active</p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Card key={card.title} className="relative overflow-hidden group hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : card.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{card.description}</p>
                <Badge variant="outline" className="text-xs">
                  {card.trend}
                </Badge>
              </div>
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pheromone Map */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Pheromone Trail Network</span>
            </CardTitle>
            <CardDescription>
              Real-time visualization of tourist movement and communication patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PheromoneMap />
          </CardContent>
        </Card>

        {/* Simulator Panel */}
        <Card>
          <CardHeader>
            <CardTitle>System Simulator</CardTitle>
            <CardDescription>
              Test emergency scenarios and swarm responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimulatorPanel />
          </CardContent>
        </Card>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictive Risk */}
        <Card>
          <CardHeader>
            <CardTitle>Predictive Risk Assessment</CardTitle>
            <CardDescription>AI-powered risk analysis by sector</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskPredictions.map((prediction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{prediction.area}</p>
                    <p className="text-sm text-muted-foreground">{prediction.reason}</p>
                  </div>
                  <Badge 
                    variant={prediction.risk === 'High' ? 'destructive' : prediction.risk === 'Medium' ? 'secondary' : 'outline'}
                  >
                    {prediction.risk}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cultural Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Cultural Insights</CardTitle>
            <CardDescription>Behavioral patterns and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {culturalInsights.map((insight, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg">
                  <p className="font-medium text-sm">{insight.insight}</p>
                  <p className="text-foreground">{insight.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};