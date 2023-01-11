import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCurrencyFormatterDirective } from '../mycrrencyformat.directive';
import { AutofocusDirective } from '../share-modules/auto-focus.directive';

@NgModule({
  imports: [
    
  ],
  declarations: [
    MyCurrencyFormatterDirective,
    AutofocusDirective
  ],
  
  exports: [
    MyCurrencyFormatterDirective,
    AutofocusDirective
  ]
})
export class DirectivesModule { }
