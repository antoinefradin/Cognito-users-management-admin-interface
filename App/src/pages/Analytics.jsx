
import React, { useState, useEffect } from "react";
import { Enterprise } from "@/entities/Enterprise";
import { License } from "@/entities/License";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Building2, Users, Euro, Calendar } from "lucide-react";

const COLORS = ['#818cf8', '#6ee7b7', '#fde047', '#fca5a5', '#d8b4fe', '#67e8f9', '#fdba74', '#93c5fd'];

export default function Analytics() {
  const [enterprises, setEnterprises] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [enterpriseData, licenseData] = await Promise.all([
        Enterprise.list('-created_date'),
        License.list('-created_date')
      ]);
      setEnterprises(enterpriseData);
      setLicenses(licenseData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  // Industry distribution
  const industryData = enterprises.reduce((acc, enterprise) => {
    const industry = enterprise.industry || 'unknown';
    acc[industry] = (acc[industry] || 0) + 1;
    return acc;
  }, {});

  const industryChartData = Object.entries(industryData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  // Subscription tier distribution
  const tierData = enterprises.reduce((acc, enterprise) => {
    const tier = enterprise.subscription_tier || 'unknown';
    acc[tier] = (acc[tier] || 0) + 1;
    return acc;
  }, {});

  const tierChartData = Object.entries(tierData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  // License usage by enterprise
  const licenseUsageData = enterprises.map(enterprise => {
    const usedLicenses = licenses.filter(license => 
      license.enterprise_id === enterprise.id && license.status === 'active'
    ).length;
    
    return {
      name: enterprise.name.length > 15 ? enterprise.name.substring(0, 15) + '...' : enterprise.name,
      used: usedLicenses,
      total: enterprise.max_licenses,
      percentage: Math.round((usedLicenses / enterprise.max_licenses) * 100)
    };
  }).slice(0, 10);

  // Revenue by enterprise (mock data for demonstration)
  const revenueData = enterprises
    .filter(enterprise => enterprise.monthly_revenue)
    .sort((a, b) => (b.monthly_revenue || 0) - (a.monthly_revenue || 0))
    .slice(0, 10)
    .map(enterprise => ({
      name: enterprise.name.length > 15 ? enterprise.name.substring(0, 15) + '...' : enterprise.name,
      revenue: enterprise.monthly_revenue
    }));

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Insights and trends across your enterprise licenses</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-xl border border-white/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                <Euro className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                €{enterprises.reduce((sum, ent) => sum + (ent.monthly_revenue || 0), 0).toLocaleString()}
              </div>
              <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +23% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-xl border border-white/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">License Utilization</CardTitle>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {enterprises.length > 0 
                  ? Math.round((licenses.filter(l => l.status === 'active').length / enterprises.reduce((sum, ent) => sum + ent.max_licenses, 0)) * 100)
                  : 0
                }%
              </div>
              <p className="text-sm text-blue-600 font-medium">Overall utilization</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-xl border border-white/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Active Enterprises</CardTitle>
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {enterprises.filter(ent => ent.status === 'active').length}
              </div>
              <p className="text-sm text-purple-600 font-medium">Currently active</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-xl border border-white/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Avg Revenue/Enterprise</CardTitle>
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                €{enterprises.length > 0 
                  ? Math.round(enterprises.reduce((sum, ent) => sum + (ent.monthly_revenue || 0), 0) / enterprises.length)
                  : 0
                }
              </div>
              <p className="text-sm text-orange-600 font-medium">Monthly average</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Industry Distribution */}
          <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-xl border border-white/30">
            <CardHeader>
              <CardTitle>Industry Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={industryChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {industryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Subscription Tiers */}
          <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-xl border border-white/30">
            <CardHeader>
              <CardTitle>Subscription Tiers</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tierChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {tierChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* License Usage by Enterprise */}
          <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-xl border border-white/30">
            <CardHeader>
              <CardTitle>License Usage by Enterprise</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={licenseUsageData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip 
                    formatter={([used, total], name) => [
                      `${used}/${total} (${Math.round((used/total)*100)}%)`,
                      'Used/Total'
                    ]}
                  />
                  <Bar dataKey="used" radius={[0, 4, 4, 0]}>
                    {licenseUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue by Enterprise */}
          <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-xl border border-white/30">
            <CardHeader>
              <CardTitle>Monthly Revenue by Enterprise</CardTitle>
            </CardHeader>
            <CardContent>
              {revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis tickFormatter={(value) => `€${value.toLocaleString()}`} />
                    <Tooltip formatter={(value) => [`€${value.toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                      {revenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-96 text-gray-500">
                  <div className="text-center">
                    <Euro className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>No revenue data available</p>
                    <p className="text-sm">Add revenue information to enterprises to see this chart</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
