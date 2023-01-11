import { Directive, HostListener, ElementRef, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { MyCurrencyPipe } from "./myCurrencyPipe.directive";
import { NgModel } from "@angular/forms";
@Directive({ 
    selector: "[ngModel][myCurrencyFormatter]",
    providers: [NgModel], 
    host: {
        "(input)": 'onInputChange($event)'
            }
})

export class MyCurrencyFormatterDirective implements OnInit {
    
    @Output() ngModelChange:EventEmitter<any> = new EventEmitter()
    value: any
  private el: HTMLInputElement;
 // Allow decimal numbers and negative values
private regex: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);
// Allow key codes for special events. Reflect :
// Backspace, tab, end, home
private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-'];

  constructor(
    private elementRef: ElementRef,
    private currencyPipe: MyCurrencyPipe
    
  ) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.el.value = this.currencyPipe.transform(this.el.value);
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value) {
    this.el.value = this.currencyPipe.parse(value); // opossite of transform
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value) {
    this.el.value = this.currencyPipe.transform(value);
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
      // Allow Backspace, tab, end, and home keys
      if (this.specialKeys.indexOf(event.key) !== -1) {
          return;
      }
      let current: string = this.elementRef.nativeElement.value;
      let next: string = current.concat(event.key);
      if (next && !String(next).match(this.regex)) {
          event.preventDefault();
      }
  }
  onInputChange($event){
        this.ngModelChange.emit($event.target.value);
    }
}