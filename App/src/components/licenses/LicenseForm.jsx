import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CalendarIcon, Save, X, Building2, User, KeySquare } from "lucide-react";

const licenseTypes = [
  { value: "basic", label: "Basic", description: "Access to basic features" },
  { value: "professional", label: "Professional", description: "Advanced features and reports" },
  { value: "admin", label: "Admin", description: "Full access including user management" }
];

const defaultFeatures = {
  basic: ["dashboard", "basic_features"],
  professional: ["dashboard", "reports", "professional_features"],
  admin: ["dashboard", "admin_panel", "reports", "user_management", "advanced_features"]
};

export default function LicenseForm({ license, enterprises, onSave, onCancel }) {
  const [formData, setFormData] = useState(license || {
    enterprise_id: '',
    user_email: '',
    user_name: '',
    status: 'active',
    license_type: 'basic',
    activation_date: new Date().toISOString().split('T')[0],
    features_access: defaultFeatures.basic
  });

  const [availableFeatures] = useState([
    "dashboard",
    "basic_features", 
    "professional_features",
    "advanced_features",
    "reports",
    "admin_panel",
    "user_management",
    "analytics",
    "integrations",
    "api_access"
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLicenseTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      license_type: type,
      features_access: defaultFeatures[type] || []
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features_access: prev.features_access.includes(feature)
        ? prev.features_access.filter(f => f !== feature)
        : [...prev.features_access, feature]
    }));
  };

  const selectedEnterprise = enterprises.find(ent => ent.id === formData.enterprise_id);
  const canAssignMore = selectedEnterprise 
    ? selectedEnterprise.used_licenses < selectedEnterprise.max_licenses
    : false;

  return (
    <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-xl border border-white/30">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl">
            <KeySquare className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">
              {license ? 'Edit License' : 'Assign New License'}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {license ? 'Update license details' : 'Assign a license to a user'}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Enterprise *
              </Label>
              <Select 
                value={formData.enterprise_id} 
                onValueChange={(value) => handleChange('enterprise_id', value)}
                disabled={!!license}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select enterprise" />
                </SelectTrigger>
                <SelectContent>
                  {enterprises.map(enterprise => (
                    <SelectItem key={enterprise.id} value={enterprise.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{enterprise.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({enterprise.used_licenses}/{enterprise.max_licenses})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedEnterprise && !canAssignMore && (
                <p className="text-sm text-red-600">
                  ⚠️ This enterprise has reached its license limit
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">License Type</Label>
              <Select 
                value={formData.license_type} 
                onValueChange={handleLicenseTypeChange}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {licenseTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                User Name *
              </Label>
              <Input
                id="user_name"
                value={formData.user_name}
                onChange={(e) => handleChange('user_name', e.target.value)}
                placeholder="John Doe"
                required
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_email" className="text-sm font-medium text-gray-700">
                Email Address *
              </Label>
              <Input
                id="user_email"
                type="email"
                value={formData.user_email}
                onChange={(e) => handleChange('user_email', e.target.value)}
                placeholder="john@company.com"
                required
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Activation Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.activation_date ? format(new Date(formData.activation_date), 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.activation_date ? new Date(formData.activation_date) : undefined}
                    onSelect={(date) => handleChange('activation_date', date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">Feature Access</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg">
              {availableFeatures.map(feature => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={formData.features_access.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <Label 
                    htmlFor={feature} 
                    className="text-sm text-gray-700 capitalize cursor-pointer"
                  >
                    {feature.replace(/_/g, ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="gap-2">
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 gap-2"
              disabled={selectedEnterprise && !canAssignMore && !license}
            >
              <Save className="w-4 h-4" />
              {license ? 'Update' : 'Assign'} License
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}