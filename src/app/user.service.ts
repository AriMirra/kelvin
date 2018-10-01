import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {ClientCredentials} from '../shared/ClientCredentials';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import 'rxjs-compat/add/observable/of';
import {HttpService} from './http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpService,
              private router: Router,
              private cookieService: CookieService) {
  }

  login(clientCredentials: ClientCredentials): Observable<boolean> {
    const json = clientCredentials.asJson();
    return this.http.post('/auth', json)
      .pipe(
        map((response: any) => {
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
