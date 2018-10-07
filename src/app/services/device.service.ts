import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Device} from '../../shared/devices/Device';
import {HttpService} from './http.service';
import {DeviceCredentials} from '../../shared/devices/DeviceCredentials';
import {DeviceUpdate} from '../../shared/devices/DeviceUpdate';
import {Product} from '../../shared/products/Product';
import {Route} from '../../shared/routes/Route';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpService) { }

  fetchDevices(): Observable<Device[]> {
    return this.http.get('/device')
      .pipe(
        map((response) => {
          return response.body.map(a => Object.assign(Device.empty(), a));
        }),
        catchError(err => {
          console.log(err);
          return Observable.of([]);
        })
      );
  }

  addDevice(deviceCredentials: DeviceCredentials): Observable<boolean> {
    const json = deviceCredentials.asJson();
    return this.http.post('/device', json)
      .pipe(
        map(() => true),
        catchError(err => {
          console.log(err);
          return Observable.of(false);
        })
      );
  }

  getDevice(deviceId: string): Observable<Device> {
    return this.http.get('/device/' + deviceId)
      .pipe(
        map((response) => {
          return Object.assign(Device.empty(), response.body);
        }),
        catchError(err => {
          console.log(err);
          return Observable.of(null);
        })
      );
  }

  updateDevice(deviceId: string, deviceUpdate: DeviceUpdate) {
    const json = deviceUpdate.asJson();
    return this.http.put('/device/' + deviceId, json)
      .pipe(
        map(() => true),
        catchError(err => {
          console.log(err);
          return Observable.of(false);
        })
      );
  }

  deleteDevice(deviceId: string): Observable<boolean> {
    return this.http.delete('/device/' + deviceId)
      .pipe(
        map(() => true),
        catchError(err => {
          console.log(err);
          return Observable.of(false);
        })
    );
  }

  // TODO: device must be unassigned
  removeDevice(deviceId: string): Observable<boolean> {
    return this.http.delete('/device/' + deviceId)
      .pipe(
        map(() => true),
        catchError(err => {
          console.log(err);
          return Observable.of(false);
        })
      );
  }
}
