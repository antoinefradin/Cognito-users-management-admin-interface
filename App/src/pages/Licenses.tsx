import React, { useState, useEffect } from "react";
import { License } from "@/entities/License";
import { Enterprise } from "@/entities/Enterprise";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Building2, UserCheck, UserX, Calendar, Edit, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LicenseForm from "@/components/licenses/LicenseForm";
import type { EnterpriseType } from "@/entities/EnterpriseSchema";
import type { LicenseType } from "@/entities/LicenseSchema";



// Main component with TypeScript React.FC type
const Licenses: React.FC = () => {
  // Type the state variables explicitly for better IntelliSense and error catching
  const [licenses, setLicenses] = useState<LicenseType[]>([]);
  const [enterprises, setEnterprises] = useState<EnterpriseType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingLicense, setEditingLicense] = useState<LicenseType | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [enterpriseFilter, setEnterpriseFilter] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, []);

  // Ajout du typage de retour pour la fonction async
  const loadData = async (): Promise<void> => {
    console.log('setIsLoading');
    setIsLoading(true);
    try {
      
      // Typage explicite des promesses retournées
      const [licenseData, enterpriseData] = await Promise.all([
        License.list('-created_date') as Promise<LicenseType[]>,
        Enterprise.list() as Promise<EnterpriseType[]>
      ]);
      setLicenses(licenseData);
      setEnterprises(enterpriseData);

      console.log('data loaded');
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  // Typage du paramètre licenseData
  const handleSaveLicense = async (licenseData: LicenseType): Promise<void> => {
    try {
      if (editingLicense) {
        // Mise à jour d'une licence existante
        await License.update(editingLicense.id!, licenseData);
      } else {
        // Création d'une nouvelle licence avec last_used initialisé à null
        await License.create({
          ...licenseData,
          last_used: 'null'
        });
        
        // Mise à jour du compteur used_licenses de l'entreprise
        const enterprise = enterprises.find((ent: EnterpriseType) => ent.id === licenseData.enterprise_id);
        if (enterprise && licenseData.status === 'active') {
          await Enterprise.update(enterprise.id!, {
            ...enterprise,
            used_licenses: (enterprise.used_licenses || 0) + 1
          });
        }
      }
      setShowForm(false);
      setEditingLicense(null);
      await loadData();
    } catch (error) {
      console.error('Error saving license:', error);
    }
  };

  // Typage du paramètre license
  const handleEditLicense = (license: LicenseType): void => {
    setEditingLicense(license);
    setShowForm(true);
  };

  // Typage du paramètre enterpriseId et de la valeur de retour
  const getEnterpriseName = (enterpriseId: string): string => {
    const enterprise = enterprises.find((ent: EnterpriseType) => ent.id === enterpriseId);
    return enterprise ? enterprise.name : 'Unknown';
  };

  // Typage des paramètres et valeurs de retour pour les fonctions utilitaires
  const getStatusColor = (status: LicenseType['status']): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'suspended':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getLicenseTypeColor = (type: LicenseType['license_type']): string => {
    switch (type) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'professional':
        return 'bg-blue-100 text-blue-700';
      case 'basic':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Filtrage des licences avec typage approprié
  const filteredLicenses: LicenseType[] = licenses.filter((license: LicenseType) => {
    const matchesSearch = license.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        license.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        getEnterpriseName(license.enterprise_id).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || license.status === statusFilter;
    const matchesEnterprise = enterpriseFilter === "all" || license.enterprise_id === enterpriseFilter;
    
    return matchesSearch && matchesStatus && matchesEnterprise;
  });

  // Calcul des statistiques avec typage explicite
  const activeLicenses: number = licenses.filter((license: LicenseType) => license.status === 'active').length;
  const inactiveLicenses: number = licenses.filter((license: LicenseType) => license.status === 'inactive').length;
  const suspendedLicenses: number = licenses.filter((license: LicenseType) => license.status === 'suspended').length;


    if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Génération de 3 placeholders avec clé typée */}
              {[...Array(3)].map((_: undefined, i: number) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-gray-150 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">License Management</h1>
            <p className="text-gray-600">Manage user licenses across all enterprises</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            Assign License
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <LicenseForm
                license={editingLicense}
                enterprises={enterprises}
                onSave={handleSaveLicense}
                onCancel={() => {
                  setShowForm(false);
                  setEditingLicense(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {!showForm && (
          <>
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-xl border border-white/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Active Licenses</CardTitle>
                    <UserCheck className="w-5 h-5 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{activeLicenses}</div>
                  <p className="text-sm text-green-600 font-medium">Currently in use</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-xl border border-white/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Inactive Licenses</CardTitle>
                    <UserX className="w-5 h-5 text-gray-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{inactiveLicenses}</div>
                  <p className="text-sm text-gray-600 font-medium">Available to assign</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-xl border border-white/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Enterprises</CardTitle>
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{enterprises.length}</div>
                  <p className="text-sm text-blue-600 font-medium">With licenses</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-xl border border-white/30 mb-8 p-6">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search licenses, users, or enterprises..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={enterpriseFilter} onValueChange={setEnterpriseFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Enterprise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Enterprises</SelectItem>
                        {enterprises.map(enterprise => (
                          <SelectItem key={enterprise.id} value={enterprise.id!}>
                            {enterprise.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Licenses Table */}
            <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-xl border border-white/30">
              <CardHeader>
                <CardTitle>Licenses ({filteredLicenses.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>User</TableHead>
                        <TableHead>Enterprise</TableHead>
                        <TableHead>License Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Activated</TableHead>
                        <TableHead>Last Used</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {filteredLicenses.map((license) => (
                          <motion.tr
                            key={license.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-gray-50"
                          >
                            <TableCell>
                              <div>
                                <p className="font-medium text-gray-900">{license.user_name}</p>
                                <p className="text-sm text-gray-500">{license.user_email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">{getEnterpriseName(license.enterprise_id)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={getLicenseTypeColor(license.license_type)}>
                                {license.license_type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(license.status)}>
                                {license.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {license.activation_date ? (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="w-4 h-4" />
                                  {format(new Date(license.activation_date), 'MMM d, yyyy')}
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">Not activated</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {license.last_used && license.last_used !== 'null' ? (
                                <span className="text-sm text-gray-600">
                                  {format(new Date(license.last_used), 'MMM d, yyyy')}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-400">Never</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditLicense(license)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit License
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {filteredLicenses.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <UserCheck className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No licenses found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== "all" || enterpriseFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Start by assigning licenses to users"
                  }
                </p>
                {!searchTerm && statusFilter === "all" && enterpriseFilter === "all" && (
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Assign License
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
export default Licenses;