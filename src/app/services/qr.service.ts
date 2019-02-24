import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {HttpHeaders} from '@angular/common/http';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class QrService {

  constructor(private http: HttpService) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'image/png',
    }),
    responseType: 'blob'
  };

  private static handleRequestImageError(err): Observable<any> {
    console.log('Image retrieval error');
    console.log(err);
    return Observable.of(null);
  }

  getVehicleQr(vehicleId: string): Observable<any> {
    return this.getImage('/vehicle/qr/' + vehicleId);
  }

  // getVehicleQrTest(vehicleId: string) {
  //   return this.http.get('/vehicle/qr/' + vehicleId, this.httpOptions).subscribe(data => {
  //     console.log(data);
  //   });
  // }

  getImage(url: string): Observable<any> {
    return this.requestImage(url)
      .pipe(
        switchMap(blob => {
          return ImageUtil.createImageFromBlob(blob);
        }),
        catchError(err => QrService.handleRequestImageError(err))
      );
  }

  private requestImage(url: string): Observable<any> {
    return this.http.get(url, {  responseType: 'blob' });
  }
}



export class ImageUtil {

  /**
   * @param {Blob} image image blob
   * @returns {Observable<any>} observable of the resulting image
   */
  static createImageFromBlob(image: Blob): Observable<any> {
    const reader = new FileReader();
    const subject = new Subject();
    reader.addEventListener('load', () => {
      subject.next(reader.result);
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
    return subject;
  }
}
