
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Building2, UserPlus, UserMinus, KeySquare } from "lucide-react";

// Added: Type definition for activity type enum
type ActivityType = 'enterprise_added' | 'license_assigned' | 'license_revoked' | string;

// Added: Interface definition for individual activity object
interface Activity {
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

// Added: Interface definition for component props
interface RecentActivityProps {
  activities: Activity[];
}

// Changed: Function signature now uses TypeScript interface instead of destructured parameters
export default function RecentActivity({ activities }: RecentActivityProps) {
  // Changed: Removed JSX.Element return type - TypeScript will infer it automatically
  const getIcon = (type: ActivityType) => {
    switch (type) {
      case 'enterprise_added':
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case 'license_assigned':
        return <UserPlus className="w-4 h-4 text-green-600" />;
      case 'license_revoked':
        return <UserMinus className="w-4 h-4 text-red-600" />;
      default:
        return <KeySquare className="w-4 h-4 text-gray-600" />;
    }
  };

  // Changed: Kept explicit return type for string since it's a primitive type (optional but clear)
  const getStatusColor = (type: ActivityType): string => {
    switch (type) {
      case 'enterprise_added':
        return 'bg-blue-100 text-blue-700';
      case 'license_assigned':
        return 'bg-green-100 text-green-700';
      case 'license_revoked':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
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
                <p className="font-medium text-gray-900 mb-1">{activity.title}</p>
                <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
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
