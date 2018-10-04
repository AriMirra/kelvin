import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import 'rxjs-compat/add/observable/of';
import {Vehicle} from '../shared/Vehicle';
import {VehicleCredentials} from '../shared/VehicleCredentials';
import {HttpService} from './http.service';
import {VehicleUpdate} from '../shared/VehicleUpdate';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private vehicles: Vehicle[];
  constructor(private http: HttpService,
              private router: Router) {
  }

  fetchVehicles(): Observable<Vehicle[]> {
    return this.http.get('/vehicles')
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
    return this.http.post('/vehicles', json)
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
    return this.http.put('/vehicles/' + vehicleId, json)
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

