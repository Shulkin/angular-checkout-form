import { Component, OnInit } from '@angular/core';
import { CLIENTS } from '../../mock-data/mock-clients';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.sass']
})
export class ClientsListComponent implements OnInit {
  title = 'Список наших клиентов';
  clients = CLIENTS;

  constructor() {
  }
  ngOnInit() {
  }
}
