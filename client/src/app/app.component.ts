import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('childModal') childModal: ModalComponent;

  title = 'app';
}
