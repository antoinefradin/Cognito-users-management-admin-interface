import { licenseSchema } from "./LicenseSchema";
import type { LicenseType } from "./LicenseSchema";

// Mocked JSON data
export const MOCK_LICENSE_DATA: LicenseType[] = [
  {
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
} as const

// Export the type for use in components
export type { LicenseType };