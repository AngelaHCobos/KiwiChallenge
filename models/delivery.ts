interface Delivery {
  id: string;
  creation_date: Date;
  state: "pending" | "assigned" | "in_transit" | "delivered";
  pickup: DeliveryPickupLocation;
  dropoff: DeliveryDropoffLocation;
  zone_id: string;
}

interface DeliveryPickupLocation {
  pickup_lat: number;
  pickup_lon: number;
}

interface DeliveryDropoffLocation {
  dropoff_lat: number;
  dropoff_lon: number;
}
