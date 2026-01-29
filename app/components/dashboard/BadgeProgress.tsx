'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BadgeData {
  badge: string;
  count: number;
}

interface BadgeProgressProps {
  data: readonly BadgeData[] | BadgeData[];
  title?: string;
}

export function BadgeProgress({ data, title = 'Badge Progress' }: BadgeProgressProps) {
  const dataArray = [...data];
  const maxCount = Math.max(...dataArray.map((d) => d.count));
  const totalDone = dataArray.reduce((sum: number, d) => sum + d.count, 0);
  const totalPossible = maxCount * dataArray.length;
  const percentDone = Math.round((totalDone / totalPossible) * 100);

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <CardTitle className="text-foreground">{title}</CardTitle>
          <Badge variant="secondary">Done {percentDone}%</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="flex items-end justify-between gap-3 min-w-[250px] h-48 px-2">
            {data.map((item) => {
              const heightPercent = (item.count / maxCount) * 100;
              return (
                <div key={item.badge} className="flex flex-col items-center flex-1 h-full">
                  <div className="flex-1 w-full flex items-end justify-center">
                    <div
                      className="w-full max-w-[40px] bg-primary rounded-t-sm transition-all hover:bg-primary/80"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 font-medium">{item.badge}</div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2 px-2">
            <span>0</span>
            <span>{Math.round(maxCount / 2)}</span>
            <span>{maxCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
