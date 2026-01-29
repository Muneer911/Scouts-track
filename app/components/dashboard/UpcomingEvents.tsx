'use client';

import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
}

interface UpcomingEventsProps {
  events: readonly Event[] | Event[];
  title?: string;
}

export function UpcomingEvents({ events, title = 'Upcoming Events' }: UpcomingEventsProps) {
  const { isRTL } = useLanguage();

  return (
    <Card className="bg-card h-full">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {event.date} | {event.time}
                </p>
              </div>
              <ChevronRight
                className={cn(
                  'w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity',
                  isRTL && 'rotate-180'
                )}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
