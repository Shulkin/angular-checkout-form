import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Client } from '../../classes/client';
import { Payment } from '../../classes/payment';

declare var UIkit: any;

// TODO: add ngx-currency mask to input
// https://github.com/nbfontana/ngx-currency
// TODO: maybe add form validation before submit
@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.sass']
})
export class CheckoutFormComponent implements OnInit {
  @Input() client: Client;
  @Output() submitted = new EventEmitter<Payment>();
  // TODO: clear input model when modal is shown
  depositModel: number = 0;
  constructor() {}
  ngOnInit() {}
  onSubmit() {
    this.submitted.emit(new Payment(this.client.id, this.depositModel));
    UIkit.modal('#make-payment-modal').hide();
  }
}
