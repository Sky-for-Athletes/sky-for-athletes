export interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
  };
}

export function nominatimCity(item: NominatimResult): string {
  const addr = item.address || {};
  return addr.city || addr.town || addr.village || addr.municipality || addr.county || addr.state || "";
}
