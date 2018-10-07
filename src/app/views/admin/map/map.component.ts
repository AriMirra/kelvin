import {Component, OnInit} from '@angular/core';
import {getStyle, hexToRgba} from '@coreui/coreui/dist/js/coreui-utilities';
import L from 'leaflet';
import {Route} from '../../../../shared/routes/Route';

@Component({
    templateUrl: 'map.component.html',
    styleUrls: ['./map.component.scss']
})
export class AdminMapComponent implements OnInit {

    newRoute: Route;
    map: any;

    lightIcon = L.icon({
        iconUrl: '/../../../../assets/img/markers/light.png',

        iconSize: [36, 36], // size of the icon
        iconAnchor: [18, 18], // point of the icon which will correspond to marker's location
        popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    constructor() {
    }

    ngOnInit(): void {
        this.newRoute = Route.empty();
        this.map = L.map('map').setView([-34.61315, -58.37723], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: 4,
            maxZoom: 16
        }).addTo(this.map);
        L.control.scale().addTo(this.map);
    }

    drawRoute(): void {
        this.resetMap(this.map); // reset all current markers
        // TODO Loop addMarkerToMap
        // TODO centerMap
    }

    addMarkerToMap: (coordinates: number[],
                     temperature: number,
                     moisture: number,
                     lightSensed: boolean,
                     currentRoute: Route,
                     map: any) => void =
        function (coordinates: number[],
                  temperature: number,
                  moisture: number,
                  lightSensed: boolean,
                  currentRoute: Route,
                  map: any): void {
            if (currentRoute.vampire && lightSensed) {
                L.marker(coordinates, {icon: this.lightIcon}).bindPopup('Luz detectada, se abrió el contenedor').addTo(map);
            } else {
                let circleColor: string;
                if (temperature >= currentRoute.maxTemperature) {
                    circleColor = 'red';
                } else if (temperature <= currentRoute.minTemperature) {
                    circleColor = 'blue';
                } else {
                    circleColor = 'green';
                }
                L.circle(coordinates, {
                    color: circleColor,
                    fillColor: circleColor,
                    fillOpacity: 1,
                    radius: 1
                }).bindPopup('Temperatura medida = ' + 50 + 'ºC.\n' + 'Humedad medida = ' + 95 + '%').addTo(map);
            }
        };

    centerMap: (coordinatesStart: number[], coordinatesFinish: number[]) => void =
        function (coordinatesStart: number[], coordinatesFinish: number[]): void {
            const corner1 = L.latLng(coordinatesStart[0], coordinatesStart[1]),
                corner2 = L.latLng(coordinatesFinish[0], coordinatesFinish[1]),
                bounds = L.latLngBounds(corner1, corner2);
            L.flyToBounds(bounds);
        };

    // probably doesn't work
    resetMap: (map: any) => void =
        function (map: any): void {
            map = L.map('map').setView([-34.61315, -58.37723], 9);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                minZoom: 3,
                maxZoom: 15
            }).addTo(map);
            L.control.scale().addTo(map);
        };

}
