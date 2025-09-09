import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Shield, MapPin, Clock, CheckCircle } from 'lucide-react';
import { mockApi } from '@/services/mockApi';
import { useToast } from '@/hooks/use-toast';

interface Evidence {
  id: string;
  type: string;
  timestamp: string;
  data: any;
  preserved: boolean;
}

export const Evidence = () => {
  const [selectedDevice, setSelectedDevice] = useState<string>('DEV001');
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreserving, setIsPreserving] = useState<string | null>(null);
  const { toast } = useToast();

  const devices = [
    { id: 'DEV001', name: 'Alice Johnson' },
    { id: 'DEV002', name: 'Bob Smith' },
    { id: 'DEV003', name: 'Carol Brown' },
    { id: 'DEV004', name: 'David Wilson' },
  ];

  const loadEvidence = async (deviceId: string) => {
    try {
      setIsLoading(true);
      const data = await mockApi.getEvidence(deviceId);
      setEvidence(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load evidence',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const preserveEvidence = async (evidenceId: string) => {
    try {
      setIsPreserving(evidenceId);
      await mockApi.preserveEvidence(evidenceId);
      await loadEvidence(selectedDevice);
      toast({
        title: 'Evidence Preserved',
        description: 'Evidence has been cryptographically secured',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to preserve evidence',
        variant: 'destructive',
      });
    } finally {
      setIsPreserving(null);
    }
  };

  useEffect(() => {
    if (selectedDevice) {
      loadEvidence(selectedDevice);
    }
  }, [selectedDevice]);

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'location': return <MapPin className="h-4 w-4" />;
      case 'interaction': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatEvidenceData = (type: string, data: any) => {
    switch (type) {
      case 'location':
        return `Lat: ${data.lat}, Lng: ${data.lng}`;
      case 'interaction':
        return `${data.interaction} with ${data.target}`;
      default:
        return JSON.stringify(data);
    }
  };

  const evidenceVaultStats = {
    totalEvidence: evidence.length,
    preservedItems: evidence.filter(e => e.preserved).length,
    criticalEvidence: evidence.filter(e => e.type === 'location').length,
    recentCaptures: evidence.filter(e => {
      const hour = 60 * 60 * 1000;
      return Date.now() - new Date(e.timestamp).getTime() < 24 * hour;
    }).length
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Evidence Vault</h1>
          <p className="text-muted-foreground">Secure forensic evidence collection and preservation</p>
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

      {/* Vault Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Evidence</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evidenceVaultStats.totalEvidence}</div>
            <p className="text-xs text-muted-foreground">Collected items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preserved</CardTitle>
            <Shield className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evidenceVaultStats.preservedItems}</div>
            <p className="text-xs text-muted-foreground">Cryptographically secured</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Evidence</CardTitle>
            <MapPin className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evidenceVaultStats.criticalEvidence}</div>
            <p className="text-xs text-muted-foreground">Location data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Captures</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evidenceVaultStats.recentCaptures}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Evidence List */}
      <Card>
        <CardHeader>
          <CardTitle>Evidence Collection</CardTitle>
          <CardDescription>
            Digital forensic evidence for device {selectedDevice}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading evidence...</div>
          ) : evidence.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No evidence found for this device
            </div>
          ) : (
            <div className="space-y-4">
              {evidence.map((item) => (
                <div
                  key={item.id}
                  className="border border-border rounded-lg p-4 bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-3">
                      {getEvidenceIcon(item.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold capitalize">{item.type} Evidence</h3>
                          <Badge variant={item.preserved ? 'default' : 'secondary'}>
                            {item.preserved ? 'Preserved' : 'Temporary'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {formatEvidenceData(item.type, item.data)}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(item.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {!item.preserved && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Shield className="mr-2 h-4 w-4" />
                              Preserve
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Preserve Evidence</DialogTitle>
                              <DialogDescription>
                                This action will cryptographically preserve this evidence item with multi-party consent.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="p-4 bg-muted rounded-lg">
                                <h4 className="font-medium mb-2">Evidence Details</h4>
                                <p className="text-sm text-muted-foreground">
                                  Type: {item.type}<br/>
                                  Timestamp: {new Date(item.timestamp).toLocaleString()}<br/>
                                  Data: {formatEvidenceData(item.type, item.data)}
                                </p>
                              </div>
                              <div className="p-4 bg-primary/10 rounded-lg">
                                <h4 className="font-medium mb-2 flex items-center">
                                  <Shield className="mr-2 h-4 w-4" />
                                  Preservation Protocol
                                </h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  <li>• Cryptographic hash generation</li>
                                  <li>• Multi-party digital signatures</li>
                                  <li>• Blockchain timestamping</li>
                                  <li>• Immutable storage commitment</li>
                                </ul>
                              </div>
                              <Button 
                                onClick={() => preserveEvidence(item.id)}
                                disabled={isPreserving === item.id}
                                className="w-full bg-gradient-to-r from-primary to-primary-glow"
                              >
                                {isPreserving === item.id ? (
                                  'Preserving...'
                                ) : (
                                  <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Confirm Preservation
                                  </>
                                )}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      {item.preserved && (
                        <Badge variant="default" className="flex items-center">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Secured
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preservation Status */}
      <Card>
        <CardHeader>
          <CardTitle>Digital Forensics Protocol</CardTitle>
          <CardDescription>Evidence handling and preservation standards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Chain of Custody</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Automated collection timestamps</li>
                <li>• Digital signature verification</li>
                <li>• Immutable audit trail</li>
                <li>• Multi-party witness protocol</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Security Measures</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• End-to-end encryption</li>
                <li>• Tamper-evident storage</li>
                <li>• Quantum-resistant algorithms</li>
                <li>• Distributed preservation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};