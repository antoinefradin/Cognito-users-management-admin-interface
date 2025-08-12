import type { FromSchema } from 'json-schema-to-ts';

const licenseSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "license-schema",
  title: "License",
  type: "object",
  properties: {
    enterprise_id: {
      type: "string",
      description: "ID of the enterprise this license belongs to"
    },
    user_email: {
      type: "string",
      format: "email",
      description: "Email of the user assigned to this license"
    },
    user_name: {
      type: "string",
      minLength: 1,
      description: "Full name of the user"
    },
    status: {
      type: "string",
      enum: [
        "active",
        "inactive",
        "suspended"
      ],
      default: "active",
      description: "License status"
    },
    license_type: {
      type: "string",
      enum: [
        "basic",
        "professional",
        "admin"
      ],
      default: "basic",
      description: "Type of license"
    },
    activation_date: {
      type: "string",
      format: "date",
      description: "When the license was activated (YYYY-MM-DD)"
    },
    last_used: {
      type: "string",
      format: "date-time",
      description: "Last time the license was used (ISO 8601 format)"
    },
    features_access: {
      type: "array",
      items: {
        type: "string",
        enum: [
          "dashboard",
          "analytics",
          "reporting",
          "user_management",
          "api_access",
          "integrations",
          "advanced_security",
          "custom_branding",
          "priority_support",
          "data_export"
        ]
      },
      uniqueItems: true,
      description: "List of features this license has access to"
    },
    created_date: {
      type: "string",
      format: "date-time",
      description: "When the license was created"
    },
    updated_date: {
      type: "string",
      format: "date-time",
      description: "When the license was last updated"
    }
  },
  required: [
    "enterprise_id",
    "user_email",
    "user_name"
  ],
  additionalProperties: false
} as const;

// Generate TypeScript type
export type LicenseType = FromSchema<typeof licenseSchema>;

// Export schema for runtime use
export { licenseSchema };