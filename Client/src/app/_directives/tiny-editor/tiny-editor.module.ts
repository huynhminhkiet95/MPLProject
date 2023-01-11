import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TinyEditorComponent } from './tiny-editor.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TinyEditorComponent],
  exports:[TinyEditorComponent]
})
export class TinyEditorModule { }

