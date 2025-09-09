import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Activity, Download, Search, Filter, Clock, User } from 'lucide-react';
import { mockApi } from '@/services/mockApi';
import { useToast } from '@/hooks/use-toast';

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

export const Audit = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const { toast } = useToast();

  const loadAuditLogs = async (filter?: string) => {
    try {
      setIsLoading(true);
      const data = await mockApi.getAuditLogs(filter);
      setAuditLogs(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load audit logs',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
    const interval = setInterval(() => loadAuditLogs(searchFilter), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    loadAuditLogs(searchFilter);
  };

  const handleExport = () => {
    const exportData = auditLogs.map(log => ({
      timestamp: log.timestamp,
      action: log.action,
      user: log.user,
      details: log.details
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export Complete',
      description: 'Audit log exported successfully',
    });
  };

  const getActionBadge = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('login')) return 'default';
    if (actionLower.includes('alert') || actionLower.includes('emergency')) return 'destructive';
    if (actionLower.includes('suspend') || actionLower.includes('status')) return 'secondary';
    if (actionLower.includes('preserve') || actionLower.includes('evidence')) return 'outline';
    if (actionLower.includes('simulation')) return 'default';
    return 'outline';
  };

  const auditStats = {
    totalActions: auditLogs.length,
    uniqueUsers: new Set(auditLogs.map(log => log.user)).size,
    recentActions: auditLogs.filter(log => {
      const hour = 60 * 60 * 1000;
      return Date.now() - new Date(log.timestamp).getTime() < 24 * hour;
    }).length,
    criticalActions: auditLogs.filter(log => 
      log.action.toLowerCase().includes('alert') || 
      log.action.toLowerCase().includes('emergency') ||
      log.action.toLowerCase().includes('preserve')
    ).length
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Log</h1>
          <p className="text-muted-foreground">Complete system activity and security audit trail</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => loadAuditLogs(searchFilter)} className="bg-gradient-to-r from-primary to-primary-glow">
            <Activity className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Audit Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditStats.totalActions}</div>
            <p className="text-xs text-muted-foreground">Logged activities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <User className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditStats.uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">Active administrators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Actions</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditStats.recentActions}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Actions</CardTitle>
            <Filter className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditStats.criticalActions}</div>
            <p className="text-xs text-muted-foreground">High-priority events</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search Audit Logs</CardTitle>
          <CardDescription>Filter by action, user, or details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search audit logs..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-8"
              />
            </div>
            <Button onClick={handleSearch} variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Chronological system activity records</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading audit logs...</div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No audit logs found
            </div>
          ) : (
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="border border-border rounded-lg p-4 bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={getActionBadge(log.action)}>
                          {log.action}
                        </Badge>
                        <span className="text-sm text-muted-foreground">by {log.user}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>ID: {log.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance Information */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance & Security</CardTitle>
          <CardDescription>Audit trail standards and security measures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Audit Standards</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• ISO 27001 compliance framework</li>
                <li>• Immutable log storage</li>
                <li>• Real-time activity monitoring</li>
                <li>• Automated integrity verification</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Data Protection</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Encrypted log transmission</li>
                <li>• Access control enforcement</li>
                <li>• Retention policy compliance</li>
                <li>• Privacy-preserving analytics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};