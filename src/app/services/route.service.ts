import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpService} from './http.service';
import {Route} from '../../shared/routes/Route';
import {RouteCredentials} from '../../shared/routes/RouteCredentials';
import {RouteUpdate} from '../../shared/routes/RouteUpdate';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private http: HttpService) {
  }

  /**
   * Method that returns a list of all the routes.
   *
   * @returns {Observable<Route[]>}
   */
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

  /**
   * Method that returns a list of routes of the current user.
   *
   * @returns {Observable<Route[]>}
   */
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

  /**
   * Method that adds a new route to the platform based on the given route credentials.
   * Returns true if route is correctly added.
   *
   * @param {RouteCredentials} routeCredentials
   * @returns {Observable<boolean>}
   */
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

  /**
   * Method that returns a specific route based on the given route id.
   *
   * @param {string} routeId
   * @returns {Observable<Route>}
   */
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

  /**
   * Method that updates a specific route based on the given route id and route update data.
   *
   * @param {string} routeId
   * @param {RouteUpdate} routeUpdate
   * @returns {Observable<boolean>}
   */
  updateRoute(routeId: string, routeUpdate: RouteUpdate): Observable<boolean> {
    const json = routeUpdate.asJson();
    return this.http.put('/route/' + routeId, json)
      .pipe(
        map(() => true),
        catchError(err => {
          console.log(err);
          return Observable.of(false);
        })
      );
  }

    deleteRoute(routeId: string): Observable<boolean> {
        return this.http.delete('/route/' + routeId)
            .pipe(
                map(() => true),
                catchError(err => {
                    console.log(err);
                    return Observable.of(false);
                })
            );
    }
}
