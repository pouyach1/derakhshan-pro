import type { AgentClient, AgentProperty, AgentPropertyStatus, AgentTour } from "@/config/agent-crm";
import { formatToman, fallbackImage } from "@/lib/money";
import type { ClientRecord, PropertyRecord, PropertyStatus, TourRecord } from "@/server/db/store";

export function mapPropertyToAgent(item: PropertyRecord): AgentProperty {
  const status: AgentPropertyStatus =
    item.status === "negotiation"
      ? "negotiation"
      : item.status === "sold" || item.status === "archived"
        ? "sold"
        : "active";
  return {
    id: item.id,
    agentId: item.agentId || "",
    title: item.title,
    location: item.location,
    neighborhood: item.neighborhood,
    price: item.price,
    priceLabel: formatToman(item.price, item.listingType),
    image: fallbackImage(item.imageUrl),
    bedrooms: item.bedrooms,
    area: item.areaSqm,
    dealType: item.listingType,
    status,
    features: item.features,
    views: item.views,
  };
}

export function agentStatusToProperty(status: AgentPropertyStatus): PropertyStatus {
  if (status === "negotiation") return "negotiation";
  if (status === "sold") return "sold";
  return "published";
}

export function mapClientToAgent(item: ClientRecord): AgentClient {
  return {
    id: item.id,
    agentId: item.agentId,
    name: item.name,
    phone: item.phone,
    budgetMin: item.budgetMin,
    budgetMax: item.budgetMax,
    budgetLabel: `${formatToman(item.budgetMin)} تا ${formatToman(item.budgetMax)}`,
    preferredNeighborhood: item.preferredNeighborhood,
    urgency: item.urgency,
    notes: item.notes.map((note, index) => ({
      id: note.id || `${item.id}-n-${index}`,
      at: note.at || "",
      text: note.text,
    })),
  };
}

export function mapTourToAgent(item: TourRecord, properties: PropertyRecord[]): AgentTour {
  const property = properties.find((row) => row.id === item.propertyId);
  return {
    id: item.id,
    agentId: item.agentId,
    propertyId: item.propertyId,
    propertyTitle: property?.title || "فایل",
    clientName: item.clientName,
    when: item.scheduledAt,
    dayLabel: item.dayLabel,
    time: item.timeLabel,
    status: item.status,
  };
}
