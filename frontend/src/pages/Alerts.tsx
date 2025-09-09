import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, MapPin } from 'lucide-react';
import { mockApi } from '@/services/mockApi';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  type: 'emergency' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
}

export const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadAlerts = async () => {
    try {
      setIsLoading(true);
      const data = await mockApi.getAlerts();
      setAlerts(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load alerts',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAcknowledge = async (alertId: string) => {
    try {
      await mockApi.acknowledgeAlert(alertId);
      await loadAlerts();
      toast({
        title: 'Alert Acknowledged',
        description: 'Alert has been marked as acknowledged',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to acknowledge alert',
        variant: 'destructive',
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string, severity: string) => {
    if (type === 'emergency' || severity === 'critical') {
      return <AlertTriangle className="h-5 w-5 text-destructive" />;
    }
    return <AlertTriangle className="h-5 w-5 text-warning" />;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const acknowledgedAlerts = alerts.filter(alert => alert.status === 'acknowledged');

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alert Center</h1>
          <p className="text-muted-foreground">Emergency and system alerts</p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="destructive" className="text-sm">
            {activeAlerts.length} Active
          </Badge>
          <Badge variant="outline" className="text-sm">
            {acknowledgedAlerts.length} Acknowledged
          </Badge>
        </div>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span>Active Alerts</span>
          </CardTitle>
          <CardDescription>
            Alerts requiring immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading alerts...</div>
          ) : activeAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No active alerts
            </div>
          ) : (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="border border-border rounded-lg p-4 bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-3">
                      {getTypeIcon(alert.type, alert.severity)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{alert.title}</h3>
                          <Badge variant={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{alert.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTimestamp(alert.timestamp)}</span>
                          </div>
                          {alert.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{alert.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="bg-gradient-to-r from-primary to-primary-glow"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Acknowledge
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acknowledged Alerts */}
      {acknowledgedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Acknowledged Alerts</span>
            </CardTitle>
            <CardDescription>
              Recently acknowledged alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {acknowledgedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="border border-border rounded-lg p-3 bg-muted/30 opacity-75"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-3">
                      <CheckCircle className="h-4 w-4 text-success mt-1" />
                      <div>
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline">Acknowledged</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};