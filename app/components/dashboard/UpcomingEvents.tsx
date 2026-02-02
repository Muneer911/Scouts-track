'use client';

import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

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
      <CardContent className="px-6 pb-6">
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground italic">No upcoming events scheduled</p>
            </div>
          ) : (
            events.map((event) => (
              <Link
                key={event.id}
                href={`/dashboard/activities`}
                className="block"
              >
                <div
                  className="flex items-center gap-4 group cursor-pointer p-3 rounded-2xl hover:bg-muted/50 transition-all border border-transparent hover:border-muted/50"
                >
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary font-black shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <span className="text-xs uppercase tracking-tighter opacity-80">{event.date.split(' ')[0]}</span>
                    <span className="text-xl leading-tight">{event.date.split(' ')[1]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{event.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{event.time}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                      <span className="text-xs text-muted-foreground truncate">Main Hall</span>
                    </div>
                  </div>
                  <ChevronRight
                    className={cn(
                      'w-4 h-4 text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all',
                      isRTL && 'rotate-180 group-hover:-translate-x-1'
                    )}
                  />
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
