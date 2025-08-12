
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Save, X } from "lucide-react";
import type { EnterpriseType } from "@/entities/EnterpriseSchema";

// Added type-safe arrays using the schema enum values
const industries: string[] = [
  "technology", "healthcare", "finance", "retail", "manufacturing", 
  "education", "consulting", "other"
];

const sizes: string[] = [
  "startup", "small", "medium", "large", "enterprise"
];

const tiers: string[] = [
  "basic", "private"
];


// Added interface to define the props structure for the component
interface EnterpriseFormProps {
  enterprise?: EnterpriseType | null;
  onSave: (formData: EnterpriseType) => void;
  onCancel: () => void;
}

// Changed from default export function to React.FC with explicit prop typing
const EnterpriseForm: React.FC<EnterpriseFormProps> = ({ enterprise, onSave, onCancel }) => {
  // Added helper function to safely initialize form data from enterprise
  const initializeFormData = (enterprise: EnterpriseType | null | undefined): EnterpriseType => {
    if (enterprise) {
      return {
        id: enterprise.id || '',
        name: enterprise.name || '',
        industry: enterprise.industry || 'other',
        size: enterprise.size || 'enterprise',
        contact_email: enterprise.contact_email || '',
        contact_phone: enterprise.contact_phone || '',
        address: enterprise.address || '',
        website: enterprise.website || '',
        status: enterprise.status || 'active',
        subscription_tier: enterprise.subscription_tier || 'basic',
        max_licenses: enterprise.max_licenses || 10,
        contract_start_date: enterprise.contract_start_date || '',
        contract_end_date: enterprise.contract_end_date || '',
        monthly_revenue: enterprise.monthly_revenue || 0,
        used_licenses: enterprise.used_licenses || 0,
        created_date: enterprise.created_date || '',
        updated_date: enterprise.updated_date || ''
      };
    }
    
    return {
      id: '',
      name: '',
      industry: 'other',
      size: 'enterprise',
      contact_email: '',
      contact_phone: '',
      address: '',
      website: '',
      status: 'active',
      subscription_tier: 'basic',
      max_licenses: 10,
      contract_start_date: '',
      contract_end_date: '',
      monthly_revenue: 0,
      used_licenses: 0,
      created_date: '',
      updated_date: ''
    };
  };

  // Updated state initialization to use the helper function
  const [formData, setFormData] = useState<EnterpriseType>(initializeFormData(enterprise));

  // Added parameter type annotation for form submit handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSave(formData);
  };

  // Added parameter type annotations for change handler
  const handleChange = (field: keyof EnterpriseType, value: string | number | Date | undefined): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Added helper function with proper typing for date formatting
  const formatDateForDisplay = (date: string | Date | undefined): string => {
    if (!date) return 'Pick a date';
    try {
      return format(new Date(date), 'PPP');
    } catch {
      return 'Pick a date';
    }
  };

  // Added helper function with proper typing for date selection
  const getSelectedDate = (date: string | Date | undefined): Date | undefined => {
    if (!date) return undefined;
    try {
      return new Date(date);
    } catch {
      return undefined;
    }
  };

  // Added helper function to handle date selection and format it properly
  const handleDateSelect = (field: 'contract_start_date' | 'contract_end_date', date: Date | undefined): void => {
    if (date) {
      // Format date as YYYY-MM-DD to match schema format
      const formattedDate = format(date, 'yyyy-MM-dd');
      handleChange(field, formattedDate);
    } else {
      handleChange(field, '');
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-xl border border-white/30">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">
          {enterprise ? 'Edit Enterprise' : 'Add New Enterprise'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Company Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter company name"
                required
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email" className="text-sm font-medium text-gray-700">
                Contact Email *
              </Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                placeholder="contact@company.com"
                required
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Industry</Label>
              <Select value={formData.industry} onValueChange={(value) => handleChange('industry', value)}>
                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>
                      {industry.charAt(0).toUpperCase() + industry.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Company Size</Label>
              <Select value={formData.size} onValueChange={(value) => handleChange('size', value)}>
                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map(size => (
                    <SelectItem key={size} value={size}>
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone" className="text-sm font-medium text-gray-700">
                Contact Phone
              </Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                Website
              </Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://company.com"
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Subscription Tier</Label>
              <Select value={formData.subscription_tier} onValueChange={(value) => handleChange('subscription_tier', value)}>
                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tiers.map(tier => (
                    <SelectItem key={tier} value={tier}>
                      {tier.charAt(0).toUpperCase() + tier.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_licenses" className="text-sm font-medium text-gray-700">
                Max Licenses *
              </Label>
              <Input
                id="max_licenses"
                type="number"
                min="1"
                value={formData.max_licenses}
                onChange={(e) => handleChange('max_licenses', parseInt(e.target.value))}
                required
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly_revenue" className="text-sm font-medium text-gray-700">
                Monthly Revenue ($)
              </Label>
              <Input
                id="monthly_revenue"
                type="number"
                min="0"
                step="0.01"
                value={formData.monthly_revenue}
                onChange={(e) => handleChange('monthly_revenue', parseFloat(e.target.value))}
                placeholder="5000"
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Contract Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.contract_start_date ? format(new Date(formData.contract_start_date), 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.contract_start_date ? new Date(formData.contract_start_date) : undefined}
                    onSelect={(date) => handleChange('contract_start_date', date)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Contract End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.contract_end_date ? format(new Date(formData.contract_end_date), 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.contract_end_date ? new Date(formData.contract_end_date) : undefined}
                    onSelect={(date) => handleChange('contract_end_date', date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Address
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Company address"
              rows={3}
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="gap-2">
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Save className="w-4 h-4" />
              {enterprise ? 'Update' : 'Create'} Enterprise
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Changed export to use explicit typing
export default EnterpriseForm;

