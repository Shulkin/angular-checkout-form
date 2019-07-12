import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Client } from '../../classes/client';
import { PaidClient } from '../../classes/paid-client';

declare var UIkit: any;

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.sass']
})
export class CheckoutFormComponent implements OnInit {
  @Input() client: Client;
  @Output() submited = new EventEmitter<PaidClient>();
  depositeModel: number = 0;
  constructor() {
  }
  ngOnInit() {
  }
  onSubmit() {
    this.submited.emit(new PaidClient(this.client.id, this.depositeModel));
    UIkit.modal('#make-payment-modal').hide();
  }
}
