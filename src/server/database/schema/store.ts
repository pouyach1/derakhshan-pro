/**
 * Aggregate document shape for the single Derakhshan office.
 * Optional arrays are normalized on load (additive — no data loss).
 */

import type { ActivityRecord } from "./activity";
import type { BlogPostRecord } from "./blog_posts";
import type { ChatMessageRecord, ChatThreadRecord } from "./chat";
import type { ClientRecord } from "./clients";
import type { ContactRecord } from "./contacts";
import type { DealRecord } from "./deals";
import type { LeadRecord } from "./leads";
import type { PropertyRecord } from "./properties";
import type { PropertyImageRecord } from "./property_images";
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
  /** Normalized gallery rows; kept in sync with property.gallery */
  propertyImages?: PropertyImageRecord[];
  /** Closed / tracked deals for the office */
  deals?: DealRecord[];
  /** Editorial CMS posts (additive — older stores normalize to []). */
  blogPosts?: BlogPostRecord[];
  /** Support + admin desk chat threads (additive). */
  chatThreads?: ChatThreadRecord[];
  /** Messages belonging to chatThreads (additive). */
  chatMessages?: ChatMessageRecord[];
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
    propertyImages: [],
    deals: [],
    blogPosts: [],
    chatThreads: [],
    chatMessages: [],
    settings: undefined,
  };
}

/** Ensure newer collections exist without rewriting existing rows. */
export function normalizeAgencyStore(store: AgencyStore): AgencyStore {
  if (!Array.isArray(store.propertyImages)) store.propertyImages = [];
  if (!Array.isArray(store.deals)) store.deals = [];
  if (!Array.isArray(store.blogPosts)) store.blogPosts = [];
  if (!Array.isArray(store.chatThreads)) store.chatThreads = [];
  if (!Array.isArray(store.chatMessages)) store.chatMessages = [];
  if (!Array.isArray(store.users)) store.users = [];
  if (!Array.isArray(store.properties)) store.properties = [];
  if (!Array.isArray(store.leads)) store.leads = [];
  if (!Array.isArray(store.clients)) store.clients = [];
  if (!Array.isArray(store.tours)) store.tours = [];
  if (!Array.isArray(store.contacts)) store.contacts = [];
  if (!Array.isArray(store.activity)) store.activity = [];
  return store;
}
