import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import 'rxjs-compat/add/observable/of';
import {HttpService} from './http.service';
import {VehicleCredentials} from '../../shared/vehicles/VehicleCredentials';
import {Vehicle} from '../../shared/vehicles/Vehicle';
import {VehicleUpdate} from '../../shared/vehicles/VehicleUpdate';
import {Assignation} from '../../shared/Assignation';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpService) {
  }

  fetchVehicles(): Observable<Vehicle[]> {
    return this.http.get('/vehicle')
      .pipe(
        map((response) => {
          return response.body.map(a => Object.assign(Vehicle.empty(), a));
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
        map(() => true),
        catchError(err => {
          console.log(err);
          return Observable.of(false);
        })
      );
  }

  getVehicle(vehicleId: string): Observable<Vehicle> {
    return this.http.get('/vehicle/' + vehicleId)
      .pipe(
        map((response) => {
          return Object.assign(Vehicle.empty(), response.body);
        }),
        catchError(err => {
          console.log(err);
          return Observable.of(null);
        })
      );
  }

  updateVehicle(vehicleId: string, vehicleUpdate: VehicleUpdate): Observable<boolean> {
    const json = vehicleUpdate.asJson();
    return this.http.put('/vehicle/' + vehicleId, json)
      .pipe(
        map(() => true),
        catchError(err => {
          console.log(err);
          return Observable.of(false);
        })
      );
  }

  deleteVehicle(vehicleId: string): Observable<boolean> {
    return this.http.delete('/vehicle/' + vehicleId)
      .pipe(
        map(() => true),
        catchError(err => {
          console.log(err);
          return Observable.of(false);
        })
      );
  }

  fetchDeviceAssignations(): Observable<Assignation> {
    return this.http.get('/assign')
      .pipe(
        map( (response) => {
          return Object.assign(Assignation.empty(), response.body);
        }),
        catchError( err => {
          console.log(err);
          return Observable.of(null);
        })
      );
  }

  addDevice(vehicleId: string, deviceId: string): Observable<boolean> {
    return this.http.post('/assign/vehicle/' + vehicleId, {deviceId: deviceId})
      .pipe(
        map(() => true),
        catchError(err => {
          console.log(err);
          return Observable.of(false);
        })
      );
  }

  removeDevice(vehicleId: string): Observable<boolean> {
    return this.http.delete('/assign/vehicle/' + vehicleId)
      .pipe(
        map(() => true),
        catchError(err => {
          console.log(err);
          return Observable.of(false);
        })
      );
  }

  getUserVehicles(userId: string): Observable<Vehicle[]> {
    return this.http.get('/vehicle/owner/' + userId)
      .pipe(
        map((response) => {
          return response.body.map(a => Object.assign(Vehicle.empty(), a));
        }),
        catchError( err => {
          console.log(err);
          return Observable.of(null);
        })
      );
  }

}

