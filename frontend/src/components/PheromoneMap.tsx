import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
  status: 'active' | 'inactive' | 'emergency';
  connections: string[];
}

interface PheromoneTrail {
  from: string;
  to: string;
  intensity: number;
  type: 'normal' | 'emergency' | 'relay';
}

export const PheromoneMap = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', name: 'Alice', x: 150, y: 100, status: 'active', connections: ['2', '3'] },
    { id: '2', name: 'Bob', x: 300, y: 150, status: 'active', connections: ['1', '4'] },
    { id: '3', name: 'Carol', x: 200, y: 250, status: 'emergency', connections: ['1', '4'] },
    { id: '4', name: 'Dave', x: 400, y: 200, status: 'active', connections: ['2', '3'] },
  ]);

  const [trails, setTrails] = useState<PheromoneTrail[]>([
    { from: '1', to: '2', intensity: 0.8, type: 'normal' },
    { from: '2', to: '4', intensity: 0.6, type: 'relay' },
    { from: '3', to: '1', intensity: 0.9, type: 'emergency' },
    { from: '3', to: '4', intensity: 0.7, type: 'emergency' },
  ]);

  // Simulate pheromone decay and updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTrails(prev => prev.map(trail => ({
        ...trail,
        intensity: Math.max(0.1, trail.intensity - 0.05)
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'emergency': return 'fill-destructive';
      case 'active': return 'fill-primary';
      case 'inactive': return 'fill-muted-foreground';
      default: return 'fill-muted';
    }
  };

  const getTrailColor = (type: string, intensity: number) => {
    const alpha = intensity;
    switch (type) {
      case 'emergency': return `stroke-destructive stroke-opacity-${Math.round(alpha * 100)}`;
      case 'relay': return `stroke-warning stroke-opacity-${Math.round(alpha * 100)}`;
      default: return `stroke-primary stroke-opacity-${Math.round(alpha * 100)}`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Badge variant="outline" className="text-primary">
            4 Active Nodes
          </Badge>
          <Badge variant="destructive">
            1 Emergency
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Last update: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="border border-border rounded-lg bg-background/50 relative overflow-hidden">
        <svg width="500" height="300" className="w-full h-auto">
          {/* Grid background */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" strokeOpacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Pheromone trails */}
          {trails.map((trail, index) => {
            const fromPos = getNodePosition(trail.from);
            const toPos = getNodePosition(trail.to);
            return (
              <g key={index}>
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  strokeWidth={Math.max(1, trail.intensity * 4)}
                  className={getTrailColor(trail.type, trail.intensity)}
                  strokeDasharray={trail.type === 'emergency' ? '5,5' : 'none'}
                >
                  <animate
                    attributeName="stroke-opacity"
                    values={`${trail.intensity};${trail.intensity * 0.3};${trail.intensity}`}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </line>
                {/* Pheromone particles */}
                <circle r="2" className="fill-primary">
                  <animateMotion dur="3s" repeatCount="indefinite">
                    <path d={`M${fromPos.x},${fromPos.y} L${toPos.x},${toPos.y}`} />
                  </animateMotion>
                </circle>
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r="12"
                className={`${getStatusColor(node.status)} stroke-background stroke-2`}
              >
                {node.status === 'emergency' && (
                  <animate
                    attributeName="r"
                    values="12;18;12"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                )}
              </circle>
              <text
                x={node.x}
                y={node.y - 20}
                textAnchor="middle"
                className="text-xs font-medium fill-foreground"
              >
                {node.name}
              </text>
              {node.status === 'emergency' && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="20"
                  fill="none"
                  stroke="hsl(var(--destructive))"
                  strokeWidth="2"
                  strokeOpacity="0.5"
                >
                  <animate
                    attributeName="r"
                    values="20;30;20"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-2 left-2 bg-background/90 p-2 rounded border text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span>Emergency</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-0.5 bg-warning"></div>
              <span>Relay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};