interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'suspended';
  lastSeen: string;
  deviceId?: string;
}

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

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

class MockApiService {
  private users: User[] = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Tourist', status: 'active', lastSeen: '2024-01-15T10:30:00Z', deviceId: 'DEV001' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Guide', status: 'active', lastSeen: '2024-01-15T11:15:00Z', deviceId: 'DEV002' },
    { id: '3', name: 'Carol Brown', email: 'carol@example.com', role: 'Tourist', status: 'suspended', lastSeen: '2024-01-14T16:45:00Z', deviceId: 'DEV003' },
  ];

  private alerts: Alert[] = [
    { id: '1', type: 'emergency', title: 'SOS Signal Detected', description: 'Emergency signal from device DEV001 in sector A-7', timestamp: '2024-01-15T12:00:00Z', status: 'active', severity: 'critical', location: 'Sector A-7' },
    { id: '2', type: 'warning', title: 'Low Battery Warning', description: 'Multiple devices reporting low battery levels', timestamp: '2024-01-15T11:30:00Z', status: 'acknowledged', severity: 'medium', location: 'Sector B-3' },
  ];

  private auditLogs: AuditLog[] = [];
  private currentUser: any = null;

  private async simulateLatency(ms: number = 300) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  private addAuditLog(action: string, user: string, details: string) {
    this.auditLogs.push({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      user,
      details
    });
  }

  async login(email: string, password: string) {
    await this.simulateLatency();
    
    if (email === 'admin@gmail.com' && password === 'admin123') {
      const user = { id: '1', email, name: 'Admin User', role: 'Administrator' };
      this.currentUser = user;
      this.addAuditLog('Login', user.name, 'Successful admin login');
      
      return {
        token: 'mock-jwt-token-' + Date.now(),
        expiresInSec: 900,
        user
      };
    }
    
    throw new Error('Invalid credentials');
  }

  async getStats() {
    await this.simulateLatency();
    return {
      activeTourists: this.users.filter(u => u.status === 'active').length,
      recentSOS: this.alerts.filter(a => a.type === 'emergency' && a.status === 'active').length,
      networkHealthPct: 87
    };
  }

  async getUsers(page: number = 1, pageSize: number = 10, search: string = '') {
    await this.simulateLatency();
    
    let filteredUsers = this.users;
    if (search) {
      filteredUsers = this.users.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      users: filteredUsers.slice(start, end),
      total: filteredUsers.length,
      page,
      pageSize
    };
  }

  async getAlerts() {
    await this.simulateLatency();
    return this.alerts;
  }

  async acknowledgeAlert(alertId: string) {
    await this.simulateLatency();
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'acknowledged';
      this.addAuditLog('Alert Acknowledged', this.currentUser?.name || 'Unknown', `Alert ${alertId} acknowledged`);
    }
    return { success: true };
  }

  async toggleUserSuspension(userId: string) {
    await this.simulateLatency();
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.status = user.status === 'active' ? 'suspended' : 'active';
      this.addAuditLog('User Status Changed', this.currentUser?.name || 'Unknown', `User ${user.name} ${user.status}`);
    }
    return { success: true };
  }

  async getMeshStatus() {
    await this.simulateLatency();
    return {
      quantumPairs: 12,
      recentRelays: 45,
      networkNodes: this.users.filter(u => u.status === 'active').length,
      lastUpdate: new Date().toISOString()
    };
  }

  async getBehavioralScore(deviceId: string) {
    await this.simulateLatency();
    return {
      score: Math.floor(Math.random() * 100),
      factors: {
        movementPattern: Math.floor(Math.random() * 100),
        socialInteraction: Math.floor(Math.random() * 100),
        locationConsistency: Math.floor(Math.random() * 100),
        deviceUsage: Math.floor(Math.random() * 100)
      },
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
    };
  }

  async getEvidence(deviceId: string, start?: string, end?: string) {
    await this.simulateLatency();
    return [
      {
        id: '1',
        type: 'location',
        timestamp: '2024-01-15T10:00:00Z',
        data: { lat: 40.7128, lng: -74.0060 },
        preserved: true
      },
      {
        id: '2',
        type: 'interaction',
        timestamp: '2024-01-15T10:15:00Z',
        data: { interaction: 'mesh_relay', target: 'DEV002' },
        preserved: false
      }
    ];
  }

  async preserveEvidence(evidenceId: string) {
    await this.simulateLatency();
    this.addAuditLog('Evidence Preserved', this.currentUser?.name || 'Unknown', `Evidence ${evidenceId} preserved`);
    return { success: true };
  }

  async getAuditLogs(filter?: string) {
    await this.simulateLatency();
    let logs = [...this.auditLogs].reverse();
    if (filter) {
      logs = logs.filter(log => 
        log.action.toLowerCase().includes(filter.toLowerCase()) ||
        log.user.toLowerCase().includes(filter.toLowerCase())
      );
    }
    return logs;
  }

  async runSimulation() {
    await this.simulateLatency(500);
    
    // Create simulated emergency
    const emergencyAlert: Alert = {
      id: Date.now().toString(),
      type: 'emergency',
      title: 'Simulated Emergency Event',
      description: 'Tourist in distress - swarm mobilization initiated',
      timestamp: new Date().toISOString(),
      status: 'active',
      severity: 'critical',
      location: 'Simulation Area'
    };
    
    this.alerts.unshift(emergencyAlert);
    this.addAuditLog('Simulation Started', this.currentUser?.name || 'System', 'Emergency simulation initiated');
    
    return { success: true, alertId: emergencyAlert.id };
  }
}

export const mockApi = new MockApiService();