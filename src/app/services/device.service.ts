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

    constructor(private http: HttpService) {
    }

    /**
     * Method that returns a list of all the devices.
     *
     * @returns {Observable<Device[]>}
     */
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

    /**
     * Method that adds a new device to the platform based on the given device credentials.
     * Returns true if device is correctly added.
     *
     * @param {DeviceCredentials} deviceCredentials
     * @returns {Observable<boolean>}
     */
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

    /**
     * Method that returns a specific device based on the given device id.
     *
     * @param {string} deviceId
     * @returns {Observable<Device>}
     */
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

    /**
     * Method that updates a specific device based on the given device id and device update data.
     *
     * @param {string} deviceId
     * @param {DeviceUpdate} deviceUpdate
     * @returns {Observable<any>}
     */
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

    /**
     * Method that deletes a specific device based on the given device id.
     * Returns true if device is correctly deleted.
     *
     * @param {string} deviceId
     * @returns {Observable<boolean>}
     */
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

    /**
     * Method that deletes a specific device based on the given device id.
     * Returns true if device is correctly deleted.
     *
     * @param {string} deviceId
     * @returns {Observable<boolean>}
     */
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
