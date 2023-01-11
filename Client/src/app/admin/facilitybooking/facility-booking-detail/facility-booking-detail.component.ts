import { Component, OnInit,  Output, EventEmitter, ComponentFactoryResolver, Injector } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FacilityBookingService, FileService, UserService, CommonService } from '../../../_services/index'
import { WindowRef, Globalconst } from '../../../_helpers/index';
import { FacilityBookingModel } from '../../../_models/index'
import * as moment from 'moment';
import 'rxjs/add/operator/take';
import { WelcomeBoardComponent } from '../../welcome-board/welcome-board.component'
import { WelcomeBoardModel } from '../../../_models/WelcomeBoardModel';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
declare var AdminLTE: any;

@Component({
  selector: 'app-facility-booking-detail',
  templateUrl: './facility-booking-detail.component.html',
  styleUrls: ['./facility-booking-detail.component.css']
})
export class FacilityBookingDetailComponent implements OnInit {
  title: string;
  facilityList: any = [];
  currentuser: any = {};
  bsRangeValue: any = [];
  id: number = 0;
  model = new FacilityBookingModel;
  now: Date = new Date();
  typetime = "";
  isAllDay = false;
  hourStart: any = {};
  minuteStart: any = {};
  hourTo = 8;
  minuteTo = 0;
  currentDate: Date = new Date();
  hstep = 1;
  mstep = 15;
  minTime: Date = new Date();
  maxTime: Date = new Date();
  languages: any = [];
  welcomeBoard = new WelcomeBoardModel;
  nativeWindow: any
  bookingdatestart:string;
  bookingdateto:string;
  @Output() reloadGrid: EventEmitter<any> = new EventEmitter()
  constructor(private route: ActivatedRoute,
    private router: Router,
    private facilityBookingService: FacilityBookingService,
    private fileSvc: FileService,
    private toastr: ToastrService,
    private userSvc: UserService,
    private commonSvc: CommonService,
    private global: Globalconst,
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private winRef:WindowRef
  ) {
    this.nativeWindow=this.winRef.nativeWindow;
    this.title = "New Facility Booking";

    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
  }

  ngOnInit() {
    AdminLTE.init();
    this.isAllDay = false;
    this.currentuser = JSON.parse(localStorage.getItem('currentUser')) || {};
    this.title = "Edit Facility Booking : " + this.id;
    this.typetime = "datetime";
  }

  convertLocalTime(localtime) {
    var localTime1 = moment.utc(localtime);
    return moment(localTime1).format('DD/MM/YYYY HH:mm');
  }

  convertLocalTimeSearch(localtime) {
    var localTime1 = moment.utc(localtime);
    return moment(localTime1).format('MM/DD/YYYY');
  }

  convertLocalTimeDate(localtime) {
    var localTime1 = moment.utc(localtime);
    return moment(localTime1).local(true)["_d"];
  }

  onvalueChangedStartDate() {
    if (this.model.BookDateStart == null) {
      this.model.BookDateStart = new Date();
    }

    if (this.isAllDay) {
      this.model.BookDateStart = moment(this.model.BookDateStart, "MM/DD/YYYY").set({ hour: 5, minute: 0 })["_d"];
      this.model.BookDateTo = moment(this.model.BookDateStart, "MM/DD/YYYY").set({ hour: 20, minute: 0 })["_d"];
    }
  }

  ChangeAllDay() {
    this.isAllDay = !this.isAllDay;
    let date1 = new Date(this.model.BookDateStart);

    if (this.isAllDay == false) {
      this.model.BookDateStart = new Date(this.model.BookDateStart);
      this.model.BookDateTo = moment(this.model.BookDateStart).add(1, 'hours')['_d'];
    }
    else {
      this.model.BookDateStart = moment(this.model.BookDateStart).set({ hour: 7, minute: 0 })["_d"];
      this.model.BookDateTo = moment(this.model.BookDateStart).set({ hour: 18, minute: 0 })["_d"];
    }
  }

  getFacilityBookingDetail() {
    this.facilityBookingService.getById(this.id, this.currentuser.employeeId, this.currentuser.subsidiaryId).subscribe(
      data => {
        this.model = data["payload"];
        this.bsRangeValue = [new Date(this.model.BookDateStart), new Date(this.model.BookDateTo)];
      }
    );
  }

  Save() {
    if (this.isAllDay) {
      this.model.BookDateStart = moment(this.model.BookDateStart, "MM/DD/YYYY").set({ hour: 5, minute: 0 })["_d"];
      this.model.BookDateTo = moment(this.model.BookDateStart, "MM/DD/YYYY").set({ hour: 20, minute: 0 })["_d"];
    }
    this.facilityBookingService.validate(this.model).subscribe(
      data => {
        
        if (data['payload'].length == 0) {
          this.model.CreateUser = this.currentuser.employeeId;
          this.facilityBookingService.insert(this.model).subscribe(
            data => {
              if (data["success"] === true) {
                this.reloadGrid.emit(null);
                this.bsModalRef.hide();
                this.toastr.success('Save Facility Booking', 'Success!');
              }
            },
            error => {
              this.toastr.error('Save Facility Booking', error["message"]);
            }
          );
        }
        else {
          this.toastr.warning("Booking time unavaiable for booking", "Save Facility Booking");
        }
      }
    );

  }

  Cancel() {
    this.facilityBookingService.cancle(Number(this.model.Id), this.currentuser.employeeId).subscribe(
      data => {
        if (data["success"] === true) {
          this.reloadGrid.emit(null);
          this.bsModalRef.hide();
          this.toastr.success('Cancel Booking', 'Success!');
        }
      },
      error => {
        this.toastr.error('Cancel Facility Booking', error["message"]);
      }
    );
  }
  ShowwelcomeBoard() {
    const factory = this.resolver.resolveComponentFactory(WelcomeBoardComponent);
    const component = factory.create(this.injector);
    this.welcomeBoard.BookDateStart=this.model.BookDateStart;
    this.welcomeBoard.BookMemo=this.model.BookMemo;
    this.welcomeBoard.BookSubject=this.model.BookSubject;
    this.welcomeBoard.FacilityCode = this.facilityList.filter(g => {
      return  g.facilityCode == this.model.FacilityCode
    })[0].facilityDesc;
    component.instance.data=this.welcomeBoard;
    component.changeDetectorRef.detectChanges();

    const popupContent = component.location.nativeElement;
    // var w = this.winRef.nativeWindow.open("");
    // w.document.write(popupContent.innerHTML);
    // w.location = '/webcomeboard';
    let theme=this.welcomeBoard.Theme||"wooden.jpg";
     
    var newwinDow = this.nativeWindow.open('', '_blank', 'scrollbars=no,fullscreen=yes,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    newwinDow.location='webcomeboard/'+this.model.Id+'/'+theme +'?float='+this.welcomeBoard.Fload+'';
  }
}
