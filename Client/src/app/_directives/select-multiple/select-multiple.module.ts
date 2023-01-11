import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectMultipleComponent } from '..';
import { SelectModule } from 'ng2-select';
@NgModule({
  imports: [
    CommonModule,
    SelectModule,
  ],
  declarations: [SelectMultipleComponent],
  exports:[SelectMultipleComponent]
})
export class SelectMultipleModule { }
