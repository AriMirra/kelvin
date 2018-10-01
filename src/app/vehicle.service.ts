import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import 'rxjs-compat/add/observable/of';
import {Vehicle} from '../shared/Vehicle';
import {VehicleCredentials} from '../shared/VehicleCredentials';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  url = 'http://localhost:8080';

  private vehicles: Vehicle[];
  constructor(private http: HttpClient,
              private router: Router) {
  }

  fetchVehicles(): Observable<Vehicle[]> {
    return this.http.get(this.url + '/vehicles')
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
    return this.http.post(this.url + '/vehicles', json)
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
