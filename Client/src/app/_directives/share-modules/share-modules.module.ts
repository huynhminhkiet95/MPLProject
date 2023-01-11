import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebounceClickDirective } from './debounce-click.directive';
import { DateTimeFormatDirective } from '../date-time-format.directive';
import { RemovewhitespacesPipe } from './upperandremovespace';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DebounceClickDirective,
    DateTimeFormatDirective,
    RemovewhitespacesPipe
  ],
  exports: [
    DebounceClickDirective,
    DateTimeFormatDirective,
    RemovewhitespacesPipe
  ]
})
export class ShareModulesModule { }
