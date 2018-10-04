import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Device} from '../../shared/devices/Device';
import {HttpService} from './http.service';
import {DeviceCredentials} from '../../shared/devices/DeviceCredentials';
import {DeviceUpdate} from '../../shared/devices/DeviceUpdate';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpService) { }

  fetchDevices(): Observable<Device[]> {
    return this.http.get('/device')
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

  addDevice(deviceCredentials: DeviceCredentials): Observable<boolean> {
    const json = deviceCredentials.asJson();
    return this.http.post('/device', json)
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

  updateDevice(deviceId: string, deviceUpdate: DeviceUpdate) {
    const json = deviceUpdate.asJson();
    return this.http.put('/device/' + deviceId, json)
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
