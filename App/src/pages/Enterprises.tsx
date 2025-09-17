
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

// import { Enterprise } from "@/entities/Enterprise";
// import { License } from "@/entities/License";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EnterpriseCard from "@/components/enterprises/EnterpriseCard";
import EnterpriseForm from "@/components/enterprises/EnterpriseForm";
// import type { EnterpriseType } from "@/entities/EnterpriseSchema";
// import type { LicenseType } from "@/entities/LicenseSchema";
import useEnterprise from "@/hooks/useEnterpriseApi";
import type { EnterpriseMeta, GetEnterpriseResponse} from '@/@types/enterprise.d';



// Added type for filter values to ensure type safety
type StatusFilter = "all" | "active" | "trial" | "inactive" | "suspended";
type TierFilter = "all" | "basic" | "private";


// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Enterprises: React.FC = () => {  

  // ========================================================================
  // HOOKS
  // ========================================================================
  const navigate = useNavigate();
  const { getEnterprises } = useEnterprise();
  const [enterprises, setEnterprises] = useState<EnterpriseMeta[]>([]);
  const [licenses, setLicenses] = useState<LicenseType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasProcessed, setHasProcessed] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");

  // SWR hook 
  /* getEnterprise() returns an SWR object with this structure:
  {
    data: GetEnterpriseResponse | undefined,    // API data
    error: any,                                 // Potential error
    isLoading: boolean,                         // Loading state
    mutate: Function,                           // Function to revalidate
    isValidating: boolean,                      // Validation state
    // ... other SWR properties
  }*/
  const { data: enterpriseResponse } = getEnterprises();

  useEffect(() => {
    if (enterpriseResponse && !hasProcessed) {
      try {
        console.log('🏭 Données entreprises reçues:', enterpriseResponse);
        
        setEnterprises(enterpriseResponse);
        
        setHasProcessed(true);
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Error from getEnterprises(): ', error as Error);
        setHasProcessed(true);
        setIsLoading(false);
      }
    }
  }, [enterpriseResponse, hasProcessed]);



  // ========================================================================
  // HANDLERS
  // ========================================================================
  
  // const handleSaveEnterprise = async (enterpriseData: Partial<EnterpriseType>): Promise<void> => {
  //   try {
  //     if (editingEnterprise) {
  //       await Enterprise.update(editingEnterprise.id!, enterpriseData);
  //     } else {
  //       await Enterprise.create({
  //         ...enterpriseData,
  //         used_licenses: 0
  //       });
  //     }
  //     setShowForm(false);
  //     setEditingEnterprise(null);
  //     loadData();
  //   } catch (error) {
  //     // Added proper error typing
  //     console.error('Error saving enterprise:', error as Error);
  //   }
  // };

  // Edit enterprise handle button - TO DO
  const handleEdit = (enterprise: EnterpriseType): void => {
    //setEditingEnterprise(enterprise);
    setShowForm(true);
  };

  // View licenses handle button - TO DO
  const handleViewLicenses = (enterprise: EnterpriseType): void => {
    // This would navigate to licenses page with enterprise filter
    console.log('View licenses for:', enterprise.name);
  };

  // Added proper typing for the filter function
  const filteredEnterprises: EnterpriseMeta[] = enterprises.filter((enterprise: EnterpriseMeta) => {
    const matchesSearch = enterprise.name.toLowerCase().includes(searchTerm.toLowerCase()); // ||
                        // enterprise.contact_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || enterprise.status === statusFilter;
    const matchesTier = tierFilter === "all" || enterprise.subscriptionTier === tierFilter;
    
    return matchesSearch && matchesStatus && matchesTier;
  });


  // ========================================================================
  // RENDER
  // ========================================================================

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Enterprises</h1>
            <p className="text-gray-600">Manage your enterprise clients and their subscriptions</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Enterprise
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
              <EnterpriseForm
                //enterprise={editingEnterprise}
                onSuccess={(data) => {
                  setShowForm(false);
                  
                  // Optional : refresh the enterpries list
                  //refreshEnterprises?.();
                }}
                onError={(error) => {
                  console.error('Enterprise save failed:', error);
                }}
                onCancel={() => {
                  setShowForm(false);
                  //setEditingEnterprise(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {!showForm && (
          <>
            <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-xl shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search enterprises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={tierFilter} onValueChange={(value) => setTierFilter(value as TierFilter)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredEnterprises.map((enterprise) => (
                  <motion.div
                    key={enterprise.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <EnterpriseCard
                      enterprise={enterprise}
                      onEdit={handleEdit}
                      onViewLicenses={handleViewLicenses}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredEnterprises.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No enterprises found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== "all" || tierFilter !== "all" 
                    ? "Try adjusting your filters"
                    : "Get started by adding your first enterprise"
                  }
                </p>
                {!searchTerm && statusFilter === "all" && tierFilter === "all" && (
                  <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Enterprise
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

export default Enterprises;