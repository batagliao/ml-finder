import { Product } from './../models/product.model';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { Endpoints } from '../endpoint.constants';

@Injectable()
export class ProductService {

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(Endpoints.PRODUCT_GET_ALL);
  }

  getProducts(description: string): Observable<Product[]> {
    const filtered = this.getAllProducts()
      .map( products => {
        return products.filter((prod) => prod.description.startsWith(description));
      });
    return filtered;
  }

  getProductByCode(code: Number): Observable<Product> {
    return this.http.get<Product>(`${Endpoints.PRODUCT_GET_ALL}/${code}`);
  }

}
