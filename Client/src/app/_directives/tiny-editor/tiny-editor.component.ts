import {  Component, AfterViewInit,EventEmitter,OnDestroy, Input, Output } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FileService } from '../../_services';
  declare var tinymce: any;
@Component({
  selector: 'app-tiny-editor',
  templateUrl: './tiny-editor.component.html',
  styleUrls: ['./tiny-editor.component.css']
})
export class TinyEditorComponent implements AfterViewInit, OnDestroy {
  @Input() elementId: String;
  @Input() tmHeight: number = 150;
  @Output() onEditorKeyup = new EventEmitter<any>();
  @Input() tinymceModel:string;
  @Output() tinymceModelChange = new EventEmitter();
  @Input() resetTinymce:boolean=false;
  @Input() menuBarOpt:boolean = true;
  @Input() statusBarOpt:boolean = true;
 
  editor;
  constructor(public fileSvr:FileService) { 
    
  }

  ngAfterViewInit() {
    
    tinymce.init({
      selector: '#' + this.elementId,
      plugins: ['link', 'paste', 'table','media','image','code'],
      skin_url:location.origin+'/assets/skins/lightgray',
      height : this.tmHeight,
      toolbar_items_size : 'small',
      relative_urls : false,
      remove_script_host : false,
      convert_urls : true,
      images_upload_url:environment.urlAPIService+'/documentservice/upload',
      // images_upload_handler: function (blobInfo, success, failure) {
       
      //   debugger;
      //   setTimeout(function () {
      //     /* no matter what you upload, we will turn it into TinyMCE logo :)*/
      //     success('http://moxiecode.cachefly.net/tinymce/v9/images/logo.png');
      //   }, 2000);
      // },
      toolbar: ['bold, italic, paste, numlist bullist, link, table, image, media, alignleft, aligncenter, alignright, forecolor, backcolor'],
      color_cols: "5",
      setup: editor => {
        this.editor = editor;
        editor.on('keyup', () => {
          const content = editor.getContent();
          this.onEditorKeyup.emit(content);
          this.tinymceModelChange.emit(content);
        });
      },
      menubar: this.menuBarOpt,
      statusbar: this.statusBarOpt
    });
    if(this.tinymceModel){
      this.editor.setContent(this.tinymceModel || '');
    }
      
  }
  ngOnDestroy() {
    tinymce.remove(this.editor);
  }

  ngOnChanges(changes: any) {
    if(changes.resetTinymce && changes.resetTinymce.currentValue){
      if(this.resetTinymce )this.editor.setContent('');
    }
  }
  resetContent()
  {
    this.editor.setContent('');
  }
}
