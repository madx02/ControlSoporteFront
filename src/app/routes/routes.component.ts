import { Component, OnInit } from "@angular/core";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"

@Component({
  selector: "app-routes",
  templateUrl: "./routes.component.html",
  styleUrls: ["./routes.component.scss"],
})
export class RoutesComponent implements OnInit {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 23.87668;
  lng = 71.3576;
  geocoder: any;
  address: string;
  long: any;
  latitude: any;
  constructor() {}

  ngOnInit(): void {
    // mapboxgl.accessToken = 'pk.eyJ1IjoiaGhlcm5hbmRlejQ3MyIsImEiOiJjbG15YWU5YTAxOGIxMmxxZmM3ZWY4bzE1In0.W69Y1i0j93M3gmQ8ccwygQ';
    // this.map = new mapboxgl.Map({
    //   container: 'map',
    //   style: 'mapbox://styles/mapbox/streets-v11',
    //   center: [-74.5, 40],
    //   zoom: 9
    // });

    mapboxgl.accessToken =
      "pk.eyJ1IjoiaGhlcm5hbmRlejQ3MyIsImEiOiJjbG15Nmo3YmcxODhyMmtvY3FhMmpmNmx5In0.JtSoOAv5e2lS2mLYg-qGNw";
    this.map = new mapboxgl.Map({
      container: "map", // container ID
      style: "mapbox://styles/mapbox/streets-v12", // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });
    this.map.addControl(new mapboxgl.NavigationControl());
    this.geocoding();

  }

  geocoding() {
    this.geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      // countries: 'us',
      // filter: function (item) {
      //   return item.context
      //   .map(function (i) {
      //   return (
      //   i.id.split('.').shift() === 'region' &&
      //   i.text === 'California'
      //   );
      //   })
      //   .reduce(function (acc, cur) {
      //   return acc || cur;
      //   });
      //   },
      mapboxgl: mapboxgl
      });
      document.getElementById('demo')!.appendChild(this.geocoder.onAdd(this.map));
      this.getAddress();
  }

  getAddress(){
    this.geocoder.on('result', (e) => {
      console.log(e.result);

      this.address = e.result.place_name;
      this.long = e.result.geometry.coordinates[0];
      this.latitude = e.result.geometry.coordinates[1];
    })
  }




}
