import { StoreService } from './../services/store.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';

import { Observable } from 'rxjs/Observable';

import { Product } from '../models/product.model';
import { Store } from '../models/store.model';
import { GeoLocationService, POSITION_KEY_LATITUDE, POSITION_KEY_LONGITUDE } from '../services/geolocation.service';
import { ChangeDetectorRef } from '@angular/core/';

const maps = require('google-distance-matrix');

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  stores: Observable<Store[]>;
  product: Product;
  private unsortedStores: Store[];

  constructor(
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private productService: ProductService,
    private storeService: StoreService,
    private geoService: GeoLocationService
  ) { }

  ngOnInit() {
    const prodId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.productService.getProductByCode(prodId)
      .subscribe((value) => {
        this.product = value;
        this.storeService.getStoresByCodes(this.product.stores)
          .subscribe((stores: Store[]) => {
            this.unsortedStores = stores;
            const origin = {
              lat: parseFloat(localStorage.getItem(POSITION_KEY_LATITUDE)),
              lng: parseFloat(localStorage.getItem(POSITION_KEY_LONGITUDE))
            };

            this.geoService.getStoresDistance(origin, stores).subscribe((apiValue) => {
              const distances = apiValue[0].rows[0].elements.map((el) => {
                return el.distance;
              });

              this.unsortedStores = this.unsortedStores.map((s, idx) => {
                const stor = s;
                stor.distance = distances[idx];
                return stor;
              });

              const sorted: Store[] = this.unsortedStores.sort((a, b) => {
                if (a.distance.value < b.distance.value) return -1;
                if (a.distance.value > b.distance.value) return 1;
                return 0;
              });
              this.stores = Observable.of(sorted);
              this.ref.detectChanges(); // needed this to display items
            });
          });
      });


  }


}
