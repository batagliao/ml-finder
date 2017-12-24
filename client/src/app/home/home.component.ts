import { Product } from './../models/product.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  searchForm: FormGroup;
  products: Observable<Product[]>;
  searchterms = new Subject<string>();

  constructor(private productService: ProductService) {

  }

  ngOnInit() {
    this.searchForm = new FormGroup({
      searchBox: new FormControl('', Validators.required)
    });

    // listen to searchBox text changes
    this.searchForm.get('searchBox').valueChanges
        .debounceTime(300)   // wait for 300ms in event fire till stop typing
        .distinctUntilChanged() // ignore if the value is same as preview one
        .subscribe( (value) => {
      this.searchterms.next(value);
    });

    this.searchterms.subscribe( );

    this.products = this.searchterms
          .switchMap( (term) => {
            const prods = term   // switch to new observable
              // return http client observable
              ? this.productService.getProducts(term)
              // or empty observable
              : Observable.of<Product[]>([]);
              return prods;
            })
          .catch( error => {
            // TODO: real error handling
            console.log(error);
            return Observable.of<Product[]>([]);
          });
  }
}
