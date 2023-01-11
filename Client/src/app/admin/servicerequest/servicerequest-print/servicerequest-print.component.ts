import { Component, OnInit, Input } from '@angular/core';
import { SanitizeHtmlPipe } from '../../../_helpers/sanitizehtmlpipe ';
@Component({
  selector: 'app-servicerequest-print',
  templateUrl: './servicerequest-print.component.html',
  styleUrls: ['./servicerequest-print.component.css']
})
export class ServicerequestPrintComponent implements OnInit {
  @Input() modeldetail: any={};
  constructor() { }
  ngOnInit() {
  }
}
