
import React, { useState, useEffect } from "react";
import { Enterprise } from "@/entities/Enterprise.ts";
import type { EnterpriseType} from "@/entities/Enterprise.ts";
import { License } from "@/entities/License.ts";
import type { LicenseType} from "@/entities/License.ts";
import { Building2, Users, KeySquare as LicenseIcon, DollarSign } from "lucide-react";
import MetricCard from "../components/dashboard/MetricCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import type {EventMeta} from '@/@types/event.d';
import useEvents from "@/hooks/useEventApi";




const Dashboard: React.FC = () => {
  const { getEvents } = useEvents();
  const [events, setEvents] = useState<EventMeta[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data: eventsResponse, mutate: refreshEvents, isLoading: swrLoading } = getEvents();

  useEffect(() => {
  if (eventsResponse) {
      try {
        console.log('🏭 Données events reçues:', eventsResponse);
        setEvents(eventsResponse);
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Error from getEvents(): ', error as Error);
        setIsLoading(false);
      }
    }
  else{
    console.log("######## no eventsResponse")
  }
    if (swrLoading !== undefined) {
      setIsLoading(swrLoading);
    }
  }, [eventsResponse, swrLoading]);


  // ✅ ADDED: Type annotations for computed variables and function parameters
  // const totalRevenue: number = enterprises.reduce((sum: number, ent: EnterpriseType) => sum + (ent.monthly_revenue || 0), 0);
  // const activeLicenses: number = licenses.filter((license: LicenseType) => license.status === 'active').length;
  // const activeEnterprises: number = enterprises.filter((ent: EnterpriseType) => ent.status === 'active').length;



  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    <div className="p-6 lg:p-8 bg-gray-150 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your enterprise licenses and track performance</p>
        </div>
        {/* Metric Cards*/}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Enterprises"
            value={10}
            change="+12%"
            changeType="positive"
            icon={Building2}
            color="blue"
          />
          <MetricCard
            title="Active Licenses"
            value={10}
            change="+8%"
            changeType="positive"
            icon={LicenseIcon}
            color="green"
          />
          <MetricCard
            title="Total Users"
            value={10}
            change="+15%"
            changeType="positive"
            icon={Users}
            color="purple"
          />
          <MetricCard
            title="Monthly Revenue"
            value={`$${"10"}`}
            change="+23%"
            changeType="positive"
            icon={DollarSign}
            color="orange"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity 
              activities={events.map((event) => ({
                type: event.event_type,
                timestamp: event.event_date,
                user: event.user_id,
              }))} 
            />
          </div>
          {/* Statistics */}
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Enterprises</span>
                  <span className="font-semibold text-gray-900">{/*{activeEnterprises}*/}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trial Enterprises</span>
                  <span className="font-semibold text-gray-900">
                    {/* {events.filter((event: EventMeta) => event.status === 'trial').length}*/}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Licenses/Enterprise</span>
                  <span className="font-semibold text-gray-900">
                    {/*{enterprises.length > 0 ? Math.round(licenses.length / enterprises.length) : 0}*/}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">License Utilization</span>
                  <span className="font-semibold text-green-600">
                    {/*{enterprises.length > 0 
                      ? 
                        `${Math.round((licenses.length / enterprises.reduce((sum: number, ent: EnterpriseType) => sum + ent.max_licenses, 0)) * 100)}%`
                      : '0%'
                    }*/}

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
