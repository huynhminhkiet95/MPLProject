import { Component, OnInit, OnDestroy,ViewContainerRef,ViewEncapsulation } from '@angular/core';
import DataGrid from 'devextreme/ui/data_grid';
import { CommonService } from '../_services/common.service';
import { environment } from '../../environments/environment';
import { Globalconst } from '../_helpers';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from '../_services/message.service';
import { MessageDto } from '../_models/messageDto';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css',],
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit, OnDestroy {

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  constructor(vcr: ViewContainerRef,
    public commonSvc:CommonService,public global:Globalconst, private toastr: ToastrService,private dataProvider: MessageService
  ) {
    let that=this;
    let grid: any = DataGrid;
    grid.defaultOptions({
      options: {
        editing: {
          // allowUpdating: true,
          // allowDeleting:true,
          // allowAdding:true,
        },
        allowColumnReordering:true,
        allowColumnResizing:true,
        columnAutoWidth:true,
        showColumnLines:true,
        showRowLines:true,
        showBorders:true,
        rowAlternationEnabled:true,
        selection:{
          mode:'single',
        },
        paging:{
          enable:true,
          pageSize:"20"
        },
        pager:{
          allowedPageSizes:[10, 20, 50,100],
          showInfo:true,
          showPageSizeSelector:true,
        },
        onCellPrepared:function(e) {
           
          if (e.rowType === "data" && e.column.command === "edit") 
          {
              var isEditing = e.row.isEditing,
                  cellElement = e.cellElement;
            
              if (isEditing) 
              {
                  let saveLink = cellElement.querySelector(".dx-link-save"),
                      cancelLink = cellElement.querySelector(".dx-link-cancel");

                  saveLink.classList.add("dx-icon-save");
                  cancelLink.classList.add("dx-icon-revert");

                  saveLink.textContent = "";
                  cancelLink.textContent = "";
              } 
              else 
              {
                  let editLink = cellElement.querySelector(".dx-link-edit"),
                  deleteLink = cellElement.querySelector(".dx-link-delete");
                  if(editLink){
                    editLink.classList.add("dx-icon-edit");
                    editLink.textContent = "";
                  }
                  if(deleteLink){
                    deleteLink.textContent = "";
                    deleteLink.classList.add("dx-icon-trash");
                  }
              }
          }
          if(e.rowType === "data")
          {
            
            if(e.column.dataType=='datetime'){
             // e.cellElement.innerText = that.commonSvc.convertMilisecondToUTCDateTime(e.cellElement.innerText);
            }
            if(e.column.dataType=='datetime2'){
              e.cellElement.innerText = that.commonSvc.convertMilisecondToUTCDateTime2(e.value);
             }
            else if(e.column.dataType=='date2'){
              e.cellElement.innerText =that.commonSvc.convertMilisecondToUTCDate2(e.value);
             // e.cellElement.innerText = (new Date(e.value)).toUTCString();// that.commonSvc.convertMilisecondToUTCDate(e.value);
            }
            if(e.column.dataType=='time2'){
              e.cellElement.innerText =that.commonSvc.convertTime(e.value);
             // e.cellElement.innerText = (new Date(e.value)).toUTCString();// that.commonSvc.convertMilisecondToUTCDate(e.value);
            }
            if (e.column.dataType=='time3') {
              e.cellElement.innerText =that.commonSvc.convertRealTime(e.value, null);
            }
            
          }
        },
        
      },
    });
    
  }

  ngOnInit() {
    // add the the body classes
    
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
    this.body.classList.remove('login-page');

  }

   ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }
}
