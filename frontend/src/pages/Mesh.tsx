import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Network, Zap, Activity, Users, RadioIcon } from 'lucide-react';
import { mockApi } from '@/services/mockApi';
import { useToast } from '@/hooks/use-toast';

interface MeshStatus {
  quantumPairs: number;
  recentRelays: number;
  networkNodes: number;
  lastUpdate: string;
}

export const Mesh = () => {
  const [meshStatus, setMeshStatus] = useState<MeshStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadMeshStatus = async () => {
    try {
      const data = await mockApi.getMeshStatus();
      setMeshStatus(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load mesh status',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMeshStatus();
    const interval = setInterval(loadMeshStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const simulateRelay = async () => {
    try {
      toast({
        title: 'Relay Simulation',
        description: 'Mesh relay simulation initiated',
      });
      // Simulate network activity
      setTimeout(() => {
        loadMeshStatus();
      }, 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to simulate relay',
        variant: 'destructive',
      });
    }
  };

  const networkNodes = [
    { id: 'DEV001', name: 'Alice Johnson', status: 'active', connections: 3, signalStrength: 85 },
    { id: 'DEV002', name: 'Bob Smith', status: 'active', connections: 2, signalStrength: 92 },
    { id: 'DEV003', name: 'Carol Brown', status: 'suspended', connections: 0, signalStrength: 0 },
    { id: 'DEV004', name: 'David Wilson', status: 'active', connections: 4, signalStrength: 78 },
  ];

  const quantumPairs = [
    { pair: 'QP-001', devices: ['DEV001', 'DEV002'], entanglement: 98, lastSync: '2024-01-15T12:30:00Z' },
    { pair: 'QP-002', devices: ['DEV002', 'DEV004'], entanglement: 95, lastSync: '2024-01-15T12:25:00Z' },
    { pair: 'QP-003', devices: ['DEV001', 'DEV004'], entanglement: 87, lastSync: '2024-01-15T12:20:00Z' },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mesh Network</h1>
          <p className="text-muted-foreground">Quantum-entangled mesh communication status</p>
        </div>
        <Button onClick={simulateRelay} className="bg-gradient-to-r from-primary to-primary-glow">
          <Zap className="mr-2 h-4 w-4" />
          Simulate Relay
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quantum Pairs</CardTitle>
            <Network className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : meshStatus?.quantumPairs}</div>
            <p className="text-xs text-muted-foreground">Active entanglements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Relays</CardTitle>
            <Activity className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : meshStatus?.recentRelays}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Nodes</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : meshStatus?.networkNodes}</div>
            <p className="text-xs text-muted-foreground">Connected devices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Health</CardTitle>
            <RadioIcon className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">Overall status</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Nodes */}
        <Card>
          <CardHeader>
            <CardTitle>Network Nodes</CardTitle>
            <CardDescription>Active mesh network participants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {networkNodes.map((node) => (
                <div key={node.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${node.status === 'active' ? 'bg-success' : 'bg-muted'}`} />
                    <div>
                      <p className="font-medium">{node.name}</p>
                      <p className="text-sm text-muted-foreground">{node.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{node.connections} connections</p>
                    <p className="text-xs text-muted-foreground">{node.signalStrength}% signal</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quantum Pairs */}
        <Card>
          <CardHeader>
            <CardTitle>Quantum Pairs</CardTitle>
            <CardDescription>Entangled device communications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quantumPairs.map((pair) => (
                <div key={pair.pair} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{pair.pair}</p>
                    <Badge variant="outline">{pair.entanglement}% entangled</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {pair.devices[0]} ↔ {pair.devices[1]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last sync: {new Date(pair.lastSync).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};