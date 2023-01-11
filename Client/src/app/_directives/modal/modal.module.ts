import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalComponent } from './modal.component';
import { ModalService } from '../../_services/modal.service';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ModalComponent ],
  providers: [ ModalService ],
  exports: [ ModalComponent ]
})
export class ModalModule { }