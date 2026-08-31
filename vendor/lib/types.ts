export type Organization = {
  id: string;
  legal_name: string;
  segment: string;
  city: string;
  status: string;
};

export type Outlet = {
  id: string;
  name: string;
  address: string;
  city: string;
  pickup_cadence: string;
  status: string;
};

export type OutletRef = { id: string; name: string; org_id: string };

export type PickupRequest = {
  id: string;
  status: string;
  estimated_kg: number | null;
  requested_window_start: string | null;
  created_at: string;
  outlets: OutletRef | OutletRef[] | null;
};

export type CollectionSummary = {
  id: string;
  collected_at: string;
  net_kg: number;
  quality_grade: "standard" | "premium" | "low";
  rate_per_kg: number;
  net_payable: number;
  photo_url: string | null;
  outlets: OutletRef | OutletRef[] | null;
};

export type StatsPeriod = { kg: number; payable: number; count: number };
export type Stats = {
  month: StatsPeriod;
  lifetime: StatsPeriod & { co2eKgEstimate: number };
};
