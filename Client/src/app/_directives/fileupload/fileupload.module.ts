import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FileuploadComponent} from './fileupload.component';
import { AngularCropperjsModule } from 'angular-cropperjs';
@NgModule({
  imports: [
    CommonModule,
    AngularCropperjsModule,
  ],
  declarations: [FileuploadComponent],
  exports:
  [
    FileuploadComponent,
  ]
})
export class FileuploadModule { }
