import { enterpriseSchema } from "./EnterpriseSchema";
import type { EnterpriseType } from "./EnterpriseSchema";

// Mocked JSON data
const MOCK_DATA: EnterpriseType[] = [
  {
    id: "ent_001",
    name: "TechCorp",
    industry: "technology",
    size: "large",
    contact_email: "info@techcorp.com",
    contact_phone: "+1-555-0123",
    address: "123 Tech Street, San Francisco, CA 94105",
    website: "https://techcorp.com",
    status: "active",
    subscription_tier: "private",
    max_licenses: 100,
    used_licenses: 75,
    contract_start_date: "2024-01-01",
    contract_end_date: "2024-12-31",
    monthly_revenue: 25000,
    created_date: "2024-01-01T00:00:00Z",
    updated_date: "2024-01-15T10:30:00Z"
  },
  {
    id: "ent_002",
    name: "HealthPlus Solutions",
    industry: "healthcare",
    size: "medium",
    contact_email: "contact@healthplus.com",
    contact_phone: "+1-555-0456",
    address: "456 Medical Center Dr, Boston, MA 02115",
    website: "https://healthplus.com",
    status: "active",
    subscription_tier: "basic",
    max_licenses: 50,
    used_licenses: 32,
    contract_start_date: "2024-02-15",
    contract_end_date: "2025-02-14",
    monthly_revenue: 12500,
    created_date: "2024-02-15T00:00:00Z",
    updated_date: "2024-02-20T14:22:00Z"
  },
  {
    id: "ent_003",
    name: "EduTech Innovations",
    industry: "education",
    size: "small",
    contact_email: "admin@edutech.com",
    contact_phone: "+1-555-0789",
    address: "789 Learning Ave, Austin, TX 78701",
    website: "https://edutech.com",
    status: "trial",
    subscription_tier: "basic",
    max_licenses: 25,
    used_licenses: 8,
    contract_start_date: "2024-03-01",
    contract_end_date: "2024-03-31",
    monthly_revenue: 0,
    created_date: "2024-03-01T00:00:00Z",
    updated_date: "2024-03-05T09:15:00Z"
  },
  {
    id: "ent_004",
    name: "Financial Dynamics",
    industry: "finance",
    size: "large",
    contact_email: "support@financialdynamics.com",
    contact_phone: "+1-555-0321",
    address: "321 Wall Street, New York, NY 10005",
    website: "https://financialdynamics.com",
    status: "active",
    subscription_tier: "private",
    max_licenses: 200,
    used_licenses: 150,
    contract_start_date: "2023-12-01",
    contract_end_date: "2024-11-30",
    monthly_revenue: 50000,
    created_date: "2023-12-01T00:00:00Z",
    updated_date: "2024-01-10T16:45:00Z"
  },
  {
    id: "ent_005",
    name: "GreenEnergy Co",
    industry: "retail",
    size: "medium",
    contact_email: "info@greenenergy.com",
    contact_phone: "+1-555-0654",
    address: "654 Renewable Blvd, Denver, CO 80202",
    website: "https://greenenergy.com",
    status: "suspended",
    subscription_tier: "basic",
    max_licenses: 75,
    used_licenses: 0,
    contract_start_date: "2024-01-15",
    contract_end_date: "2025-01-14",
    monthly_revenue: 0,
    created_date: "2024-01-15T00:00:00Z",
    updated_date: "2024-02-28T11:30:00Z"
  },
  {
    id: "ent_006",
    name: "RetailMax Systems",
    industry: "retail",
    size: "large",
    contact_email: "contact@retailmax.com",
    contact_phone: "+1-555-0987",
    address: "987 Commerce Plaza, Chicago, IL 60601",
    website: "https://retailmax.com",
    status: "active",
    subscription_tier: "private",
    max_licenses: 150,
    used_licenses: 120,
    contract_start_date: "2024-02-01",
    contract_end_date: "2025-01-31",
    monthly_revenue: 37500,
    created_date: "2024-02-01T00:00:00Z",
    updated_date: "2024-02-15T13:20:00Z"
  }
];

export { MOCK_DATA };



export const Enterprise = {
  enterpriseSchema,
  async list(sortBy: string = "name"): Promise<EnterpriseType[]> {
    // Simulated async API call
    return new Promise((resolve) => {
      setTimeout(() => {
        let sorted = [...MOCK_DATA];
        
        // Handle sort direction
        const isDescending = sortBy.startsWith("-");
        const sortField = isDescending ? sortBy.substring(1) : sortBy;
        
        // Sort based on field type
        sorted = sorted.sort((a, b) => {
          switch (sortField) {
            case "name":
              return a.name.localeCompare(b.name);
            
            case "created_date":
              // Since we don't have created_date in schema, use contract_start_date as fallback
              const dateA = a.contract_start_date || "1970-01-01";
              const dateB = b.contract_start_date || "1970-01-01";
              return new Date(dateA).getTime() - new Date(dateB).getTime();
            
              default:
              return a.name.localeCompare(b.name);
          }
        });
        // Reverse if descending order
        if (isDescending) {
          sorted.reverse();
        }
        
        resolve(sorted);
      }, 500);
    });
  },

  // Added create function to handle new enterprise creation
  async create(enterpriseData: Partial<EnterpriseType>): Promise<EnterpriseType> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Generate a unique ID for the new enterprise
          const newId = `ent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          // Get current date for created_date and updated_date
          const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
          
          // Create the new enterprise with required fields and defaults
          const newEnterprise: EnterpriseType = {
            id: newId,
            name: enterpriseData.name || "",
            industry: enterpriseData.industry || "other",
            size: enterpriseData.size || "startup",
            contact_email: enterpriseData.contact_email || "",
            contact_phone: enterpriseData.contact_phone || "",
            address: enterpriseData.address || "",
            website: enterpriseData.website || "",
            status: enterpriseData.status || "active",
            subscription_tier: enterpriseData.subscription_tier || "basic",
            max_licenses: enterpriseData.max_licenses || 1,
            used_licenses: enterpriseData.used_licenses || 0,
            contract_start_date: enterpriseData.contract_start_date || currentDate,
            contract_end_date: enterpriseData.contract_end_date || "",
            monthly_revenue: enterpriseData.monthly_revenue || 0,
            created_date: currentDate,
            updated_date: currentDate,
            ...enterpriseData // Override with any provided data
          };

          // Add to mock data (in a real app, this would be a database operation)
          MOCK_DATA.push(newEnterprise);
          
          resolve(newEnterprise);
        } catch (error) {
          reject(new Error(`Failed to create enterprise: ${error}`));
        }
      }, 300);
    });
  },

  // Added update function to handle enterprise modifications
  async update(id: string, enterpriseData: Partial<EnterpriseType>): Promise<EnterpriseType> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Find the enterprise to update
          const enterpriseIndex = MOCK_DATA.findIndex(enterprise => enterprise.id === id);
          
          if (enterpriseIndex === -1) {
            reject(new Error(`Enterprise with id ${id} not found`));
            return;
          }

          // Get current date for updated_date
          const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
          
          // Update the enterprise with new data
          const updatedEnterprise: EnterpriseType = {
            ...MOCK_DATA[enterpriseIndex],
            ...enterpriseData,
            id, // Ensure ID cannot be changed
            updated_date: currentDate // Always update the modification date
          };

          // Replace in mock data (in a real app, this would be a database operation)
          MOCK_DATA[enterpriseIndex] = updatedEnterprise;
          
          resolve(updatedEnterprise);
        } catch (error) {
          reject(new Error(`Failed to update enterprise: ${error}`));
        }
      }, 300);
    });
  }
} as const

// Export the type for use in components
export type { EnterpriseType };