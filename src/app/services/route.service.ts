import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpService} from './http.service';
import {Route} from '../../shared/routes/Route';
import {RouteCredentials} from '../../shared/routes/RouteCredentials';
import {User} from '../../shared/users/User';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private http: HttpService) { }

  fetchRoutes(): Observable<Route[]> {
    return this.http.get('/route')
      .pipe(
        map((response) => {
          return response.body.map(a => Object.assign(Route.empty(), a));
        }),
        catchError(err => {
          console.log(err);
          return Observable.of([]);
        })
      );
  }

  getUserRoutes(): Observable<Route[]> {
    return this.http.get('/route/user')
      .pipe(
        map((response) => {
          return response.body.map(a => Object.assign(Route.empty(), a));
        }),
        catchError(err => {
          console.log(err);
          return Observable.of([]);
        })
      );
  }

  addRoute(routeCredentials: RouteCredentials): Observable<boolean> {
    const json = routeCredentials.asJson();
    return this.http.post('/route', json)
      .pipe(
        map(() => true),
        catchError(err => {
          console.log(err);
          return Observable.of(false);
        })
      );
  }

  getRoute(routeId: string): Observable<Route> {
    return this.http.get('/route/' + routeId)
      .pipe(
        map((response) => {
          return Object.assign(Route.empty(), response.body);
        }),
        catchError(err => {
          console.log(err);
          return Observable.of([]);
        })
      );
  }

  updateRoute(routeId: string, routeCredentials: RouteCredentials): Observable<boolean> {
    const json = routeCredentials.asJson();
    return this.http.put('/route/' + routeId, json)
      .pipe(
        map(() => true),
        catchError(err => {
          console.log(err);
          return Observable.of(false);
        })
      );
  }
}
