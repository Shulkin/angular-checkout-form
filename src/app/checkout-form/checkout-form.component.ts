import { Component, OnInit, Input } from '@angular/core';
import { Client } from '../../classes/client';

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.sass']
})
export class CheckoutFormComponent implements OnInit {
  @Input() client: Client;
  depositeAmount: number = 0;
  constructor() {
  }
  ngOnInit() {
  }
  onSubmit() {
    // TODO: close modal
  }
}
