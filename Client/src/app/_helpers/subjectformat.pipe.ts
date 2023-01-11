import { Pipe, ElementRef, Directive } from '@angular/core';

@Directive({
  selector: '[subjectformat]'
})

export class SubjectFormatPipe {
  constructor(private Element: ElementRef) { 
  }
  
  ngAfterViewInit() {
    var data = this.Element.nativeElement.innerText;
    if (data.length > 50) {
      this.Element.nativeElement.innerText = data.slice(0, 50) + "...";
    } 
    else this.Element.nativeElement.innerText = data;
  }
}
