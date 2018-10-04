import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpService} from './http.service';
import {Product} from '../../shared/products/Product';
import {ProductCredentials} from '../../shared/products/ProductCredentials';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpService) { }

  fetchProducts(): Observable<Product[]> {
    return this.http.get('/product')
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

  addProduct(productCredentials: ProductCredentials): Observable<boolean> {
    const json = productCredentials.asJson();
    return this.http.post('/product', json)
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

  updateDevice(productId: string, productCredentials: ProductCredentials) {
    const json = productCredentials.asJson();
    return this.http.put('/product/' + productId, json)
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
