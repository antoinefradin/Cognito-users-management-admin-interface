
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Users, Calendar, Globe, Edit, MoreVertical, OctagonX} from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
//import type { EnterpriseType } from "@/entities/EnterpriseSchema";
import type { EnterpriseMeta} from '@/@types/enterprise.d';



// Props
interface EnterpriseCardProps {
  enterprise: EnterpriseMeta;
  onEdit: (enterprise: EnterpriseMeta) => void;
  onViewLicenses: (enterprise: EnterpriseMeta) => void;
  onDelete: (enterprise: EnterpriseMeta) => void;
}

const EnterpriseCard: React.FC<EnterpriseCardProps> = ({
  enterprise,
  onEdit,
  onViewLicenses,
  onDelete 
}: EnterpriseCardProps) => {

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

  const licenseUsagePercentage: number = (enterprise.usedLicenses / enterprise.maxLicenses) * 100;


  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <Card className="bg-white/60 backdrop-blur-xl border border-white/30 hover:shadow-xl transition-all duration-300 shadow-lg group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              {/* Card Title */}
              <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                {enterprise.name}
              </CardTitle>
              <p className="text-sm text-gray-500 capitalize">{enterprise.industry}</p>
            </div>
          </div>
          {/* Card Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="transition-opacity  hover:bg-gray-100">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(enterprise)} className="!hover:bg-gray-100 data-[highlighted]:bg-gray-100">
                <Edit className="w-4 h-4 mr-1" />
                Edit Enterprise
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewLicenses(enterprise)} className="!hover:bg-gray-100 data-[highlighted]:bg-gray-100">
                <Users className="w-4 h-4 mr-1" />
                View Licenses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(enterprise)} className="text-red-400 !hover:bg-red-100 data-[highlighted]:bg-red-100 data-[highlighted]:text-red-400">
                <OctagonX className="w-4 h-4 mr-1 text-red-400" />
                Delete Enterprise
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
          <Badge variant="outline" className={getTierColor(enterprise.subscriptionTier)}>
            {enterprise.subscriptionTier}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{enterprise.usedLicenses}/{enterprise.maxLicenses} licenses</span>
          </div>
          {enterprise.website && (
            <div className="flex items-center gap-2 text-gray-600">
              <Globe className="w-4 h-4" />
              <span className="truncate">{enterprise.website}</span>
            </div>
          )}
          {enterprise.contractEndDate && (
            <div className="flex items-center gap-2 text-gray-600 col-span-2">
              <Calendar className="w-4 h-4" />
              <span>Contract ends {format(new Date(enterprise.contractEndDate), 'MMM d, yyyy')}</span>
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
        {enterprise.monthlyRevenue !== undefined && enterprise.monthlyRevenue >= 0 && (
          <div className="pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-600">Monthly Revenue: </span>
            <span className="font-semibold text-green-600">${enterprise.monthlyRevenue.toLocaleString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Changed export to use explicit typing
export default EnterpriseCard;
