import {Component, OnInit} from '@angular/core';
import {getStyle, hexToRgba} from '@coreui/coreui/dist/js/coreui-utilities';
import {CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import L from 'leaflet';
import {Route} from '../../../../shared/routes/Route';
import {User} from '../../../../shared/users/User';
import {Vehicle} from '../../../../shared/vehicles/Vehicle';
import {UserService} from '../../../services/user.service';
import {VehicleService} from '../../../services/vehicle.service';
import * as Rx from 'rxjs/internal/operators';
import {forkJoin, Observable} from 'rxjs';
import {Point} from '../../../../shared/reports/Point';
import {Time} from '@angular/common';
import {ReportParameters} from '../../../../shared/reports/ReportParameters';
import {ReportService} from '../../../services/report.service';
import {PointInfo} from '../../../../shared/reports/PointInfo';
import {Coordinate} from '../../../../shared/reports/Coordinate';
import {Point} from '../../../../shared/reports/Point';

@Component({
    templateUrl: 'map.component.html',
    styleUrls: ['./map.component.scss']
})
export class AdminMapComponent implements OnInit {

    newRoute: Route = Route.empty();
    routeSearched = false;
    map: any;

    fromDate: string;
    fromTime: string;

    toDate: string;
    toTime: string;

  currentReport: Point[];
  currentReportLayer: any;

    users: User[];
    userVehiclesMap: Map<string, Vehicle[]> = new Map<string, Vehicle[]>();

    selectedUserId = '';
    selectedVehicleId = '';

    lightIcon = L.icon({
        iconUrl: '/../../../../assets/img/markers/light.png',

        iconSize: [36, 36], // size of the icon
        iconAnchor: [18, 18], // point of the icon which will correspond to marker's location
        popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    // main chart

  public mainChartElements = 27; // TODO Report size

    // temperature
    public maxTemperature: Array<number> = [];
    public currentTemperature: Array<number> = [];
    public minTemperature: Array<number> = [];

    // moisture
    public maxMoisture: Array<number> = [];
    public currentMoisture: Array<number> = [];
    public minMoisture: Array<number> = [];

    public mainChartLabels: Array<string> = [];
    public temperatureChartData: Array<any> = [
        {
            data: this.maxTemperature,
            label: 'Temperatura Máxima'
        },
        {
            data: this.currentTemperature,
            label: 'Temperatura'
        },
        {
            data: this.minTemperature,
            label: 'Temperatura Mínima'
        },

    ];
    public moistureChartData: Array<any> = [
        {
            data: this.maxMoisture,
            label: 'Humedad Máxima'
        },
        {
            data: this.currentMoisture,
            label: 'Humedad'
        },
        {
            data: this.minMoisture,
            label: 'Humedad Mínima'
        },

    ];
    public temperatureChartOptions: any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips,
            intersect: true,
            mode: 'index',
            position: 'nearest',
            callbacks: {
                labelColor: function (tooltipItem, chart) {
                    return {backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor};
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                gridLines: {
                    drawOnChartArea: false,
                },
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 5,
                    stepSize: Math.ceil(100 / 10),
                    max: 50
                }
            }]
        },
        elements: {
            line: {
                borderWidth: 2
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
                hoverBorderWidth: 3,
            }
        },
        legend: {
            display: false
        }
    };
    public moistureChartOptions: any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips,
            intersect: true,
            mode: 'index',
            position: 'nearest',
            callbacks: {
                labelColor: function (tooltipItem, chart) {
                    return {backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor};
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                gridLines: {
                    drawOnChartArea: false,
                },
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 5,
                    stepSize: Math.ceil(100 / 10),
                    max: 100
                }
            }]
        },
        elements: {
            line: {
                borderWidth: 2
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
                hoverBorderWidth: 3,
            }
        },
        legend: {
            display: false
        }
    };
    public temperatureChartColors: Array<any> = [
        { // max-temperature
            backgroundColor: 'transparent',
            borderColor: getStyle('--danger'),
            pointHoverBackgroundColor: '#fff',
        },
        { // temperature
            backgroundColor: hexToRgba(getStyle('--success'), 10),
            borderColor: getStyle('--success'),
            pointHoverBackgroundColor: '#fff'
        },
        { // min-temperature
            backgroundColor: 'transparent',
            borderColor: getStyle('--info'),
            pointHoverBackgroundColor: '#fff',
        },
    ];
    public moistureChartColors: Array<any> = [
        { // max-moisture
            backgroundColor: 'transparent',
            borderColor: getStyle('--danger'),
            pointHoverBackgroundColor: '#fff',
            borderWidth: 1,
            borderDash: [8, 5]
        },
        { // moisture
            backgroundColor: hexToRgba(getStyle('--success'), 10),
            borderColor: getStyle('--success'),
            pointHoverBackgroundColor: '#fff',
            borderWidth: 1,
            borderDash: [8, 5]
        },
        { // min-moisture
            backgroundColor: 'transparent',
            borderColor: getStyle('--info'),
            pointHoverBackgroundColor: '#fff',
            borderWidth: 1,
            borderDash: [8, 5]
        },
    ];
    public mainChartLegend = false;
    public mainChartType = 'line';

  public random(min: number, max: number) { // TODO delete
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  constructor(private userService: UserService, private vehicleService: VehicleService, private reportService: ReportService) {
      this.userService.fetchUsers().subscribe(users => {
          this.users = users;
          this.users.map(u => [u, this.vehicleService.getUserVehicles(u.id)]).forEach(tuple => {
              const user = tuple[0] as User;
              const observable = tuple[1] as Observable<Vehicle[]>;
              observable.subscribe(vehicles => {
                  this.userVehiclesMap.set(user.id, vehicles);
              });
          });
      });
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

  parseDate(date: string, time: string): string {
    const [hours, minutes] = time.split(':').map(e => parseInt(e, 10));
    const result = new Date(date);
    result.setDate(result.getDate() + 1);
    result.setHours(hours);
    result.setMinutes(minutes);
    const s = result.toISOString();
    console.log(s);
    return s;
  }

    updateChartData(points: Point[],
                    minTemperature: number,
                    maxTemperature: number,
                    minMoisture: number,
                    maxMoisture: number): void {
        for (let i = 0; i <= points.length; i++) {
            const pointInfo = points[i].asJson();
            this.mainChartLabels.push(pointInfo.time);
            // temperature
            this.maxTemperature.push(maxTemperature);
            this.currentTemperature.push(pointInfo.temperature);
            this.minTemperature.push(minTemperature);
            // moisture
            this.maxMoisture.push(maxMoisture);
            this.currentMoisture.push(pointInfo.humidity);
            this.minMoisture.push(minMoisture);
        }
    }

    parseDate(date: string, time: string): string {
        if (!date == null && !time == null) {
          const [hours, minutes] = time.split(':').map(e => parseInt(e, 10));
          const result = new Date(date);
          result.setHours(hours);
          result.setMinutes(minutes);
          return result.toISOString();
        }
    }

    // Form
    getSelectedUserVehicles(): Vehicle[] {
        return this.userVehiclesMap.get(this.selectedUserId) || [];
    }

    resetForm() {
        this.newRoute = Route.empty();
        this.selectedUserId = '';
        this.selectedVehicleId = '';
    }

  getReport() {
    const parameters = new ReportParameters(
      this.selectedVehicleId,
      this.parseDate(this.fromDate, this.fromTime),
      this.parseDate(this.toDate, this.toTime)
    );
    this.reportService.getReport(parameters).subscribe(
      report => {
        this.currentReport = report;
        this.drawRoute();
        console.log(this.currentReport);
      },
      e => {
        console.log(e);
      }
    );
  }

    // Map

  drawRoute(): void {
    this.resetMap(this.map); // reset all current markers
    this.addRouteLayer(this.currentReport.map(p => p.info), this.newRoute, this.map);
    this.centerMap(this.currentReport.map(p => p.info.coordinates), this.map);
    // TODO Loop addMarkerToMap
    // TODO centerMap
  }

  addRouteLayer(pointInfos: PointInfo[], currentRoute: Route, map: any): void {
    const markers = pointInfos.map(i => this.makeMarker(i, currentRoute));
    this.currentReportLayer = L.layerGroup(markers);
    this.currentReportLayer.addTo(map);
  }

  makeMarker(p: PointInfo, currentRoute: Route): any {
    const coordinates = L.latLng(p.coordinates.lat, p.coordinates.lon);
    const temperature = p.temperature;
    const moisture = p.humidity;
    const lightSensed = p.lighted;
    if (currentRoute.vampire && lightSensed) {
      return L.marker(coordinates, {icon: this.lightIcon}).bindPopup('Luz detectada, se abrió el contenedor');
    } else {
      let circleColor: string;
      if (temperature >= currentRoute.maxTemperature) {
        circleColor = 'red';
      } else if (temperature <= currentRoute.minTemperature) {
        circleColor = 'blue';
      } else {
        circleColor = 'green';
      }
      return L.circle(coordinates, {
        color: circleColor,
        fillColor: circleColor,
        fillOpacity: 1,
        radius: 1
      }).bindPopup('Temperatura medida = ' + 50 + 'ºC.\n' + 'Humedad medida = ' + 95 + '%');
    }
  }

  centerMap(coordinates: Coordinate[], map: any): void {
    const bounds = L.latLngBounds(coordinates.map(c => L.latLng(c.lat, c.lon)));
    this.map.fitBounds(bounds);
  }

  // probably doesn't work
  resetMap(map: any): void {
    if (this.currentReportLayer) {
      map.removeLayer(this.currentReportLayer);
    }
    /*map = L.map('map').setView([-34.61315, -58.37723], 9);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: 3,
      maxZoom: 15
    }).addTo(map);
    L.control.scale().addTo(map);*/
  }

}
