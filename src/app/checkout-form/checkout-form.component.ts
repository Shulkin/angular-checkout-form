import { Component, OnInit, Input } from '@angular/core';
import { Client } from '../../classes/client';

declare var UIkit: any;

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
    UIkit.modal('#make-payment-modal').hide();
  }
}
