import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @ViewChild('childModal') public childModal: ModalDirective;
  @Input() title?: string;

  constructor() { }

  ngOnInit() {
  }

  show() {
    this.childModal.show();
  }
  hide() {
    this.childModal.hide();
  }
}
