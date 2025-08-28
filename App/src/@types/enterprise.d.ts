// src/@types/enterprise.d.ts
export enum IndustryEnum {
    TECHNOLOGY = "technology",
    HEALTHCARE = "healthcare",
    FINANCE = "finance",
    RETAIL = "retail",
    MANUFACTURING = "manufacturing",
    EDUCATION = "education",
    CONSULTING = "consulting",
    OTHER = "other",
}

export enum CompanySizeEnum {
    STARTUP = "startup",
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large",
    ENTERPRISE = "enterprise",
}

export enum EnterpriseStatusEnum {
    ACTIVE = "active",
    INACTIVE = "inactive",
    TRIAL = "trial",
    SUSPENDED = "suspended",
}

export enum SubscriptionTierEnum {
    BASIC = "basic",
    PRIVATE = "private",
}


export type EnterpriseMeta = {
  id: string;
  name: string;
  industry: IndustryEnum;
  size: CompanySizeEnum;
  contactEmail: string;
  contactPhone: string;
  address: string;
  website: string;
  status: EnterpriseStatusEnum;
  subscriptionTier: SubscriptionTierEnum;
  maxLicenses: number;
  contractStartDate: string;
  contractEndDate: string;
  monthlyRevenue: number;
  usedLicenses: number;
  createdDate: string;
  updatedDate: string;
}


export type RegisterEnterpriseRequest = {
  id: string;
  name: string;
  industry?: IndustryEnum;
  size?: CompanySizeEnum;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  website?: string;
  status: EnterpriseStatusEnum;
  subscriptionTier: SubscriptionTierEnum;
  maxLicenses: number;
  usedLicenses: number;
  contractStartDate: string;
  contractEndDate?: string;
  monthlyRevenue?: number;
};

export type RegisterEnterpriseResponse = RegisterEnterpriseRequest & {
  createdAt: string;
  updatedAt: string;
};

