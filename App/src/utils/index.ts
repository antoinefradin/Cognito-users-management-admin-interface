// src/utils/navigation.ts

/**
 * Creates a URL path for a given page name
 * @param pageName - The name of the page to create URL for
 * @returns The formatted URL path
 */
export const createPageUrl = (pageName: string): string => {
  return `/${pageName.toLowerCase()}`;
};