import { licenseSchema } from "./LicenseSchema";
import type { LicenseType } from "./LicenseSchema";

// Mocked JSON data
export const MOCK_LICENSE_DATA: LicenseType[] = [
  {
    id:"0001a",
    enterprise_id: "TechCorp",
    user_email: "john.doe@techcorp.com",
    user_name: "John Doe",
    status: "active",
    license_type: "professional",
    activation_date: "2024-01-15",
    last_used: "2024-01-20T14:30:00Z",
    features_access: ["dashboard", "analytics", "reporting", "api_access"],
    created_date: "2024-01-15T09:00:00Z",
    updated_date: "2024-01-20T14:30:00Z"
  },
  {
    id:"0001z",
    enterprise_id: "HealthInc",
    user_email: "jane.smith@healthinc.com",
    user_name: "Jane Smith",
    status: "active",
    license_type: "admin",
    activation_date: "2024-01-10",
    last_used: "2024-01-21T10:15:00Z",
    features_access: [
      "dashboard",
      "analytics", 
      "reporting",
      "user_management",
      "api_access",
      "integrations",
      "advanced_security"
    ],
    created_date: "2024-01-10T08:00:00Z",
    updated_date: "2024-01-21T10:15:00Z"
  }
];



export const License = {
  licenseSchema,
  async list(sortBy: string = "name"): Promise<LicenseType[]> {
    // Simulated async API call
    return new Promise((resolve) => {
      setTimeout(() => {
        let sorted = [...MOCK_LICENSE_DATA];
        
        // Handle sort direction
        const isDescending = sortBy.startsWith("-");
        const sortField = isDescending ? sortBy.substring(1) : sortBy;
        
        // Sort based on field type
        sorted = sorted.sort((a, b) => {
          switch (sortField) {
            case "name":
              return a.user_name.localeCompare(b.user_name);
            
            case "created_date":
              // Since we don't have created_date in schema, use contract_start_date as fallback
              const dateA = a.created_date || "1970-01-01";
              const dateB = b.created_date || "1970-01-01";
              return new Date(dateA).getTime() - new Date(dateB).getTime();
            
              default:
              return a.user_name.localeCompare(b.user_name);
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
  async create(licenseData: Partial<LicenseType>): Promise<LicenseType> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Generate a unique ID for the new enterprise
          const newId = `ent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          // Get current date for created_date and updated_date
          const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
          
          const newLicense: LicenseType = {
            id: newId,
            enterprise_id: licenseData.enterprise_id || "",
            user_email: licenseData.user_email || "",
            user_name: licenseData.user_name || "",
            status: licenseData.status || "active",
            license_type: licenseData.license_type || "basic",
            activation_date: licenseData.activation_date || currentDate,
            last_used: licenseData.last_used || "",
            features_access: licenseData.features_access || [],
            created_date: currentDate,
            updated_date: currentDate,
            ...licenseData // Override with any provided data
          };

          // Add to mock data (in a real app, this would be a database operation)
          MOCK_LICENSE_DATA.push(newLicense);
          
          resolve(newLicense);
        } catch (error) {
          reject(new Error(`Failed to create enterprise: ${error}`));
        }
      }, 300);
    });
  },

  // Added update function to handle enterprise modifications
  async update(id: string, licenseData: Partial<LicenseType>): Promise<LicenseType> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Find the license to update
          const licenseIndex = MOCK_LICENSE_DATA.findIndex(license => license.id === id);
          
          if (licenseIndex === -1) {
            reject(new Error(`Enterprise with id ${id} not found`));
            return;
          }

          // Get current date for updated_date
          const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
          
          // Update the license with new data
          const updatedLicense: LicenseType = {
            ...MOCK_LICENSE_DATA[licenseIndex],
            ...licenseData,
            id, // Ensure ID cannot be changed
            updated_date: currentDate // Always update the modification date
          };

          // Replace in mock data (in a real app, this would be a database operation)
          MOCK_LICENSE_DATA[licenseIndex] = updatedLicense;
          
          resolve(updatedLicense);
        } catch (error) {
          reject(new Error(`Failed to update enterprise: ${error}`));
        }
      }, 300);
    });
  }
} as const

// Export the type for use in components
export type { LicenseType };