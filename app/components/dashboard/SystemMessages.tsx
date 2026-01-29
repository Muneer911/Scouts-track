'use client';

import { MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Message {
  id: string;
  message: string;
}

interface SystemMessagesProps {
  messages: readonly Message[] | Message[];
  title?: string;
}

export function SystemMessages({ messages, title = 'System Messages' }: SystemMessagesProps) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground flex-1">{msg.message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
