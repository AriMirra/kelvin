import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

  private DEFAULT_HEADERS = {'Content-Type': 'application/json'}; // in content-type-interceptor
  private _authToken: string; // in auth service

  private readonly baseUrl: string;


  get authToken(): string {
    if (!this._authToken) {
      this._authToken = this.cookieService.get('token');
    }
    return this._authToken;
  }

  set authToken(value: string) {
    this._authToken = value;
  }

  constructor(private _http: HttpClient,
              // private platformLocation: PlatformLocation,
              private cookieService: CookieService
  ) {
    // const loc = (platformLocation as any).location;
    // this.baseUrl = 'http://' + loc.hostname + ':8080'; // get base url
    this.baseUrl = 'http://localhost:8080';
  }

  get defaultHeaders(): HttpHeaders {
    return new HttpHeaders(this.DEFAULT_HEADERS);
  }

  get defaultOptions(): any {
    return {headers: this.defaultHeaders};
  }

  get defaultHttp(): HttpClient {
    return this._http;
  }

  public get(url: string, options?: any, ignoreBaseUrl?: boolean): Observable<HttpResponse<any>> {
    return this._http.get((ignoreBaseUrl ? '' : this.baseUrl) + url, {headers: this.requestOptions(options), observe: 'response'});
  }

  public post(url: string, body: any, options?: any): Observable<HttpResponse<any>> {
    return (this._http.post(this.baseUrl + url, body, {headers: this.requestOptions(options), observe: 'response'}));
  }

  public put(url: string, body: any, options?: any): Observable<HttpResponse<any>> {
    return (this._http.put(this.baseUrl + url, body, {headers: this.requestOptions(options), observe: 'response'}));
  }

  public delete(url: string, options?: any): Observable<HttpResponse<any>> {
    return (this._http.delete(this.baseUrl + url, {headers: this.requestOptions(options), observe: 'response'}));
  }

  public patch(url: string, body: any, options?: any): Observable<HttpResponse<any>> {
    return (this._http.patch(this.baseUrl + url, body, {headers: this.requestOptions(options), observe: 'response'}));
  }

  public head(url: string, options?: any): Observable<HttpResponse<any>> {
    return (this._http.head(this.baseUrl + url, {headers: this.requestOptions(options), observe: 'response'}));
  }

  public options(url: string, options?: any): Observable<HttpResponse<any>> {
    return (this._http.options(this.baseUrl + url, {headers: this.requestOptions(options), observe: 'response'}));
  }

  private requestOptions(options?: any) {
    const authHeader = {Authorization: `Bearer ${this.authToken}`};
    if (options) {
      return new HttpHeaders(Object.assign(options, authHeader));
    } else {
      return new HttpHeaders(Object.assign(this.DEFAULT_HEADERS, authHeader));
    }
  }
}
