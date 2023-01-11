import { Directive, Input, ElementRef } from '@angular/core';
import { CommonService } from '../_services';
@Directive({
  selector: '[appDateTimeFormat]'
})
export class DateTimeFormatDirective {

  @Input() formatDateString: string;
  @Input() dateString: string;

  constructor(private Element: ElementRef, private commonService: CommonService) { 
  }
  
  ngAfterViewInit() {
   
    var date = +this.Element.nativeElement.innerText;
    this.Element.nativeElement.innerText = this.commonService.convertMilisecondToUTCDateTime(date, this.formatDateString);
  }
}
