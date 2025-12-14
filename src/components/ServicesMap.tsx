import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface Service {
  id: string;
  name: string;
  type: string;
  location: string;
  rating: number;
  coordinates: [number, number]; // [longitude, latitude]
}

interface ServicesMapProps {
  services: Service[];
  onServiceSelect?: (serviceId: string) => void;
}

const ServicesMap = ({ services, onServiceSelect }: ServicesMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [isTokenSet, setIsTokenSet] = useState(false);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [-47.9292, -15.7801], // Centro do Brasil (Brasília)
        zoom: 4,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add markers for each service
      services.forEach((service) => {
        if (!map.current) return;

        const el = document.createElement("div");
        el.className = "custom-marker";
        el.style.cssText = `
          width: 30px;
          height: 30px;
          background-color: hsl(var(--primary));
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        el.innerHTML = `<span style="color: white; font-size: 16px;">📍</span>`;

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 8px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${service.name}</h3>
            <p style="margin: 0; color: #666; font-size: 14px;">${service.type}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px;">⭐ ${service.rating}</p>
          </div>
        `);

        const marker = new mapboxgl.Marker(el)
          .setLngLat(service.coordinates)
          .setPopup(popup)
          .addTo(map.current);

        el.addEventListener("click", () => {
          if (onServiceSelect) {
            onServiceSelect(service.id);
          }
        });
      });

      // Fit map to show all markers
      if (services.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        services.forEach((service) => {
          bounds.extend(service.coordinates);
        });
        map.current.fitBounds(bounds, { padding: 50 });
      }
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  useEffect(() => {
    if (isTokenSet) {
      initializeMap();
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [isTokenSet, services]);

  const handleSetToken = () => {
    if (mapboxToken.trim()) {
      setIsTokenSet(true);
    }
  };

  if (!isTokenSet) {
    return (
      <div className="p-8 bg-muted/30 rounded-lg border-2 border-dashed border-border text-center">
        <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Configure o Mapa</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          Para visualizar os serviços no mapa, insira sua chave pública do Mapbox.
          <br />
          Obtenha uma em{" "}
          <a
            href="https://mapbox.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            mapbox.com
          </a>
        </p>
        <div className="max-w-md mx-auto space-y-3">
          <div>
            <Label htmlFor="mapbox-token">Token Público do Mapbox</Label>
            <Input
              id="mapbox-token"
              type="text"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              placeholder="pk.eyJ1..."
              className="mt-2"
            />
          </div>
          <Button onClick={handleSetToken} disabled={!mapboxToken.trim()}>
            Ativar Mapa
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg border">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default ServicesMap;
