import { resetStore, type AgencyStore } from "@/server/db/store";
import { emptyAgencyStore } from "@/server/database/schema";
import { hashPassword } from "@/server/auth/password";
import type { AuthSession, UserRole } from "@/lib/auth";
import { signSession, authCookieName } from "@/server/auth/session";
import {
  createAdminUser,
  createAgentUser,
  createClientUser,
  createProperty,
  createClientRecord,
  createLead,
  createDeal,
  createTour,
  createBlogPost,
  createChatThread,
  createChatMessage,
  TEST_PASSWORD,
} from "../factories";

export { TEST_PASSWORD };

export type IsolationFixture = {
  store: AgencyStore;
  admin: ReturnType<typeof createAdminUser>;
  agentA: ReturnType<typeof createAgentUser>;
  agentB: ReturnType<typeof createAgentUser>;
  clientA: ReturnType<typeof createClientUser>;
  clientB: ReturnType<typeof createClientUser>;
  propertyA: ReturnType<typeof createProperty>;
  propertyB: ReturnType<typeof createProperty>;
  clientRecordA: ReturnType<typeof createClientRecord>;
  clientRecordB: ReturnType<typeof createClientRecord>;
  leadA: ReturnType<typeof createLead>;
  leadB: ReturnType<typeof createLead>;
  dealA: ReturnType<typeof createDeal>;
  dealB: ReturnType<typeof createDeal>;
  tourA: ReturnType<typeof createTour>;
  tourB: ReturnType<typeof createTour>;
  blogA: ReturnType<typeof createBlogPost>;
  blogB: ReturnType<typeof createBlogPost>;
  draftBlog: ReturnType<typeof createBlogPost>;
  threadA: ReturnType<typeof createChatThread>;
  threadB: ReturnType<typeof createChatThread>;
};

export async function buildIsolationFixture(): Promise<IsolationFixture> {
  const passwordHash = await hashPassword(TEST_PASSWORD);
  const admin = createAdminUser({ passwordHash });
  const agentA = createAgentUser({
    id: "agent-a",
    agentId: "a-test-a",
    phone: "09120000001",
    email: "agent-a@test.local",
    name: "مشاور الف",
    passwordHash,
  });
  const agentB = createAgentUser({
    id: "agent-b",
    agentId: "a-test-b",
    phone: "09120000002",
    email: "agent-b@test.local",
    name: "مشاور ب",
    passwordHash,
  });
  const clientA = createClientUser({
    id: "client-a",
    phone: "09120000011",
    name: "موکل الف",
    passwordHash,
  });
  const clientB = createClientUser({
    id: "client-b",
    phone: "09120000012",
    name: "موکل ب",
    passwordHash,
  });

  const propertyA = createProperty({
    id: "prop-a",
    agentId: agentA.agentId,
    title: "ملک الف",
    code: "PA-001",
    status: "published",
  });
  const propertyB = createProperty({
    id: "prop-b",
    agentId: agentB.agentId,
    title: "ملک ب",
    code: "PB-001",
    status: "published",
  });

  const clientRecordA = createClientRecord({
    id: "crm-client-a",
    agentId: agentA.agentId!,
    name: "موکل CRM الف",
    phone: "09121110001",
  });
  const clientRecordB = createClientRecord({
    id: "crm-client-b",
    agentId: agentB.agentId!,
    name: "موکل CRM ب",
    phone: "09121110002",
  });

  const leadA = createLead({
    id: "lead-a",
    assignedAgentId: agentA.agentId!,
    clientName: "لید الف",
  });
  const leadB = createLead({
    id: "lead-b",
    assignedAgentId: agentB.agentId!,
    clientName: "لید ب",
  });

  const dealA = createDeal({
    id: "deal-a",
    propertyId: propertyA.id,
    agentId: agentA.agentId!,
    title: "معامله الف",
  });
  const dealB = createDeal({
    id: "deal-b",
    propertyId: propertyB.id,
    agentId: agentB.agentId!,
    title: "معامله ب",
  });

  const tourA = createTour({
    id: "tour-a",
    agentId: agentA.agentId!,
    propertyId: propertyA.id,
    clientName: clientRecordA.name,
  });
  const tourB = createTour({
    id: "tour-b",
    agentId: agentB.agentId!,
    propertyId: propertyB.id,
    clientName: clientRecordB.name,
  });

  const blogA = createBlogPost({
    id: "blog-a",
    slug: "article-agent-a",
    authorUserId: agentA.id,
    authorAgentId: agentA.agentId,
    title: "مقاله مشاور الف",
    status: "published",
  });
  const blogB = createBlogPost({
    id: "blog-b",
    slug: "article-agent-b",
    authorUserId: agentB.id,
    authorAgentId: agentB.agentId,
    title: "مقاله مشاور ب",
    status: "published",
  });
  const draftBlog = createBlogPost({
    id: "blog-draft",
    slug: "draft-secret",
    authorUserId: agentA.id,
    authorAgentId: agentA.agentId,
    title: "پیش‌نویس مخفی",
    status: "draft",
  });

  const threadA = createChatThread({
    id: "thread-a",
    kind: "support",
    ownerUserId: clientA.id,
    ownerRole: "client",
    ownerName: clientA.name,
  });
  const threadB = createChatThread({
    id: "thread-b",
    kind: "support",
    ownerUserId: clientB.id,
    ownerRole: "client",
    ownerName: clientB.name,
  });

  const messages = [
    createChatMessage({
      id: "msg-a1",
      threadId: threadA.id,
      senderId: clientA.id,
      senderRole: "client",
      senderName: clientA.name,
      body: "سلام از موکل الف",
    }),
    createChatMessage({
      id: "msg-b1",
      threadId: threadB.id,
      senderId: clientB.id,
      senderRole: "client",
      senderName: clientB.name,
      body: "سلام از موکل ب",
    }),
  ];

  const store: AgencyStore = {
    ...emptyAgencyStore(),
    users: [admin, agentA, agentB, clientA, clientB],
    properties: [propertyA, propertyB],
    clients: [clientRecordA, clientRecordB],
    leads: [leadA, leadB],
    tours: [tourA, tourB],
    deals: [dealA, dealB],
    blogPosts: [blogA, blogB, draftBlog],
    chatThreads: [threadA, threadB],
    chatMessages: messages,
    activity: [],
    contacts: [],
    propertyImages: [],
  };

  resetStore(store);
  return {
    store,
    admin,
    agentA,
    agentB,
    clientA,
    clientB,
    propertyA,
    propertyB,
    clientRecordA,
    clientRecordB,
    leadA,
    leadB,
    dealA,
    dealB,
    tourA,
    tourB,
    blogA,
    blogB,
    draftBlog,
    threadA,
    threadB,
  };
}

export function resetTestStore(store?: AgencyStore) {
  resetStore(store ?? emptyAgencyStore());
}

export async function sessionFor(user: {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  agentId?: string | null;
  onboardingComplete?: boolean;
}): Promise<AuthSession> {
  return {
    id: user.id,
    phone: user.phone,
    name: user.name,
    role: user.role,
    agentId: user.agentId || undefined,
    onboardingComplete: user.onboardingComplete ?? true,
  };
}

export async function authCookieFor(
  user: {
    id: string;
    phone: string;
    name: string;
    role: UserRole;
    agentId?: string | null;
    onboardingComplete?: boolean;
  },
  ttlSeconds = 60 * 60,
) {
  const session = await sessionFor(user);
  const token = await signSession(session, ttlSeconds);
  return `${authCookieName()}=${encodeURIComponent(token)}`;
}
