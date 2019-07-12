import { Component, OnInit, Input } from '@angular/core';
import { DisplayService } from '../../classes/display-service';

@Component({
  selector: 'app-services-table',
  templateUrl: './services-table.component.html',
  styleUrls: ['./services-table.component.sass']
})
export class ServicesTableComponent implements OnInit {
  @Input() services: DisplayService[];
  constructor() {}
  ngOnInit() {}
}
