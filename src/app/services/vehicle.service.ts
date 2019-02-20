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

  /**
   * Method that returns a list of all the vehicles.
   *
   * @returns {Observable<Vehicle[]>}
   */
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

  /**
   * Method that adds a new vehicle to the platform based on the given vehicle credentials.
   * Returns true if vehicle is correctly added.
   *
   * @param {VehicleCredentials} vehicleCredentials
   * @returns {Observable<boolean>}
   */
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

  /**
   * Method that returns a specific vehicle based on the given vehicle id.
   *
   * @param {string} vehicleId
   * @returns {Observable<Vehicle>}
   */
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

  /**
   * Method that updates a specific vehicle based on the given vehicle id and vehicle update data.
   *
   * @param {string} vehicleId
   * @param {VehicleUpdate} vehicleUpdate
   * @returns {Observable<boolean>}
   */
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

  /**
   * Method that deletes a specific vehicle based on the given vehicle id.
   * Returns true if vehicle is correctly deleted.
   *
   * @param {string} vehicleId
   * @returns {Observable<boolean>}
   */
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

  /**
   * Method that returns device assignations.
   *
   * @returns {Observable<Assignation>}
   */
  fetchDeviceAssignations(): Observable<Assignation> {
    return this.http.get('/assign')
      .pipe(
        map((response) => {
          return Object.assign(Assignation.empty(), response.body);
        }),
        catchError(err => {
          console.log(err);
          return Observable.of(null);
        })
      );
  }

  /**
   * Method that adds a new device and assigns it to a determined vehicle based on the given vehicle id and device id.
   * Returns true if device is correctly added.
   *
   * @param {string} vehicleId
   * @param {string} deviceId
   * @returns {Observable<boolean>}
   */
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

  /**
   * Method that removes a specific device based on the given vehicle id.
   * Returns true if device is correctly removed.
   *
   * @param {string} vehicleId
   * @returns {Observable<boolean>}
   */
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

  /**
   * Method that returns a list of all vehicles assigned to a determined user based on the given user id.
   *
   * @param {string} userId
   * @returns {Observable<Vehicle[]>}
   */
  getUserVehicles(userId: string): Observable<Vehicle[]> {
    return this.http.get('/vehicle/owner/' + userId)
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

}

