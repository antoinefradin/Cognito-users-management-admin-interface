import type { FromSchema } from 'json-schema-to-ts';

const enterpriseSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "enterprise-schema",
  title: "Enterprise",
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "Company id"
    },
    name: {
      type: "string",
      description: "Company name"
    },
    industry: {
      type: "string",
      enum: [
        "technology",
        "healthcare", 
        "finance",
        "retail",
        "manufacturing",
        "education",
        "consulting",
        "other"
      ],
      description: "Industry sector"
    },
    size: {
      type: "string",
      enum: [
        "startup",
        "small",
        "medium",
        "large",
        "enterprise"
      ],
      description: "Company size"
    },
    contact_email: {
      type: "string",
      format: "email",
      description: "Primary contact email"
    },
    contact_phone: {
      type: "string",
      description: "Contact phone number"
    },
    address: {
      type: "string",
      description: "Company address"
    },
    website: {
      type: "string",
      format: "uri",
      description: "Company website"
    },
    status: {
      type: "string",
      enum: [
        "active",
        "inactive",
        "trial",
        "suspended"
      ],
      default: "active",
      description: "Enterprise status"
    },
    subscription_tier: {
      type: "string",
      enum: [
        "basic",
        "private"
      ],
      default: "basic",
      description: "Subscription tier"
    },
    max_licenses: {
      type: "integer",
      minimum: 1,
      description: "Maximum number of licenses allowed"
    },
    used_licenses: {
      type: "integer",
      minimum: 0,
      default: 0,
      description: "Currently used licenses"
    },
    contract_start_date: {
      type: "string",
      format: "date",
      description: "Contract start date (YYYY-MM-DD)"
    },
    contract_end_date: {
      type: "string",
      format: "date",
      description: "Contract end date (YYYY-MM-DD)"
    },
    monthly_revenue: {
      type: "number",
      minimum: 0,
      description: "Monthly revenue from this enterprise"
    },
    created_date: {
      type: "string",
      format: "date",
      description: "Contract start date (YYYY-MM-DD)"
    },
    updated_date: {
      type: "string",
      format: "date",
      description: "Contract start date (YYYY-MM-DD)"
    },
  },
  required: [
    "name",
    "contact_email",
    "max_licenses"
  ],
  additionalProperties: false
} as const;

// Generate TypeScript type
export type EnterpriseType = FromSchema<typeof enterpriseSchema>;

// Export schema for runtime use
export { enterpriseSchema };