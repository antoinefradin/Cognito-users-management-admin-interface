
import React, { useState, useEffect } from "react";
import { Enterprise } from "@/entities/Enterprise.ts";
import type { EnterpriseType} from "@/entities/Enterprise.ts";
import { License } from "@/entities/License.ts";
import type { LicenseType} from "@/entities/License.ts";
import { Building2, Users, KeySquare as LicenseIcon, DollarSign } from "lucide-react";
import MetricCard from "../components/dashboard/MetricCard";
import RecentActivity from "../components/dashboard/RecentActivity";

// ✅ ADDED: TypeScript interface definitions for type safety


interface ActivityType {
  type: string;
  title: string;
  description: string;
  timestamp: string;
  user: string;
}



// ✅ CHANGED: Using React.FC (Functional Component) type instead of JSX.Element
const Dashboard: React.FC = () => {
  // ✅ ADDED: Type annotations for useState hooks
  const [enterprises, setEnterprises] = useState<EnterpriseType[]>([]);
  const [licenses, setLicenses] = useState<LicenseType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {
    loadData();
  }, []);

  // ✅ ADDED: Explicit return type annotation for async function
  const loadData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const [enterpriseData, licenseData] = await Promise.all([
        Enterprise.list('-created_date'),
        License.list('-created_date')
      ]);
      setEnterprises(enterpriseData);
      setLicenses(licenseData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
    setIsLoading(false);
  };

  // ✅ ADDED: Type annotations for computed variables and function parameters
  const totalRevenue: number = enterprises.reduce((sum: number, ent: EnterpriseType) => sum + (ent.monthly_revenue || 0), 0);
  const activeLicenses: number = licenses.filter((license: LicenseType) => license.status === 'active').length;
  const activeEnterprises: number = enterprises.filter((ent: EnterpriseType) => ent.status === 'active').length;

  // Mock recent activity data
  // ✅ ADDED: Type annotation for the activities array
  const recentActivities: ActivityType[] = [
    {
      type: 'enterprise_added',
      title: 'New Enterprise Added',
      description: 'TechCorp was successfully added to the platform',
      timestamp: new Date().toISOString(),
      user: 'Sales Admin'
    },
    {
      type: 'license_assigned',
      title: 'License Assigned',
      description: 'New license assigned to john.doe@techcorp.com',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      user: 'Sales Admin'
    },
    {
      type: 'license_revoked',
      title: 'License Revoked',
      description: 'License revoked for inactive user',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      user: 'Sales Admin'
    }
  ];


  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* ✅ ADDED: Type annotation for map function parameter */}
              {[...Array(4)].map((_, i: number) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your enterprise licenses and track performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Enterprises"
            value={enterprises.length}
            change="+12%"
            changeType="positive"
            icon={Building2}
            color="blue"
          />
          <MetricCard
            title="Active Licenses"
            value={activeLicenses}
            change="+8%"
            changeType="positive"
            icon={LicenseIcon}
            color="green"
          />
          <MetricCard
            title="Total Users"
            value={licenses.length}
            change="+15%"
            changeType="positive"
            icon={Users}
            color="purple"
          />
          <MetricCard
            title="Monthly Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            change="+23%"
            changeType="positive"
            icon={DollarSign}
            color="orange"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity activities={recentActivities} />
          </div>
          
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Enterprises</span>
                  <span className="font-semibold text-gray-900">{activeEnterprises}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trial Enterprises</span>
                  <span className="font-semibold text-gray-900">
                    {/* ✅ ADDED: Type annotation for filter function parameter */}
                    {enterprises.filter((ent: EnterpriseType) => ent.status === 'trial').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Licenses/Enterprise</span>
                  <span className="font-semibold text-gray-900">
                    {enterprises.length > 0 ? Math.round(licenses.length / enterprises.length) : 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">License Utilization</span>
                  <span className="font-semibold text-green-600">
                    {enterprises.length > 0 
                      ? /* ✅ ADDED: Type annotations for reduce function parameters */
                        `${Math.round((licenses.length / enterprises.reduce((sum: number, ent: EnterpriseType) => sum + ent.max_licenses, 0)) * 100)}%`
                      : '0%'
                    }

                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ CHANGED: Export statement updated to match the new const declaration
export default Dashboard;
