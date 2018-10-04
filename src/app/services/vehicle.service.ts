import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import 'rxjs-compat/add/observable/of';
import {HttpService} from './http.service';
import {VehicleCredentials} from '../../shared/vehicles/VehicleCredentials';
import {Vehicle} from '../../shared/vehicles/Vehicle';
import {VehicleUpdate} from '../../shared/vehicles/VehicleUpdate';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private vehicles: Vehicle[];
  constructor(private http: HttpService,
              private router: Router) {
  }

  fetchVehicles(): Observable<Vehicle[]> {
    return this.http.get('/vehicle')
      .pipe(
        map((response: any) => {
          return response.body;
        }),
        catchError(err => {
          console.log(err);
          return Observable.of([]);
        })
      );
  }

  addVehicle(vehicleCredentials: VehicleCredentials): Observable<boolean> {
    const json = vehicleCredentials.asJson();
    return this.http.post('/vehicle', json)
      .pipe(
        map((response: any) => {
          return true;
        }),
        catchError(err => {
          console.log(err);
          return Observable.of(false);
        })
      );
  }

  updateVehicle(vehicleId: string, vehicleUpdate: VehicleUpdate) {
    const json = vehicleUpdate.asJson();
    return this.http.put('/vehicle/' + vehicleId, json)
      .pipe(
        map((response: any) => {
          return true;
        }),
        catchError(err => {
          console.log(err);
          return Observable.of(false);
        })
      );
  }

  addDevice(vehicleId: string, deviceId: string): Observable<boolean> {
    return this.http.post('/assign/vehicle/' + vehicleId, {deviceId: deviceId})
      .pipe(
        map((response: any) => {
          return true;
        }),
        catchError(err => {
          console.log(err);
          return Observable.of(false);
        })
      );
  }

  removeDevice(vehicleId: string): Observable<boolean> {
    return this.http.delete('/assign/vehicle/' + vehicleId)
      .pipe(
        map((response: any) => {
          return true;
        }),
        catchError(err => {
          console.log(err);
          return Observable.of(false);
        })
      );
  }

}

