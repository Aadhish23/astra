import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Network,
  Brain,
  FileText,
  Settings,
  Activity,
  Shield
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
  { name: 'Mesh Network', href: '/mesh', icon: Network },
  { name: 'Behavior Analysis', href: '/behavior', icon: Brain },
  { name: 'Evidence', href: '/evidence', icon: FileText },
  { name: 'Audit Log', href: '/audit', icon: Activity },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="bg-sidebar border-r border-sidebar-border w-64 flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-sidebar-foreground">Control Center</span>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};