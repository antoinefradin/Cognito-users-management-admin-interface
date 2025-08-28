
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Save, X, Loader2 } from "lucide-react";
// import type { EnterpriseType } from "@/entities/EnterpriseSchema";
import type { EnterpriseMeta, RegisterEnterpriseRequest} from '@/@types/enterprise.d';
import { 
  IndustryEnum,
  CompanySizeEnum,
  EnterpriseStatusEnum,
  SubscriptionTierEnum,
} from '@/@types/enterprise.d';

import useEnterprise from "@/hooks/useEnterpriseApi";

// ============================================================================
// CONSTANTS - Updated to use proper enums
// ============================================================================

// CHANGE: Replace string arrays with enum values for type safety
const industries = Object.values(IndustryEnum);
const sizes = Object.values(CompanySizeEnum);
const tiers = Object.values(SubscriptionTierEnum);
const statuses = Object.values(EnterpriseStatusEnum);


interface EnterpriseFormProps {
  enterprise?: EnterpriseMeta | null;
  onSave: (formData: EnterpriseMeta) => void;
  onCancel: () => void;

  onSuccess?: (enterprise: any) => void;
  onError?: (error: string) => void;
  
  mode?: 'create' | 'update';
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const EnterpriseForm: React.FC<EnterpriseFormProps> = ({ 
  enterprise, 
  onCancel,
  onSuccess,
  onError,
  mode = enterprise ? 'update' : 'create'
}) => {
  
  // ========================================================================
  // HOOKS
  // ========================================================================
  
  const navigate = useNavigate();
  const { registerEnterprise } = useEnterprise();
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // ========================================================================
  // FORM STATE - All form fields as individual state
  // ========================================================================
  // Basic Information
  const [enterpriseId, setEnterpriseId] = useState(enterprise?.id || `ENT-${Date.now()}`);
  const [name, setName] = useState(enterprise?.name || '');
  const [contactEmail, setContactEmail] = useState(enterprise?.contactEmail || '');
  const [contactPhone, setContactPhone] = useState(enterprise?.contactPhone || '');
  const [address, setAddress] = useState(enterprise?.address || '');
  const [website, setWebsite] = useState(enterprise?.website || '');
  // Enums
  const [industry, setIndustry] = useState<IndustryEnum>(
    enterprise?.industry || IndustryEnum.OTHER
  );
  const [size, setSize] = useState<CompanySizeEnum>(
    enterprise?.size || CompanySizeEnum.ENTERPRISE
  );
  const [status, setStatus] = useState<EnterpriseStatusEnum>(
    enterprise?.status || EnterpriseStatusEnum.ACTIVE
  );
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTierEnum>(
    enterprise?.subscriptionTier || SubscriptionTierEnum.BASIC
  );
  // Numbers
  const [maxLicenses, setMaxLicenses] = useState(enterprise?.maxLicenses || 10);
  const [usedLicenses, setUsedLicenses] = useState(enterprise?.usedLicenses || 0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(enterprise?.monthlyRevenue || 0);
  // Dates
  const [contractStartDate, setContractStartDate] = useState(
    enterprise?.contractStartDate || new Date().toISOString().split('T')[0]
  );
  const [contractEndDate, setContractEndDate] = useState(
    enterprise?.contractEndDate || ''
  );

  // ========================================================================
  // VALIDATION FUNCTION
  // ========================================================================
  
  const isValid = useCallback((): boolean => {
    // Required field validations
    if (!name.trim()) {
      onError?.('Company name is required');
      return false;
    }
    
    if (!contactEmail.trim()) {
      onError?.('Contact email is required');
      return false;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      onError?.('Must be a valid email address');
      return false;
    }
    
    // Website validation
    if (website && !website.startsWith('http://') && !website.startsWith('https://')) {
      onError?.('Website must be a valid URI starting with http:// or https://');
      return false;
    }
    
    // License validation
    if (maxLicenses < 1) {
      onError?.('Max licenses must be at least 1');
      return false;
    }
    
    if (usedLicenses < 0) {
      onError?.('Used licenses cannot be negative');
      return false;
    }
    
    if (usedLicenses > maxLicenses) {
      onError?.('Used licenses cannot exceed max licenses');
      return false;
    }
    
    // Date validation
    if (contractEndDate) {
      const startDate = new Date(contractStartDate);
      const endDate = new Date(contractEndDate);
      
      if (endDate <= startDate) {
        onError?.('Contract end date must be after start date');
        return false;
      }
    }
    
    // Revenue validation
    if (monthlyRevenue < 0) {
      onError?.('Monthly revenue cannot be negative');
      return false;
    }
    
    return true;
  }, [
    name,
    contactEmail,
    website,
    maxLicenses,
    usedLicenses,
    contractStartDate,
    contractEndDate,
    monthlyRevenue,
    onError
  ]);

  // ========================================================================
  // SUBMIT HANDLER - Following the Bot pattern
  // ========================================================================
  
  const onClickCreate = useCallback(() => {
    // Validation check
    if (!isValid()) {
      return;
    }
    
    setIsLoading(true);
    
    // Build the request object
    const enterpriseRequest: RegisterEnterpriseRequest = {
      id: enterpriseId,
      name,
      industry: industry,
      size: size,
      contactEmail,
      contactPhone: contactPhone || undefined,
      address: address || undefined,
      website: website || undefined,
      status,
      subscriptionTier,
      maxLicenses,
      usedLicenses,
      contractStartDate,
      contractEndDate: contractEndDate || undefined,
      monthlyRevenue: monthlyRevenue || undefined,
    };
    
    // API call
    registerEnterprise(enterpriseRequest)
      .then((response) => {
        // Success - navigate to enterprises list
        onSuccess?.(response.data);
        navigate('/enterprises');
      })
      .catch((error) => {
        // Error handling
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            'Failed to save enterprise. Please try again.';
        onError?.(errorMessage);
        setIsLoading(false);
      });
  }, [
    isValid,
    registerEnterprise,
    enterpriseId,
    name,
    industry,
    size,
    contactEmail,
    contactPhone,
    address,
    website,
    status,
    subscriptionTier,
    maxLicenses,
    usedLicenses,
    contractStartDate,
    contractEndDate,
    monthlyRevenue,
    onSuccess,
    onError,
    navigate,
  ]);

  // ========================================================================
  // DATE HANDLERS
  // ========================================================================
  
  const handleStartDateSelect = useCallback((date: Date | undefined) => {
    if (date) {
      setContractStartDate(format(date, 'yyyy-MM-dd'));
    } else {
      setContractStartDate('');
    }
  }, []);

  const handleEndDateSelect = useCallback((date: Date | undefined) => {
    if (date) {
      setContractEndDate(format(date, 'yyyy-MM-dd'));
    } else {
      setContractEndDate('');
    }
  }, []);

  // ========================================================================
  // HELPER FUNCTIONS
  // ========================================================================
  
  const formatEnumForDisplay = (value: string): string => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  // ========================================================================
  // FORM DATA INITIALIZATION - Enhanced with new types
  // ========================================================================
  // const initializeFormData = (enterprise: EnterpriseMeta | null | undefined): EnterpriseMeta => {
  //   if (enterprise) {
  //     return {
  //       id: enterprise.id || '',
  //       name: enterprise.name || '',
  //       industry: enterprise.industry || IndustryEnum.OTHER,
  //       size: enterprise.size || CompanySizeEnum.ENTERPRISE,
  //       contactEmail: enterprise.contactEmail || '',
  //       contactPhone: enterprise.contactPhone || '',
  //       address: enterprise.address || '',
  //       website: enterprise.website || '',
  //       status: enterprise.status || EnterpriseStatusEnum.ACTIVE,
  //       subscriptionTier: enterprise.subscriptionTier || SubscriptionTierEnum.BASIC,
  //       maxLicenses: enterprise.maxLicenses || 10,
  //       contractStartDate: enterprise.contractStartDate || '',
  //       contractEndDate: enterprise.contractEndDate || '',
  //       monthlyRevenue: enterprise.monthlyRevenue || 0,
  //       usedLicenses: enterprise.usedLicenses || 0,
  //       createdDate: enterprise.createdDate || '',
  //       updatedDate: enterprise.updatedDate || ''
  //     };
  //   }
    
  //   // CORRECTED: Default values using proper enum types
  //   return {
  //     id: `ENT-${Date.now()}`, // Auto-generate ID for new enterprises
  //     name: '',
  //     industry: IndustryEnum.OTHER,
  //     size: CompanySizeEnum.ENTERPRISE,
  //     contactEmail: '',
  //     contactPhone: '',
  //     address: '',
  //     website: '',
  //     status: EnterpriseStatusEnum.ACTIVE,
  //     subscriptionTier: SubscriptionTierEnum.BASIC,
  //     maxLicenses: 10,
  //     contractStartDate: new Date().toISOString().split('T')[0], // Default to today
  //     contractEndDate: '',
  //     monthlyRevenue: 0,
  //     usedLicenses: 0,
  //     createdDate: '',
  //     updatedDate: ''
  //   };
  // };

  // const [formData, setFormData] = useState<EnterpriseMeta>(initializeFormData(enterprise));

  // // Added parameter type annotation for form submit handler
  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
  //   e.preventDefault();
  //   onSave(formData);
  // };

  // Added parameter type annotations for change handler
  // const handleChange = (field: keyof EnterpriseMeta, value: string | number | Date | undefined): void => {
  //   setFormData(prev => ({ ...prev, [field]: value }));
  // };

  // // Added helper function with proper typing for date formatting
  // const formatDateForDisplay = (date: string | Date | undefined): string => {
  //   if (!date) return 'Pick a date';
  //   try {
  //     return format(new Date(date), 'PPP');
  //   } catch {
  //     return 'Pick a date';
  //   }
  // };

  // // Added helper function with proper typing for date selection
  // const getSelectedDate = (date: string | Date | undefined): Date | undefined => {
  //   if (!date) return undefined;
  //   try {
  //     return new Date(date);
  //   } catch {
  //     return undefined;
  //   }
  // };

  // // Added helper function to handle date selection and format it properly
  // const handleDateSelect = (field: 'contract_start_date' | 'contract_end_date', date: Date | undefined): void => {
  //   if (date) {
  //     // Format date as YYYY-MM-DD to match schema format
  //     const formattedDate = format(date, 'yyyy-MM-dd');
  //     handleChange(field, formattedDate);
  //   } else {
  //     handleChange(field, '');
  //   }
  // };

  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-xl border border-white/30">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">
          {enterprise ? 'Edit Enterprise' : 'Add New Enterprise'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); onClickCreate(); }} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Company Name *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter company name"
                required
                disabled={isLoading} // AJOUTÉ: Désactiver pendant le chargement
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="contact_email" className="text-sm font-medium text-gray-700">
                Contact Email *
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@company.com"
                required
                disabled={isLoading}
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Industry</Label>
              <Select 
                value={industry} 
                onValueChange={(value) => setIndustry(value as IndustryEnum)}
                disabled={isLoading}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map(ind => (
                    <SelectItem key={ind} value={ind}>
                      {formatEnumForDisplay(ind)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Company Size */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Company Size</Label>
              <Select 
                value={size} 
                onValueChange={(value) => setSize(value as CompanySizeEnum)}
                disabled={isLoading}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map(s => (
                    <SelectItem key={s} value={s}>
                      {formatEnumForDisplay(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Contact Phone */}
            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="text-sm font-medium text-gray-700">
                Contact Phone
              </Label>
              <Input
                id="contactPhone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                disabled={isLoading}
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                Website
              </Label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://company.com"
                disabled={isLoading}
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Subscription Tier */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Subscription Tier</Label>
              <Select 
                value={subscriptionTier} 
                onValueChange={(value) => setSubscriptionTier(value as SubscriptionTierEnum)}
                disabled={isLoading}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tiers.map(tier => (
                    <SelectItem key={tier} value={tier}>
                      {formatEnumForDisplay(tier)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Status</Label>
              <Select 
                value={status} 
                onValueChange={(value) => setStatus(value as EnterpriseStatusEnum)}
                disabled={isLoading}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(stat => (
                    <SelectItem key={stat} value={stat}>
                      {formatEnumForDisplay(stat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Max Licenses */}
            <div className="space-y-2">
              <Label htmlFor="max_licenses" className="text-sm font-medium text-gray-700">
                Max Licenses *
              </Label>
              <Input
                id="maxLicenses"
                type="number"
                min="1"
                value={maxLicenses}
                onChange={(e) => setMaxLicenses(parseInt(e.target.value) || 0)}
                required
                disabled={isLoading}
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Used Licenses */}
            <div className="space-y-2">
              <Label htmlFor="usedLicenses" className="text-sm font-medium text-gray-700">
                Used Licenses
              </Label>
              <Input
                id="usedLicenses"
                type="number"
                min="0"
                value={usedLicenses}
                onChange={(e) => setUsedLicenses(parseInt(e.target.value) || 0)}
                disabled={isLoading}
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Monthly Revenue */}
            <div className="space-y-2">
              <Label htmlFor="monthlyRevenue" className="text-sm font-medium text-gray-700">
                Monthly Revenue ($)
              </Label>
              <Input
                id="monthlyRevenue"
                type="number"
                min="0"
                step="0.01"
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(parseFloat(e.target.value) || 0)}
                placeholder="5000"
                disabled={isLoading}
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Contract Start Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Contract Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left font-normal"
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {contractStartDate 
                      ? format(new Date(contractStartDate), 'PPP') 
                      : 'Pick a date'
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={contractStartDate ? new Date(contractStartDate) : undefined}
                    onSelect={handleStartDateSelect}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Contract End Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Contract End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left font-normal"
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {contractEndDate 
                      ? format(new Date(contractEndDate), 'PPP') 
                      : 'Pick a date'
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={contractEndDate ? new Date(contractEndDate) : undefined}
                    onSelect={handleEndDateSelect}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Address - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Address
            </Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Company address"
              rows={3}
              disabled={isLoading}
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel} 
              className="gap-2"
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === 'update' ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {mode === 'update' ? 'Update' : 'Create'} Enterprise
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default EnterpriseForm;

