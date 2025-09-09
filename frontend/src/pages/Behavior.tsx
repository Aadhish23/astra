import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { mockApi } from '@/services/mockApi';
import { useToast } from '@/hooks/use-toast';

interface BehavioralScore {
  score: number;
  factors: {
    movementPattern: number;
    socialInteraction: number;
    locationConsistency: number;
    deviceUsage: number;
  };
  riskLevel: string;
}

export const Behavior = () => {
  const [selectedDevice, setSelectedDevice] = useState<string>('DEV001');
  const [behavioralData, setBehavioralData] = useState<BehavioralScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const devices = [
    { id: 'DEV001', name: 'Alice Johnson' },
    { id: 'DEV002', name: 'Bob Smith' },
    { id: 'DEV003', name: 'Carol Brown' },
    { id: 'DEV004', name: 'David Wilson' },
  ];

  const loadBehavioralScore = async (deviceId: string) => {
    try {
      setIsLoading(true);
      const data = await mockApi.getBehavioralScore(deviceId);
      setBehavioralData(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load behavioral analysis',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDevice) {
      loadBehavioralScore(selectedDevice);
    }
  }, [selectedDevice]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <TrendingUp className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const factorLabels = {
    movementPattern: 'Movement Pattern',
    socialInteraction: 'Social Interaction',
    locationConsistency: 'Location Consistency',
    deviceUsage: 'Device Usage'
  };

  const behavioralInsights = [
    { 
      title: 'Movement Anomaly Detection',
      description: 'AI detects unusual movement patterns that deviate from normal tourist behavior',
      status: 'active'
    },
    {
      title: 'Social Network Analysis',
      description: 'Monitors interaction patterns and communication frequencies',
      status: 'monitoring'
    },
    {
      title: 'Predictive Risk Modeling',
      description: 'Machine learning algorithms assess potential emergency scenarios',
      status: 'active'
    },
    {
      title: 'Cultural Adaptation Analysis',
      description: 'Tracks behavioral adaptation to local customs and environments',
      status: 'monitoring'
    }
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Behavior Analysis</h1>
          <p className="text-muted-foreground">AI-powered behavioral pattern analysis and risk assessment</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedDevice} onValueChange={setSelectedDevice}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select device" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => (
                <SelectItem key={device.id} value={device.id}>
                  {device.name} ({device.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Behavioral Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <Brain className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : behavioralData?.score || 0}</div>
            <p className="text-xs text-muted-foreground">Behavioral normalcy index</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            {behavioralData && getRiskIcon(behavioralData.riskLevel)}
          </CardHeader>
          <CardContent>
            <Badge variant={behavioralData ? getRiskColor(behavioralData.riskLevel) : 'outline'} className="text-sm">
              {isLoading ? '...' : behavioralData?.riskLevel?.toUpperCase() || 'UNKNOWN'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">Current assessment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Device</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{selectedDevice}</div>
            <p className="text-xs text-muted-foreground">
              {devices.find(d => d.id === selectedDevice)?.name}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Factor Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Behavioral Factors</CardTitle>
            <CardDescription>AI analysis of individual behavioral components</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Analyzing behavioral patterns...</div>
            ) : behavioralData ? (
              <div className="space-y-4">
                {Object.entries(behavioralData.factors).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{factorLabels[key as keyof typeof factorLabels]}</span>
                      <span className="text-sm text-muted-foreground">{value}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Select a device to view analysis
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle>AI Behavioral Insights</CardTitle>
            <CardDescription>Active monitoring and analysis systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {behavioralInsights.map((insight, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge variant={insight.status === 'active' ? 'default' : 'secondary'}>
                      {insight.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Explainability Panel */}
      <Card>
        <CardHeader>
          <CardTitle>AI Explainability</CardTitle>
          <CardDescription>Understanding the behavioral analysis algorithm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Algorithm Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Isolation Forest anomaly detection</li>
                <li>• Temporal movement pattern analysis</li>
                <li>• Social graph connectivity metrics</li>
                <li>• Geospatial consistency scoring</li>
                <li>• Device interaction frequency</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Decision Factors</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Historical behavior baseline comparison</li>
                <li>• Peer group behavioral norms</li>
                <li>• Environmental context awareness</li>
                <li>• Time-of-day activity patterns</li>
                <li>• Communication protocol adherence</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};