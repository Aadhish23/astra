import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Play, Square, Users, Zap, AlertTriangle } from 'lucide-react';
import { mockApi } from '@/services/mockApi';
import { useToast } from '@/hooks/use-toast';

export const SimulatorPanel = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [deviceCount, setDeviceCount] = useState([10]);
  const [simulationSpeed, setSimulationSpeed] = useState([1]);
  const [stats, setStats] = useState({
    activeDevices: 0,
    totalMessages: 0,
    emergencies: 0
  });
  const { toast } = useToast();

  const handleRunDemo = async () => {
    setIsRunning(true);
    
    try {
      toast({
        title: 'Simulation Started',
        description: 'Emergency scenario initiated',
      });

      // Simulate device spawning
      for (let i = 0; i < deviceCount[0]; i++) {
        setStats(prev => ({
          ...prev,
          activeDevices: i + 1,
          totalMessages: prev.totalMessages + Math.floor(Math.random() * 5)
        }));
        await new Promise(resolve => setTimeout(resolve, 100 * simulationSpeed[0]));
      }

      // Trigger emergency simulation
      await mockApi.runSimulation();
      
      setStats(prev => ({
        ...prev,
        emergencies: prev.emergencies + 1
      }));

      toast({
        title: 'Emergency Detected',
        description: 'Swarm mobilization activated',
        variant: 'destructive',
      });

      // Simulate swarm response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Demo Complete',
        description: 'Emergency resolved, evidence preserved',
      });

    } catch (error) {
      toast({
        title: 'Simulation Error',
        description: 'Failed to run demo scenario',
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setStats({
      activeDevices: 0,
      totalMessages: 0,
      emergencies: 0
    });
    toast({
      title: 'Simulation Stopped',
      description: 'All simulated devices cleared',
    });
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Device Count: {deviceCount[0]}</Label>
          <Slider
            value={deviceCount}
            onValueChange={setDeviceCount}
            max={50}
            min={5}
            step={5}
            className="mt-2"
            disabled={isRunning}
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Speed: {simulationSpeed[0]}x</Label>
          <Slider
            value={simulationSpeed}
            onValueChange={setSimulationSpeed}
            max={5}
            min={0.5}
            step={0.5}
            className="mt-2"
            disabled={isRunning}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button 
          onClick={handleRunDemo}
          disabled={isRunning}
          className="flex-1 bg-gradient-to-r from-primary to-primary-glow"
        >
          <Play className="mr-2 h-4 w-4" />
          Run Demo
        </Button>
        <Button 
          onClick={handleStop}
          disabled={!isRunning}
          variant="outline"
        >
          <Square className="mr-2 h-4 w-4" />
          Stop
        </Button>
      </div>

      {/* Status */}
      {isRunning && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Simulation Running</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Devices:</span>
                <Badge variant="outline">{stats.activeDevices}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Messages:</span>
                <Badge variant="outline">{stats.totalMessages}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Quick Actions</h4>
        <div className="grid grid-cols-1 gap-2">
          <Button variant="outline" size="sm" className="justify-start">
            <Users className="mr-2 h-3 w-3" />
            Spawn Tourist Group
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <Zap className="mr-2 h-3 w-3" />
            Test Mesh Relay
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <AlertTriangle className="mr-2 h-3 w-3" />
            Trigger SOS
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded">
        <p className="font-medium mb-1">Demo Flow:</p>
        <ul className="space-y-1">
          <li>• Spawns simulated devices</li>
          <li>• Sends telemetry with pheromone trails</li>
          <li>• Triggers emergency scenario</li>
          <li>• Shows swarm mobilization</li>
          <li>• Preserves evidence chain</li>
        </ul>
      </div>
    </div>
  );
};