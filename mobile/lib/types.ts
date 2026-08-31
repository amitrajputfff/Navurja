export type Organization = {
  id: string;
  legal_name: string;
  segment: string;
};

export type Outlet = {
  id: string;
  name: string;
  address: string;
  city: string;
  contact_name: string | null;
  contact_phone: string | null;
  lat: number | null;
  lng: number | null;
  organizations: Organization | Organization[] | null;
};

export type PickupRequest = {
  id: string;
  status: string;
  requested_window_start: string | null;
  requested_window_end: string | null;
  estimated_kg: number | null;
  outlets: Outlet | Outlet[] | null;
};

export type RateCard = {
  city: string;
  segment: string;
  quality_grade: "standard" | "premium" | "low";
  rate_per_kg: number;
};

export type HistoryOutlet = {
  id: string;
  name: string;
  address: string;
  organizations: Pick<Organization, "id" | "legal_name"> | Pick<Organization, "id" | "legal_name">[] | null;
};

export type Collection = {
  id: string;
  collected_at: string;
  net_kg: number;
  quality_grade: "standard" | "premium" | "low";
  rate_per_kg: number;
  net_payable: number;
  photo_url: string | null;
  outlets: HistoryOutlet | HistoryOutlet[] | null;
};

export type StatsSummary = { count: number; kg: number; payable: number };
export type Stats = { today: StatsSummary; week: StatsSummary };

export type DetailOutlet = {
  id: string;
  name: string;
  address: string;
  city: string;
  organizations: Organization | Organization[] | null;
};

export type Payment = {
  mode: "cash" | "upi" | "bank" | "credit_note";
  amount: number;
  status: "pending" | "settled" | "failed";
};

export type CollectionDetail = {
  id: string;
  collected_at: string;
  gross_kg: number | null;
  tare_kg: number | null;
  net_kg: number;
  quality_grade: "standard" | "premium" | "low";
  rate_per_kg: number;
  net_payable: number;
  gps_lat: number | null;
  gps_lng: number | null;
  photo_url: string | null;
  confirmation_otp_verified: boolean;
  notes: string | null;
  outlets: DetailOutlet | DetailOutlet[] | null;
  payments: Payment | Payment[] | null;
};
