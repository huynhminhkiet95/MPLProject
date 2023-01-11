import { Component, OnInit ,ViewChild} from '@angular/core';
import { Router} from '@angular/router';
import { CommonService,UserService,FileService, EmployeeService } from '../../../_services/index';
import { BsModalService,ModalDirective} from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FileuploadComponent} from '../../../_directives/fileupload/fileupload.component';
import {Globalconst} from '../../../_helpers/globalvariable'
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
import {DomSanitizer} from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-userprofile-viewdetail',
  templateUrl: './userprofile-viewdetail.component.html',
  styleUrls: ['./userprofile-viewdetail.component.css']
})
export class UserprofileViewdetailComponent implements OnInit {

  @ViewChild(FileuploadComponent)
  private fileUpload: FileuploadComponent;
  @ViewChild('staticModal') public modalAvatar: ModalDirective;
  loading=false;
  model:any = {};
  subsidiary:any = {};
  title:string ='User Profile';
  avatar:string='';
  currentUser:any={};
  languages:any=[];
  listAccount:any=[];
  constructor(
    private router: Router,
    private languageSvc:CommonService,
    private userSvc:UserService,
    private toastr: ToastrService,
    private modalService: BsModalService,public bsModalRef: BsModalRef,
    private fileSvc:FileService,
    public globals:Globalconst,
    private empsv : EmployeeService,
    private sanitizer:DomSanitizer,
  )
  {

  }

  ngOnInit() {
    //this.avatar = environment.urlFileServer+this.model.avartarThumbnail
  } 
  createLink(item:any)
  {
    
    let link:string;
    let temp = new String();
    if(item.accountType=='Skype')
    {
      link = temp.concat('skype:',item.accountId,'?chat').toString();
    }
    else if(item.accountType=='Slack')
    {
      link = temp.concat('slack://user?team={mplogistics}&id',item.accountId).toString();
    }
    
    return this.sanitizer.bypassSecurityTrustResourceUrl(link);
  }
}
