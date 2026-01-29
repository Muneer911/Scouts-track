'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DataPoint {
  month: string;
  value: number;
}

interface AttendanceTrendProps {
  data: readonly DataPoint[] | DataPoint[];
  title?: string;
}

export function AttendanceTrend({ data, title = 'Attendance Trend' }: AttendanceTrendProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  const width = 400;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartWidth,
    y: padding.top + chartHeight - ((d.value - minValue) / range) * chartHeight,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;

  const yLabels = [0, 20, 40, 60, 80, 100].map((val) => ({
    value: val,
    y: padding.top + chartHeight - (val / 100) * chartHeight,
  }));

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">{title}</CardTitle>
        <Button variant="outline" size="sm">
          This Month
        </Button>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[300px]">
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>

            {yLabels.map((label) => (
              <g key={label.value}>
                <line
                  x1={padding.left}
                  y1={label.y}
                  x2={width - padding.right}
                  y2={label.y}
                  stroke="hsl(var(--border))"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 8}
                  y={label.y + 4}
                  textAnchor="end"
                  className="text-xs"
                  fill="hsl(var(--muted-foreground))"
                >
                  {label.value}
                </text>
              </g>
            ))}

            <path d={areaPath} fill="url(#areaGradient)" />

            <path
              d={linePath}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {data.map((d, i) => (
              <text
                key={d.month}
                x={points[i].x}
                y={height - 8}
                textAnchor="middle"
                className="text-xs"
                fill="hsl(var(--muted-foreground))"
              >
                {d.month}
              </text>
            ))}

            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="4"
                fill="hsl(var(--background))"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
