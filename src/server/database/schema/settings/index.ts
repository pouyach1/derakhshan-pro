/**
 * Logical schema: agency operational settings (runtime overrides).
 * Brand copy remains in siteConfig; this is panel-persisted ops config.
 */

export type AgencySettings = {
  managerNameFa: string;
  notifyEmail: string;
  emailAlerts: boolean;
  smsAlerts: boolean;
  phone: string;
  address: string;
  publicDomain: string;
};
