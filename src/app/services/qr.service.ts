import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {catchError, switchMap} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class QrService {

  constructor(private http: HttpService) { }

  private static handleRequestImageError(err): Observable<any> {
    console.log('Image retrieval error');
    console.log(err);
    return Observable.of(null);
  }

  private requestImage(url: string): Observable<any> {
    return this.http.getImage(url);
  }

  private getImage(url: string): Observable<any> {
    return this.requestImage(url)
      .pipe(
        switchMap(blob => {
          return ImageUtil.createImageFromBlob(blob);
        }),
        catchError(err => QrService.handleRequestImageError(err))
      );
  }



  getVehicleQr(vehicleId: string): Observable<any> {
    return this.getImage('/vehicle/qr/' + vehicleId);
  }

  getDeviceQr(deviceId: string): Observable<any> {
    return this.getImage('/device/qr/' + deviceId);
  }
}



export class ImageUtil {

  /**
   * @param {Blob} image image blob
   * @returns {Observable} observable of the resulting image
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
