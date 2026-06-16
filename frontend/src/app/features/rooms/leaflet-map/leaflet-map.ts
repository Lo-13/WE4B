import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from "@angular/core";
import * as L from "leaflet";
import { GamingRoom } from "../../../core/services/rooms.service";

@Component({
  selector: "app-leaflet-map",
  imports: [],
  templateUrl: "./leaflet-map.html",
  styleUrl: "./leaflet-map.css",
})
export class LeafletMap implements AfterViewInit, OnChanges, OnDestroy {
  @Input() rooms: GamingRoom[] | null = [];

  private map!: L.Map;
  private markers: L.Marker[] = [];

  ngAfterViewInit(): void {
    this.initMap();
    this.updateMarkers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["rooms"] && this.map) {
      this.updateMarkers();
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private fixLeafletIcons(): void {
    const iconDefault = L.icon({
      iconUrl: 'assets/marker-icon.png',
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  private initMap(): void {
    this.fixLeafletIcons();
    const mapOptions: L.MapOptions = {
      center: [46.627, 2.911],
      zoom: 7,
      minZoom: 2,
      maxZoom: 18,
    };

    this.map = L.map("map", mapOptions);

    const layer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    });
    this.map.addLayer(layer);
  }

  private addMarkers(): void {
    this.rooms?.forEach((room) => {
      const marker = L.marker([room.latitude, room.longitude]).addTo(this.map);
      marker.bindPopup(`<b>${room.name}</b><br>${room.address}`);
      this.markers.push(marker);
    });
  }

  private updateMarkers(): void {
    this.markers.forEach((marker) => this.map.removeLayer(marker));
    this.markers = [];

    this.addMarkers();
  }
}
