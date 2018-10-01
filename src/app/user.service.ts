import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {ClientCredentials} from '../shared/ClientCredentials';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import 'rxjs-compat/add/observable/of';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = 'http://localhost:8080';
  constructor(private http: HttpClient,
              private router: Router,
              private cookieService: CookieService) {
  }

  login(clientCredentials: ClientCredentials): Observable<boolean> {
    const json = clientCredentials.asJson();
    return this.http.post( this.url + '/auth', json)
      .pipe(
      map( (response: any) => {
        this.cookieService.set('token', response.token);
        return true;
      }),
      catchError(err => {
        console.log(err);
        return Observable.of(false);
      })
      );
  }
}
