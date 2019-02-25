import {Component, OnInit} from '@angular/core';
import {getStyle, hexToRgba} from '@coreui/coreui/dist/js/coreui-utilities';
import {CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import L from 'leaflet';
import {Route} from '../../../../shared/routes/Route';
import {User} from '../../../../shared/users/User';
import {Vehicle} from '../../../../shared/vehicles/Vehicle';
import {UserService} from '../../../services/user.service';
import {VehicleService} from '../../../services/vehicle.service';
import {Point} from '../../../../shared/reports/Point';
import {ReportParameters} from '../../../../shared/reports/ReportParameters';
import {ReportService} from '../../../services/report.service';
import {PointInfo} from '../../../../shared/reports/PointInfo';
import {Coordinate} from '../../../../shared/reports/Coordinate';
import {Product} from '../../../../shared/products/Product';
import {ProductService} from '../../../services/product.service';
import {RouteService} from '../../../services/route.service';
import {RouteCredentials} from '../../../../shared/routes/RouteCredentials';

@Component({
  templateUrl: 'map.component.html',
  styleUrls: ['./map.component.scss']
})
export class ClientMapComponent implements OnInit {

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

  routeProducts: Product[];
  allProducts: Product[];

  user: User;
  vehicles: Vehicle[] = [];
  routes: Route[] = [];

  newRoute: Route = Route.empty();
  currentRoute;

  selectedUserId = '';
  selectedVehicleId = '';
  selectedRouteId = '';
  selectedProductId = '';

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

  constructor(private userService: UserService,
              private vehicleService: VehicleService,
              private productService: ProductService,
              private routeService: RouteService,
              private reportService: ReportService) {
    this.userService.getLoggedUser().subscribe(user => {
      this.vehicleService.getUserVehicles(user.id).subscribe(vehicles => {
        this.vehicles = vehicles;
      });
      this.productService.fetchClientProducts(user.id).subscribe(products => {
        this.allProducts = products;
      });
      this.routeService.getUserRoutes().subscribe(routes => {
        this.routes = routes;
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
    return this.vehicles;
  }

  getSelectedUserProducts(): Product[] {
    return this.allProducts;
  }

  getSelectedUserRoutes() {
    return this.routes;
  }

  saveFormAsRoute() {
    const from = this.convertToIsoString(this.fromDate, this.fromTime);
    const to = this.convertToIsoString(this.toDate, this.toTime);

    const r = new RouteCredentials(
      this.newRoute.name,
      this.selectedProductId,
      this.selectedVehicleId,
      from,
      to,
      this.newRoute.minTemperature,
      this.newRoute.maxTemperature,
      this.newRoute.minHumidity,
      this.newRoute.maxHumidity,
      this.newRoute.vampire
    );
    this.routeService.addRoute(r).subscribe(
      () => console.log('route added'),
      () => console.log('error adding route')
    );
  }

  resetForm() {
    this.newRoute = Route.empty();
    this.selectedUserId = '';
    this.selectedVehicleId = '';
    this.selectedProductId = '';
    this.selectedRouteId = '';
    this.fromTime = '';
    this.fromDate = '';
    this.toDate = '';
    this.toTime = '';
  }

  updateRoute() {
    const selectedRoute = this.getUserRouteFromId(this.selectedRouteId);
    this.setTimeFromRoute(selectedRoute);
    this.selectedVehicleId = selectedRoute.vehicleId;
    const selectedProduct = this.getUserProductFromId(selectedRoute.productId);
    this.selectedProductId = selectedProduct.id;
    this.routeProducts = [selectedProduct];
    this.newRoute.minTemperature = this.productsMinTemperature();
    this.newRoute.maxTemperature = this.productsMaxTemperature();
    this.newRoute.minHumidity = this.productsMinHumidity();
    this.newRoute.maxHumidity = this.productsMaxHumidity();
    this.productsContainsVampire();
  }

  updateProduct() {
    const selectedProduct = this.getUserProductFromId(this.selectedProductId);
    this.routeProducts = [selectedProduct];
    this.newRoute.minTemperature = this.productsMinTemperature();
    this.newRoute.maxTemperature = this.productsMaxTemperature();
    this.newRoute.minHumidity = this.productsMinHumidity();
    this.newRoute.maxHumidity = this.productsMaxHumidity();
    this.productsContainsVampire();
  }

  private productsContainsVampire() {
    this.newRoute.vampire = !this.routeProducts.every(product => !product.vampire);
  }

  private productsMinTemperature() {
    let productsMinTemperature = 0;
    this.routeProducts.forEach(product => {
      if (product.minTemperature > productsMinTemperature) {
        productsMinTemperature = product.minTemperature;
      }
    });
    return productsMinTemperature;
  }

  private productsMaxTemperature() {
    let productsMaxTemperature = 50;
    this.routeProducts.forEach(product => {
      if (product.maxTemperature < productsMaxTemperature) {
        productsMaxTemperature = product.maxTemperature;
      }
    });
    return productsMaxTemperature;
  }

  private productsMinHumidity() {
    let productsMinHumidity = 0;
    this.routeProducts.forEach(product => {
      if (product.minHumidity > productsMinHumidity) {
        productsMinHumidity = product.minHumidity;
      }
    });
    return productsMinHumidity;
  }

  private productsMaxHumidity() {
    let productsMaxHumidity = 100;
    this.routeProducts.forEach(product => {
      if (product.maxHumidity < productsMaxHumidity) {
        productsMaxHumidity = product.maxHumidity;
      }
    });
    return productsMaxHumidity;
  }

  formIsValid() {
    const validVehicle = this.selectedVehicleId !== '';
    const validRoute = this.selectedRouteId !== '';
    const validProduct = this.selectedProductId !== '';
    const validTemperatures = this.newRoute.minTemperature < this.newRoute.maxTemperature;
    const validHumidity = this.newRoute.minHumidity < this.newRoute.maxHumidity;
    return validVehicle && validProduct && validRoute && validTemperatures && validHumidity;
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

  private getUserProductFromId(productId: string): Product {
    let selectedProduct = Product.empty();
    this.allProducts.forEach(p => {
      if (p.id === productId) { selectedProduct = p; }
    });
    return selectedProduct;
  }

  private getUserRouteFromId(routeId: string): Route {
    let selectedRoute = Route.empty();
    this.routes.forEach(r => {
      if (r.id === routeId) { selectedRoute = r; }
    });
    return selectedRoute;
  }

  private setTimeFromRoute(route: Route) {
    const fromDate = route.fromDate;
    const fromMonth = fromDate.getMonth() + 1;
    const fromDay = fromDate.getDate();
    const toDate = route.toDate;
    const toMonth = toDate.getMonth() + 1;
    const toDay = toDate.getDate();
    this.fromDate = `${fromDate.getFullYear()}-${this.normalizeNumberString(fromMonth)}-${this.normalizeNumberString(fromDay)}`;
    this.fromTime = `${this.normalizeNumberString(fromDate.getHours())}:${this.normalizeNumberString(fromDate.getMinutes())}`;
    this.toDate = `${toDate.getFullYear()}-${this.normalizeNumberString(toMonth)}-${this.normalizeNumberString(toDay)}`;
    this.toTime = `${this.normalizeNumberString(toDate.getHours())}:${this.normalizeNumberString(toDate.getMinutes())}`;
  }

  private normalizeNumberString(num: number): string {
    return num < 9 ? `0${num}` : num.toString();
  }

  private convertToIsoString(date: string, time: string) {
    return `${date}T${time}:00Z`;
  }
}

enum Check {
  TEMP, HUMIDITY, LIGHT, BASIC
}
