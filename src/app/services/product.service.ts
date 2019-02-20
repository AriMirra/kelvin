import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpService} from './http.service';
import {Product} from '../../shared/products/Product';
import {ProductCredentials} from '../../shared/products/ProductCredentials';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpService) {
  }

  /**
   * Method that returns a list of all the products.
   *
   * @returns {Observable<Product[]>}
   */
  fetchProducts(): Observable<Product[]> {
    return this.http.get('/product')
      .pipe(
        map((response) => {
          return response.body.map(a => Object.assign(Product.empty(), a));
        }),
        catchError(err => {
          console.log(err);
          return Observable.of([]);
        })
      );
  }

  /**
   * Method that adds a new product to the platform based on the given product credentials.
   * Returns true if product is correctly added.
   *
   * @param {ProductCredentials} productCredentials
   * @returns {Observable<boolean>}
   */
  addProduct(productCredentials: ProductCredentials): Observable<boolean> {
    const json = productCredentials.asJson();
    return this.http.post('/product', json)
      .pipe(
        map(() => true),
        catchError(err => {
          console.log(err);
          return Observable.of(false);
        })
      );
  }

  /**
   * Method that updates a specific product based on the given product id and product update data.
   *
   * @param {string} productId
   * @param {ProductCredentials} productCredentials
   * @returns {Observable<any>}
   */
  updateProduct(productId: string, productCredentials: ProductCredentials) {
    const json = productCredentials.asJson();
    return this.http.put('/product/' + productId, json)
      .pipe(
        map(() => true),
        catchError(err => {
          console.log(err);
          return Observable.of(false);
        })
      );
  }

  /**
   * Method that returns a specific product based on the given product id.
   *
   * @param {string} productId
   * @returns {Observable<Product>}
   */
  getProduct(productId: string): Observable<Product> {
    return this.http.get('/product/' + productId)
      .pipe(
        map((response) => {
          return Object.assign(Product.empty(), response.body);
        }),
        catchError(err => {
          console.log(err);
          return Observable.of(null);
        })
      );
  }
}
