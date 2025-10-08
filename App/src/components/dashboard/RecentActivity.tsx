
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Building2, UserPlus, UserMinus, UserCog, KeySquare } from "lucide-react";
import type {EventMeta, EventTypeEnum} from '@/@types/event.d';


interface Activity {
  type: EventTypeEnum;
  title?: string;
  description?: string;
  timestamp: string;
  user: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  
  const getIcon = (type: EventTypeEnum) => {
    switch (type) {
      case 'ENTERPRISE_CREATED':
        return <Building2 className="w-4 h-4 text-green-600" />;
      case 'ENTERPRISE_DELETED':
        return <Building2 className="w-4 h-4 text-red-600" />;
      case 'ENTERPRISE_UPDATED':
        return <Building2 className="w-4 h-4 text-orange-600" />;
      case 'LICENSE_CREATED':
        return <UserPlus className="w-4 h-4 text-green-600" />;
      case 'LICENSE_DELETED':
        return <UserMinus className="w-4 h-4 text-red-600" />;
      case 'LICENSE_UPDATED':
        return <UserCog className="w-4 h-4 text-orange-600" />;
      default:
        return <KeySquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (type: EventTypeEnum): string => {
    switch (type) {
      case 'ENTERPRISE_CREATED':
        return 'bg-blue-100 text-blue-700';
      case 'ENTERPRISE_DELETED':
        return 'bg-red-100 text-red-700';
      case 'ENTERPRISE_UPDATED':
        return 'bg-orange-100 text-orange-700';
      case 'LICENSE_CREATED':
        return 'bg-blue-100 text-blue-700';
      case 'LICENSE_DELETED':
        return 'bg-red-100 text-red-700';
      case 'LICENSE_UPDATED':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const titles_template: Record<string, string> = {
    enterprise_added: 'New Enterprise Added',
    enterprise_updated: 'Enterprise Updated',
    enterprise_deleted: 'Enterprise Removed',
    license_created: 'New License Assigned',
    license_updated: 'License Updated',
    license_deleted: 'License Revoked',
  };

  const handleActivityTitle = (eventType: EventTypeEnum) => {
    const template = titles_template[eventType.toLowerCase()];
    if (template) {
      return template;
    }
    return "None"
  };

  const description_template: Record<string, string> = {
    enterprise_added: 'xxxx Successfully added to the platform',
    enterprise_updated: 'xxxx informations has been updated',
    enterprise_deleted: 'xxxx has been removed',
    license_created: 'New license assigned to xxx@xxx.com',
    license_updated: 'License informations has been updated for xxx@xxx.com',
    license_deleted: 'License revoked for xxx@xxx.com',
  };

  const handleActivityDescription = (eventType: EventTypeEnum) => {
    const template = description_template[eventType.toLowerCase()];
    if (template) {
      return template;
    }
    return "None"
  };
  
  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-xl border border-white/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="p-2 rounded-full bg-gray-100">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 mb-1">{handleActivityTitle(activity.type)}</p>
                <p className="text-sm text-gray-600 mb-2">{handleActivityDescription(activity.type)}</p>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className={getStatusColor(activity.type)}>
                    {activity.type.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                  </span>
                </div>
              </div>
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
