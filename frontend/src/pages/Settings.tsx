import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Settings as SettingsIcon, Save, RotateCcw, Shield, Bell, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SystemSettings {
  realTimeMonitoring: boolean;
  alertNotifications: boolean;
  autoAcknowledge: boolean;
  behaviorAnalysis: boolean;
  evidenceAutoPreserve: boolean;
  meshOptimization: boolean;
  dataRetentionDays: number;
  alertThreshold: number;
  simulationMode: boolean;
}

export const Settings = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    realTimeMonitoring: true,
    alertNotifications: true,
    autoAcknowledge: false,
    behaviorAnalysis: true,
    evidenceAutoPreserve: false,
    meshOptimization: true,
    dataRetentionDays: 90,
    alertThreshold: 75,
    simulationMode: false,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  const updateSetting = (key: keyof SystemSettings, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('systemSettings', JSON.stringify(settings));
      setHasChanges(false);
      toast({
        title: 'Settings Saved',
        description: 'Your system settings have been updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    }
  };

  const resetSettings = () => {
    const defaultSettings: SystemSettings = {
      realTimeMonitoring: true,
      alertNotifications: true,
      autoAcknowledge: false,
      behaviorAnalysis: true,
      evidenceAutoPreserve: false,
      meshOptimization: true,
      dataRetentionDays: 90,
      alertThreshold: 75,
      simulationMode: false,
    };
    setSettings(defaultSettings);
    setHasChanges(true);
    toast({
      title: 'Settings Reset',
      description: 'All settings have been reset to defaults',
    });
  };

  const syntheticPing = () => {
    toast({
      title: 'Synthetic Ping Sent',
      description: 'Test signal dispatched to all connected devices',
    });
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">System configuration and preferences</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={resetSettings} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button 
            onClick={saveSettings} 
            disabled={!hasChanges}
            className="bg-gradient-to-r from-primary to-primary-glow"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {hasChanges && (
        <Card className="border-warning">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Unsaved Changes</Badge>
              <span className="text-sm text-muted-foreground">
                You have unsaved changes. Click "Save Changes" to apply them.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>System Monitoring</span>
          </CardTitle>
          <CardDescription>Core system monitoring and alert configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Real-time Monitoring</h4>
              <p className="text-sm text-muted-foreground">Enable continuous system monitoring</p>
            </div>
            <Switch
              checked={settings.realTimeMonitoring}
              onCheckedChange={(checked) => updateSetting('realTimeMonitoring', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Alert Notifications</h4>
              <p className="text-sm text-muted-foreground">Receive immediate notifications for critical alerts</p>
            </div>
            <Switch
              checked={settings.alertNotifications}
              onCheckedChange={(checked) => updateSetting('alertNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Auto-acknowledge Low Priority</h4>
              <p className="text-sm text-muted-foreground">Automatically acknowledge low-priority alerts</p>
            </div>
            <Switch
              checked={settings.autoAcknowledge}
              onCheckedChange={(checked) => updateSetting('autoAcknowledge', checked)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Alert Threshold</h4>
              <Badge variant="outline">{settings.alertThreshold}%</Badge>
            </div>
            <Slider
              value={[settings.alertThreshold]}
              onValueChange={(value) => updateSetting('alertThreshold', value[0])}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Minimum threshold for generating system alerts
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI & Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <span>AI & Analytics</span>
          </CardTitle>
          <CardDescription>Artificial intelligence and behavioral analysis settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Behavioral Analysis</h4>
              <p className="text-sm text-muted-foreground">Enable AI-powered behavioral pattern analysis</p>
            </div>
            <Switch
              checked={settings.behaviorAnalysis}
              onCheckedChange={(checked) => updateSetting('behaviorAnalysis', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Auto Evidence Preservation</h4>
              <p className="text-sm text-muted-foreground">Automatically preserve critical evidence</p>
            </div>
            <Switch
              checked={settings.evidenceAutoPreserve}
              onCheckedChange={(checked) => updateSetting('evidenceAutoPreserve', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Mesh Network Optimization</h4>
              <p className="text-sm text-muted-foreground">Enable intelligent mesh routing optimization</p>
            </div>
            <Switch
              checked={settings.meshOptimization}
              onCheckedChange={(checked) => updateSetting('meshOptimization', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <span>Data Management</span>
          </CardTitle>
          <CardDescription>Data retention and storage configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Data Retention Period</h4>
              <Badge variant="outline">{settings.dataRetentionDays} days</Badge>
            </div>
            <Slider
              value={[settings.dataRetentionDays]}
              onValueChange={(value) => updateSetting('dataRetentionDays', value[0])}
              max={365}
              min={30}
              step={30}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              How long to retain system data and logs
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Simulation Mode</h4>
              <p className="text-sm text-muted-foreground">Enable enhanced simulation and testing features</p>
            </div>
            <Switch
              checked={settings.simulationMode}
              onCheckedChange={(checked) => updateSetting('simulationMode', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>System Testing</span>
          </CardTitle>
          <CardDescription>Network testing and diagnostic tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Synthetic Ping Test</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Send test signals to all connected devices to verify network connectivity
              </p>
              <Button onClick={syntheticPing} variant="outline">
                <Zap className="mr-2 h-4 w-4" />
                Send Synthetic Ping
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Current system status and version information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">System Status</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Version:</span>
                  <span>v2.1.4</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Uptime:</span>
                  <span>7 days, 14 hours</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Last Update:</span>
                  <span>2024-01-15</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Performance</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">CPU Usage:</span>
                  <span>23%</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Memory:</span>
                  <span>2.4 GB / 8 GB</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Storage:</span>
                  <span>45 GB / 500 GB</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};