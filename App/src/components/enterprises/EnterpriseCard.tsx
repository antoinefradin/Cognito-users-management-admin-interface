
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Users, Calendar, Globe, Edit, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { EnterpriseType } from "@/entities/EnterpriseSchema";


// Added interface to define the props structure for the component
interface EnterpriseCardProps {
  enterprise: EnterpriseType;
  onEdit: (enterprise: EnterpriseType) => void;
  onViewLicenses: (enterprise: EnterpriseType) => void;
}

// Changed from default export function to React.FC with explicit prop typing
const EnterpriseCard: React.FC<EnterpriseCardProps> = ({ enterprise, onEdit, onViewLicenses }) => {
  // Added parameter type annotation and return type for status color function
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'trial':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'suspended':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Added parameter type annotation and return type for tier color function
  const getTierColor = (tier: string): string => {
    switch (tier) {
      case 'private':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'basic':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Added explicit type annotation for license usage calculation
  const licenseUsagePercentage: number = (enterprise.used_licenses / enterprise.max_licenses) * 100;


  return (
    <Card className="bg-white/60 backdrop-blur-xl border border-white/30 hover:shadow-xl transition-all duration-300 shadow-lg group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                {enterprise.name}
              </CardTitle>
              <p className="text-sm text-gray-500 capitalize">{enterprise.industry}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(enterprise)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Enterprise
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewLicenses(enterprise)}>
                <Users className="w-4 h-4 mr-2" />
                View Licenses
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(enterprise.status)}>
            {enterprise.status}
          </Badge>
          <Badge variant="outline" className={getTierColor(enterprise.subscription_tier)}>
            {enterprise.subscription_tier}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{enterprise.used_licenses}/{enterprise.max_licenses} licenses</span>
          </div>
          {enterprise.website && (
            <div className="flex items-center gap-2 text-gray-600">
              <Globe className="w-4 h-4" />
              <span className="truncate">{enterprise.website}</span>
            </div>
          )}
          {enterprise.contract_end_date && (
            <div className="flex items-center gap-2 text-gray-600 col-span-2">
              <Calendar className="w-4 h-4" />
              <span>Contract ends {format(new Date(enterprise.contract_end_date), 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">License Usage</span>
            <span className="font-medium text-gray-900">{licenseUsagePercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                licenseUsagePercentage > 90 ? 'bg-red-500' : 
                licenseUsagePercentage > 75 ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(licenseUsagePercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Added type-safe check for monthly_revenue existence and value */}
        {enterprise.monthly_revenue !== undefined && enterprise.monthly_revenue >= 0 && (
          <div className="pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-600">Monthly Revenue: </span>
            <span className="font-semibold text-green-600">${enterprise.monthly_revenue.toLocaleString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Changed export to use explicit typing
export default EnterpriseCard;
