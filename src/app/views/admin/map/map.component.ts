import {Component, OnInit} from '@angular/core';
import {getStyle, hexToRgba} from '@coreui/coreui/dist/js/coreui-utilities';
import {CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import L from 'leaflet';
import {Route} from '../../../../shared/routes/Route';
import {User} from '../../../../shared/users/User';
import {Vehicle} from '../../../../shared/vehicles/Vehicle';
import {UserService} from '../../../services/user.service';
import {VehicleService} from '../../../services/vehicle.service';
import {Observable} from 'rxjs';
import {Point} from '../../../../shared/reports/Point';
import {ReportParameters} from '../../../../shared/reports/ReportParameters';
import {ReportService} from '../../../services/report.service';
import {PointInfo} from '../../../../shared/reports/PointInfo';
import {Coordinate} from '../../../../shared/reports/Coordinate';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  templateUrl: 'map.component.html',
  styleUrls: ['./map.component.scss']
})
export class AdminMapComponent implements OnInit {

  newRoute: Route = Route.empty();
  currentRoute;
  map: any;

  showFormErrorMsg: boolean;

  fromDate: string;
  fromTime: string;

  toDate: string;
  toTime: string;

  currentReport: Point[];
  currentReportLayer: any;
  currentLayerControl: any;
  markerLayers: any = null;

  checking: Check = Check.BASIC;

  users: User[];
  userVehiclesMap: Map<string, Vehicle[]> = new Map<string, Vehicle[]>();

  selectedUserId = '';
  selectedVehicleId = '';

  lightIcon = L.icon({
    iconUrl: '/../../../../assets/img/markers/light.png',

    iconSize: [18, 18], // size of the icon
    iconAnchor: [9, 9], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
  });

  // temperature
  public maxTemperature: Array<number> = [];
  public currentTemperature: Array<number> = [];
  public minTemperature: Array<number> = [];

  // humidity
  public maxHumidity: Array<number> = [];
  public currentHumidity: Array<number> = [];
  public minHumidity: Array<number> = [];

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
      data: this.maxHumidity,
      label: 'Humedad Máxima'
    },
    {
      data: this.currentHumidity,
      label: 'Humedad'
    },
    {
      data: this.minHumidity,
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
        display: true,
        gridLines: {
          drawOnChartArea: true,
        },
        offset: true,
        ticks: {
          autoSkipPadding: 24,
          maxRotation: 0
        }
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
        display: true,
        gridLines: {
          drawOnChartArea: true,
        },
        offset: true,
        ticks: {
          autoSkipPadding: 24,
          maxRotation: 0
        }
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
      borderDash: [8, 5]
    },
    { // moisture
      backgroundColor: hexToRgba(getStyle('--success'), 10),
      borderColor: getStyle('--success'),
      pointHoverBackgroundColor: '#fff',
      borderDash: [8, 5]
    },
    { // min-moisture
      backgroundColor: 'transparent',
      borderColor: getStyle('--info'),
      pointHoverBackgroundColor: '#fff',
      borderDash: [8, 5]
    },
  ];
  public mainChartLegend = false;
  public mainChartType = 'line';

  mapForm: FormGroup;

  constructor(private userService: UserService,
              private vehicleService: VehicleService,
              private reportService: ReportService,
              private formBuilder: FormBuilder) {
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

    this.mapForm = this.formBuilder.group({
      minTemp: Validators.compose([Validators.min(0), Validators.max(49)])
    });
  }

  isFieldValid(field: string) {
    if (this.mapForm == null) {
      return false;
    }
    return !this.mapForm.get(field).valid && this.mapForm.get(field).touched;
  }

  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field),
      'has-feedback': this.isFieldValid(field)
    };
  }

  parseDate(date: string, time: string): string {
    const [hours, minutes] = time ? time.split(':').map(e => {
      const value = parseInt(e, 10);
      return (value === undefined || value === null) ? 0 : value;
    }) : [0, 0];
    const result = new Date(date);
    result.setDate(result.getDate() + 1);
    result.setHours(hours);
    result.setMinutes(minutes);
    return result.toISOString();
  }

  updateChartData(points: Point[], route: Route): void {
    for (let i = 0; i < points.length; i++) {
      if (i === 0) {
        console.log(points[i].info.dateTime);
      }
      const pointInfo = points[i].info;
      this.mainChartLabels.push(pointInfo.dateTime.toUTCString());
      // temperature
      this.maxTemperature.push(route.maxTemperature);
      this.currentTemperature.push(pointInfo.temperature);
      this.minTemperature.push(route.minTemperature);
      // humidity
      this.maxHumidity.push(route.maxHumidity);
      this.currentHumidity.push(pointInfo.humidity);
      this.minHumidity.push(route.minHumidity);
    }
  }

  updateCharts() {
    this.resetCharts();
    this.updateChartData(this.currentReport, this.currentRoute);
  }

  resetCharts() {
    this.mainChartLabels = [];
    this.maxTemperature = [];
    this.currentTemperature = [];
    this.minTemperature = [];
    this.maxHumidity = [];
    this.currentHumidity = [];
    this.minHumidity = [];

    this.temperatureChartData = [
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
    this.moistureChartData = [
      {
        data: this.maxHumidity,
        label: 'Humedad Máxima'
      },
      {
        data: this.currentHumidity,
        label: 'Humedad'
      },
      {
        data: this.minHumidity,
        label: 'Humedad Mínima'
      },

    ];
  }

  // Form
  getSelectedUserVehicles(): Vehicle[] {
    return this.userVehiclesMap.get(this.selectedUserId) || [];
  }

  resetForm() {
    this.newRoute = Route.empty();
    this.selectedUserId = '';
    this.selectedVehicleId = '';
    this.fromTime = '';
    this.fromDate = '';
    this.toDate = '';
    this.toTime = '';
  }

  formIsValid() {
    const validVehicle = this.selectedVehicleId !== '';
    const validTemperatures = this.newRoute.minTemperature < this.newRoute.maxTemperature;
    const validHumidity = this.newRoute.minHumidity < this.newRoute.maxHumidity;
    return validVehicle && validTemperatures && validHumidity;
  }

  getReport() {
    if (!this.formIsValid()) {
      this.showFormErrorMsg = true;
      setTimeout(() => this.showFormErrorMsg = false, 1000);
    } else {
      const parameters = new ReportParameters(
          this.selectedVehicleId,
          this.parseDate(this.fromDate, this.fromTime),
          this.parseDate(this.toDate, this.toTime)
      );
      this.reportService.getReport(parameters).subscribe(
          report => {
            this.currentReport = report;
            this.drawRoute();
            this.updateCharts();
          },
          e => {
            console.log(e);
          }
      );
    }
  }

  // Map

  drawRoute(): void {
    this.resetMap(this.map); // reset all current markers
    this.addLayers(this.currentReport.map(p => p.info), this.newRoute, this.map);
    this.centerMap(this.currentReport.map(p => p.info.coordinates), this.map);
    this.currentRoute = Route.clone(this.newRoute);
  }

  addLayers(pointInfos: PointInfo[], route: Route, map: any): void {
    const temperatureMarkers = [];
    const humidityMarkers = [];
    const lightMarkers = [];
    const markers = [];
    pointInfos.forEach(i => {
        markers.push(this.makeMarker(i.coordinates));
        if (route.vampire) {
          if (i.lighted) {
            lightMarkers.push(this.makeMarkerLight(i.coordinates));
          } else {
            lightMarkers.push(this.makeMarker(i.coordinates));
          }
        }
        if (route.checksTemperature()) {
          temperatureMarkers.push(this.makeMarkerWithRange(
            i.coordinates,
            i.temperature,
            route.minTemperature,
            route.maxTemperature,
            'Temperatura',
            'ºC'
            )
          );
        }
        if (route.checksHumidity()) {
          humidityMarkers.push(this.makeMarkerWithRange(
            i.coordinates,
            i.humidity,
            route.minHumidity,
            route.maxHumidity,
            'Humedad',
            '%'
            )
          );
        }
      }
    );
    const baseLayers = {};
    let extraLayers = false;
    if (route.checksTemperature()) {
      baseLayers['Temperatura'] = L.layerGroup(temperatureMarkers).on('add', () => this.changeCheck(Check.TEMP));
      extraLayers = true;
    }
    if (route.checksHumidity()) {
      baseLayers['Humedad'] = L.layerGroup(humidityMarkers).on('add', () => this.changeCheck(Check.HUMIDITY));
      extraLayers = true;
    }
    if (route.vampire) {
      baseLayers['Luz'] = L.layerGroup(lightMarkers).on('add', () => this.changeCheck(Check.LIGHT));
      extraLayers = true;
    }
    this.currentReportLayer = L.layerGroup(markers).addTo(map);
    if (extraLayers) {
      baseLayers['Basico'] = this.currentReportLayer.on('add', () => this.changeCheck(Check.BASIC));
      this.markerLayers = baseLayers;
      this.currentLayerControl = L.control.layers(baseLayers).addTo(map);
    }
  }

  makeMarkerLight(c: Coordinate): any {
    const coordinates = L.latLng(c.lat, c.lon);
    const circleColor = '#e6d827';
    return L.circle(coordinates, {
      color: circleColor,
      fillColor: circleColor,
      fillOpacity: 1,
      radius: 1
    }).bindPopup('Luz detectada, se abrió el contenedor');
  }

  makeMarkerWithRange(c: Coordinate, value: number, min: number, max: number, name: string, unit: string): any {
    const coordinates = L.latLng(c.lat, c.lon);
    let circleColor: string;
    if (value === undefined || value === null) {
      circleColor = '#696969';
      return L.circle(coordinates, {
        color: circleColor,
        fillColor: circleColor,
        fillOpacity: 1,
        radius: 1
      }).bindPopup('Sin datos');
    } else {
      if (!this.isUndefined(max) && value >= max) {
        circleColor = 'red';
      } else if (!this.isUndefined(min) && value <= min) {
        circleColor = 'blue';
      } else {
        circleColor = 'green';
      }

      return L.circle(coordinates, {
        color: circleColor,
        fillColor: circleColor,
        fillOpacity: 1,
        radius: 1
      }).bindPopup(`${name} medida: ${value} ${unit}`);
    }
  }

  makeMarker(c: Coordinate): any {
    const coordinates = L.latLng(c.lat, c.lon);
    const circleColor = 'black';
    return L.circle(coordinates, {
      color: circleColor,
      fillColor: circleColor,
      fillOpacity: 1,
      radius: 1
    });
  }

  centerMap(coordinates: Coordinate[], map: any): void {
    const bounds = L.latLngBounds(coordinates.map(c => L.latLng(c.lat, c.lon)));
    this.map.fitBounds(bounds);
  }

  resetMap(map: any): void {
    if (this.currentLayerControl) {
      this.currentLayerControl.remove(map);
    }
    if (this.currentReportLayer) {
      this.currentReportLayer.remove(map);
    }
    if (this.markerLayers) {
      for (const layerName of Object.keys(this.markerLayers)) {
        this.markerLayers[layerName].remove(map);
      }
      this.markerLayers = null;
    }
  }

  changeCheck(check: Check) {
    this.checking = check;
  }

  checkingTemp(): boolean {
    return this.checking === Check.TEMP;
  }

  checkingHumidity(): boolean {
    return this.checking === Check.HUMIDITY;
  }

  checkingLight(): boolean {
    return this.checking === Check.LIGHT;
  }

  isChecking(): boolean {
    return this.checking !== Check.BASIC;
  }

  private isUndefined(val): boolean {
    return val === undefined || val === null;
  }
}

enum Check {
  TEMP, HUMIDITY, LIGHT, BASIC
}
