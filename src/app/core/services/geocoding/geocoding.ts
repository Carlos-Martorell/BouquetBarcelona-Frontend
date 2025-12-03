import { Injectable } from '@angular/core';
import { environment } from '@env/environments';

export interface AddressSuggestion {
  id: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
}

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  private readonly token = environment.mapboxKey;

  async searchAddresses(query: string): Promise<AddressSuggestion[]> {
    if (query.length < 3) {
      return [];
    }

    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${this.token}&limit=5&language=es&country=ES`;

      const response = await fetch(url);
      const data = await response.json();

      return data.features || [];
    } catch (error) {
      console.error('Error en geocoding:', error);
      return [];
    }
  }
}
