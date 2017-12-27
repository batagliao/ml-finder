import { Endpoints } from './../endpoint.constants';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '../models/store.model';

@Injectable()
export class StoreService {

  constructor(private http: HttpClient) { }

  getStoresByCodes(codes: Number[]) {
    const qParams = '?a=' + codes.join('&codes=');
    return this.http.get<Store[]>(Endpoints.STORES_GET_ALL + qParams.replace('a=&', ''));
  }
}
