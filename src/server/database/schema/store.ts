/**
 * Aggregate document shape currently persisted at data/agency.json.
 * Phase A keeps this exact shape — no agencyId / deals / notifications arrays yet.
 */

import type { ActivityRecord } from "./activity";
import type { ClientRecord } from "./clients";
import type { ContactRecord } from "./contacts";
import type { LeadRecord } from "./leads";
import type { PropertyRecord } from "./properties";
import type { AgencySettings } from "./settings";
import type { TourRecord } from "./tours";
import type { UserRecord } from "./users";

export type AgencyStore = {
  users: UserRecord[];
  properties: PropertyRecord[];
  leads: LeadRecord[];
  clients: ClientRecord[];
  tours: TourRecord[];
  contacts: ContactRecord[];
  activity: ActivityRecord[];
  settings?: AgencySettings;
};

export function emptyAgencyStore(): AgencyStore {
  return {
    users: [],
    properties: [],
    leads: [],
    clients: [],
    tours: [],
    contacts: [],
    activity: [],
    settings: undefined,
  };
}
