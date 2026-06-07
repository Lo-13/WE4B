import { Component,  Input, AfterViewInit, SimpleChanges} from '@angular/core';
import * as L from 'leaflet';
//we import rooms to get the type of the rooms input
import { GamingRoom } from '../../../core/services/rooms.service';


@Component({
  selector: 'app-leaflet-map',
  imports: [],
  templateUrl: './leaflet-map.html',
  styleUrl: './leaflet-map.css',
})
export class LeafletMap implements AfterViewInit {
  //we expect an array of rooms, otherwise the rooms is null and we will not display any marker
  @Input() rooms: GamingRoom[] | null = [];
  private map!: L.Map
  private markers: L.Marker[] = [];

  //we initialize the map after the view is initialized, and we add the markers if the rooms input is not null
  ngAfterViewInit() {
    this.initMap();
  }

  //we update the markers when the rooms input changes, we first remove all the existing markers and then we add the new markers
  ngOnChanges(changes: SimpleChanges) {
    if (changes['rooms'] && this.map) {
      this.updateMarkers();
    }
  }

  private initMap() {
    const mapOptions: L.MapOptions = {
      //we set the center of the map to the center of France, and we set the zoom level to 7, we also set the minZoom and maxZoom to prevent the user from zooming too much or too little
      center: [46.627, 2.911], 
      zoom: 7,
      minZoom: 2,
      maxZoom: 18,
    }

    this.map = L.map('map', mapOptions);

    //we add the OpenStreetMap tile layer to the map, we use the standard OSM tile server, but in a production application we should use a custom tile server or a third-party service to avoid overloading the OSM servers
    const layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    this.map.addLayer(layer);
  }

  private addMarkers() {
    //we verify that the rooms input is not null, if it is not null we add a marker for each room,
    //  we use the latitude and longitude of the room to position the marker, and we bind a popup 
    // to the marker that displays the name and address of the room
    if (this.rooms != null) {
      this.rooms.forEach(room => {
      const marker = L.marker([room.latitude, room.longitude]).addTo(this.map);
      //we bind a popup to the marker that displays the name and address of the room
      marker.bindPopup(`<b>${room.name}</b><br>${room.address}`);
      this.markers.push(marker);
      });
    }
  }

  private updateMarkers() {
    // Clear existing markers
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    // Add new markers
    this.addMarkers();
  }

  //we remove the map and all the markers when the component is destroyed to prevent memory leaks
  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}