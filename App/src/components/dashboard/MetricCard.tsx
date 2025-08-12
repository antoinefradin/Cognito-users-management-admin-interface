
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
// Added: Import LucideIcon type for proper icon typing
import type { LucideIcon } from "lucide-react";

// Added: Interface definition for component props with proper TypeScript types
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}


// Changed: Function signature now uses TypeScript interface instead of destructured parameters
export default function MetricCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color = "blue"
}: MetricCardProps) {

  // Added: Explicit type annotation for color variants object
  const colorVariants: Record<string, string> = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600"
  };

  // Added: Explicit type annotation for icon color variants object
  const iconColorVariants: Record<string, string> = {
    blue: "bg-blue-100/70 text-blue-400",
    green: "bg-emerald-100/70 text-emerald-400",
    purple: "bg-purple-100/70 text-purple-400",
    orange: "bg-orange-100/70 text-orange-400"
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorVariants[color]} opacity-10 rounded-full transform translate-x-8 -translate-y-8 blur-2xl`} />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`p-2.5 rounded-lg ${iconColorVariants[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardHeader>

      {change && (
        <CardContent className="pt-0">
          <div className="flex items-center gap-2">
            {changeType === 'positive' ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'}`}>
              {change}
            </span>
            <span className="text-sm text-gray-500">from last month</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
