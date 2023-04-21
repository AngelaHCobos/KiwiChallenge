interface Bot {
  id: string;
  status: "available" | "busy" | "reserved";
  location: BotLocation;
  zone_id: string;
}
interface BotLocation {
  lat: number;
  lon: number;
}
