import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';

import { Observable } from 'rxjs/Observable';

import { Product } from '../models/product.model';
import { Store } from '../models/store.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product: Product;
  stores: Observable<Store[]>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit() {
    const prodId =  parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.productService.getProductByCode(prodId)
      .subscribe( (value) => {
        this.product = value;
        // TODO: load stores by distance
      });
  }

}
