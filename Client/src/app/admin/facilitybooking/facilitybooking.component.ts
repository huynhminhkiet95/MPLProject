import { Component, OnInit, ViewChild, EventEmitter, Input } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CommonService } from '../../_services/index'
import { Appointment, Priority, Resource, FacilityBookingModel } from '../../_models/index'
import { FacilityBookingDetailComponent } from './facility-booking-detail/facility-booking-detail.component';
import { DxDataGridComponent, DxSchedulerComponent } from 'devextreme-angular';
import { FacilityBookingService, EmployeeService } from '../../_services/index';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';

import * as moment from 'moment';
import 'rxjs/add/operator/take';
import { Router, ActivatedRoute } from '@angular/router';
import { COWorkLocService } from '../../_services/co-work-loc.service';
declare var AdminLTE: any;

@Component({
  selector: 'app-facilitybooking',
  templateUrl: './facilitybooking.component.html',
  styleUrls: ['./facilitybooking.component.css']
})
export class FacilitybookingComponent implements OnInit {
  @ViewChild("scheduler") dataSchedule: DxSchedulerComponent;
  title: string;
  facilityList: any = [];
  facilityList2: any = [];
  currentuser: any = {};
  bsRangeValue: any = [];
  dataSource: any = {};
  dataCalendarSource: any = {};
  searchModel: any = {};
  modeDisplay = '2';
  model = new FacilityBookingModel;
  bsModalRef: BsModalRef;
  appointmentsData: any = [];
  resourcesData: any = [];
  prioritiesData: any = [];
  currentDate: Date = new Date();
  dataList: any = [];
  popupVisible = false;
  hours: any = [];
  times: any = [];
  minTime: Date = new Date();
  maxTime: Date = new Date();
  languages: any = [];
  type: string = 'booktransportation';
  workinglocs:any=[];
  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  @Input() messageEvent = new EventEmitter<string>();
  constructor(
    public facilityBookingService: FacilityBookingService,
    private modalService: BsModalService, private commonSvc: CommonService, employeeService: EmployeeService,
    private router: Router, private route: ActivatedRoute,public worklocService:COWorkLocService
  ) {
    this.type = this.route.url["_value"][0].path;
    this.currentuser = JSON.parse(localStorage.getItem('currentUser')) || {};
    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
    this.appointmentsData = new DataSource({
      store: new CustomStore({
        load: (options) => {
          //
          var dxScheduler = options;
          var dxSchdeduler = options["dxScheduler"];
          this.searchModel.BookDateF = this.convertLocalTimeSearch(dxSchdeduler.startDate);
          this.searchModel.BookDateT = this.convertLocalTimeSearch(dxSchdeduler.endDate);
          this.searchModel.FacilityCode = "";
          this.searchModel.FacilityGroup = this.type;
          // Add condition search: UserId
          this.searchModel.UserId = this.currentuser.employeeId;

          let that = this;
          return that.facilityBookingService.search(this.searchModel)
            .toPromise()
            .then(response => {
              return {
                data: this.getAponintment(response),
                totalCount: response["payload"][0] ? response["payload"][0].totalCount : 0
              }
            }).catch(error => { throw error });
        },
        byKey: (key) => {
          return null;
        }
      })
    });

    this.getStdcodes();
    this.prioritiesData = new DataSource({
      store: new CustomStore({
        load: (options) => {
          var deferred = $.Deferred();
          let that = this;
          return that.commonSvc.getFacilities(this.currentuser.subsidiaryId)
            .toPromise()
            .then(response => {
              this.facilityList = response["payload"];

              return {
                data: this.getFacilities(response),
                totalCount: response["payload"][0] ? response["payload"][0].totalCount : 0
              }
            }).catch(error => { throw error });
        },
        byKey: (key) => {
          return null;
        }
      })
    });

    this.minTime.setHours(7);
    this.minTime.setMinutes(0);
    this.maxTime.setHours(19);
    this.maxTime.setMinutes(0);
  }

  ngOnInit() {
    AdminLTE.init();
    //

    this.bsRangeValue = [new Date(), moment().add(7, 'days')["_d"]];
    if (this.type == 'booktransportation') {
      this.title = this.languages.booktransportation;
      this.type = 'VEHICLE';
    }
    else {
      this.title = this.languages.bookmeetingroom;
      this.type = 'MTROOM';
    }

    this.searchModel = {
      "BookDateF": moment(this.bsRangeValue[0]).format('DD/MM//YYYY'),
      "BookDateT": moment(this.bsRangeValue[1]).format('DD/MM//YYYY'),
      "SubsidiaryId": this.currentuser.subsidiaryId,
      "FacilityCode": '',
      'UserId': this.currentuser.employeeId
    }
  }

  getStdcodes() {
    this.commonSvc.getFacilities(this.currentuser.subsidiaryId).subscribe(
      data => {
        this.facilityList = data["payload"];
        var group = this.type;
        this.facilityList2 = this.facilityList.filter(function (x) {
          return x.facilityGroup == group;
        });
      }
    );
    this.worklocService.getAllCoWorkLoc("OFFICE").subscribe(data=>{
        this.workinglocs = data['payload'];
    });
  }
  getday(date) {
    var result = date.getDay();
    return result;
  }

  getFacilities(data) {
    var prioritiesDataJson = []
    this.facilityList = data["payload"];

    for (let index = 0; index < this.facilityList.length; index++) {
      var priority = new Priority;
      priority = {
        text: this.facilityList[index].facilityDesc,
        id: this.facilityList[index].facilityCode,
        description: this.facilityList[index].facilityNote,
        color: this.facilityList[index].colorCode
      }
      
      prioritiesDataJson.push(priority);
    }
    return prioritiesDataJson;
  }
  getAponintment(response) {
    var appointmentsJson = [];
    var data = response["payload"];
    var totalCount = data.length;

    if (totalCount > 0) {
      data.forEach(element => {
        var appointment = new Appointment();
        appointment.text = element.bookSubject;
        appointment.startDate = this.convertLocalTimeDate(element.bookDateStart);
        appointment.endDate = this.convertLocalTimeDate(element.bookDateTo);
        appointment.priority = element.facilityCode;
        appointment.id = element.fbId;
        appointment.description = element.bookMemo;
        appointment.createName = element.createName;
        appointment.GroupCode = element.facilityDesc;
        var ownerIds: any = [];
        ownerIds.push(element.createUser);
        appointment.ownerId = ownerIds;
        appointmentsJson.push(appointment)

        var resource = new Resource();
        resource.text = element.createName;
        resource.id = element.createUser;
        //resource.color = '#' + Number(Math.random() * 0xffffff).toString(16)
        appointmentsJson.push(resource);
      });
    }
    return appointmentsJson;
  }


  convertLocalTimeSearch(localtime) {
    var localTime1 = moment.utc(localtime);
    return moment(localTime1).format('MM/DD/YYYY');
  }

  convertLocalTimeDate(localtime) {
    var localTime1 = moment.utc(localtime);
    return moment(localTime1).local(true)["_d"];
  }

  onAppointmentFormCreated(e) {
    var form = e.form;
    form.visible = false;
    e.component._popup.hide();
    var appointmentData = e["appointmentData"];

    var id = appointmentData.id;
    this.model = new FacilityBookingModel;
    if (id === undefined || id == "null" || id == 0) {
      this.model.BookDateStart = appointmentData.startDate;
      this.model.BookDateTo = appointmentData.endDate;
      this.model.FacilityCode = this.searchModel.FacilityCode;
      this.bsModalRef = this.modalService.show(FacilityBookingDetailComponent, { class: 'modal-lg' });
      this.bsModalRef.content.id = 0;;
      this.bsModalRef.content.hstep = 1;
      this.bsModalRef.content.mstep = 15;

      this.minTime = moment(appointmentData.startDate).set({ hour: 6, minute: 0 })["_d"];
      this.maxTime = moment(appointmentData.startDate).set({ hour: 19, minute: 0 })["_d"];
      this.bsModalRef.content.minTime = this.minTime;
      this.bsModalRef.content.maxTime = this.maxTime;
      this.model.Id = "0";
      this.bsModalRef.content.model = this.model;
      this.bsModalRef.content.title = this.languages.newfacilitybooking;
      this.bsModalRef.content.facilityList = this.facilityList2;
      this.bsModalRef.content.hours = this.hours;
      this.bsModalRef.content.minutes = this.times;
      this.bsModalRef.content.reloadGrid.subscribe(this.searchFacilityBookings.bind(this));
    }
    else {
      this.GetFacilityBookingDetail(id)
    }
  }

  GetFacilityBookingDetail(id) {
    this.facilityBookingService.getById(id, this.currentuser.employeeId, this.currentuser.subsidiaryId).subscribe(response => {
      var data = response["payload"];
      this.model.BookDateStart = this.convertLocalTimeDate(data.bookDateStart)
      this.model.BookMemo = data.bookMemo;
      this.model.BookDateTo = this.convertLocalTimeDate(data.bookDateTo)
      this.model.BookSubject = data.bookSubject;
      this.model.CreateUser = data.createUser;
      this.model.CreateName = data.createName;
      this.model.FacilityCode = data.facilityCode;
      this.bsModalRef.content.bookingdatestart = moment.utc(data.bookDateStart).format('DD/MM/YYYY HH:mm');//this.commonSvc.getDate(data.bookDateStart);
      this.bsModalRef.content.bookingdateto = moment.utc(data.bookDateTo).format("DD/MM/YYYY HH:mm");// this.commonSvc.getDate(data.bookDateTo);
      this.model.Id = data.fbId;
    });

    this.bsModalRef = this.modalService.show(FacilityBookingDetailComponent, { class: 'modal-lg' });
    this.bsModalRef.content
    this.bsModalRef.content.model = this.model
    this.bsModalRef.content.id = this.model.Id;
    this.bsModalRef.content.hstep = 1;
    this.bsModalRef.content.mstep = 15;
    this.bsModalRef.content.title = this.languages.editfacilitybooking;
    this.bsModalRef.content.facilityList = this.facilityList2;
    this.bsModalRef.content.hours = this.hours;
    this.bsModalRef.content.minutes = this.times;
    this.bsModalRef.content.reloadGrid.subscribe(this.searchFacilityBookings.bind(this));
  }


  openModalWithComponent(e) {
    e.cancel = true;
    var form = e.form;
    this.popupVisible = true;
    this.model = new FacilityBookingModel;
    this.model.BookDateStart = new Date();
    this.model.BookDateTo = moment(this.model.BookDateStart).add(1, 'hours')['_d'];
    this.bsModalRef = this.modalService.show(FacilityBookingDetailComponent, { class: 'modal-lg' });
    this.bsModalRef.content
    this.bsModalRef.content.id = 0;
    this.bsModalRef.content.model = this.model;
    this.bsModalRef.content.model.Id = 0;
    this.bsModalRef.content.title = 'New Facility Booking';
    this.bsModalRef.content.facilityList = this.facilityList2;
    this.bsModalRef.content.reloadGrid.subscribe(this.searchFacilityBookings.bind(this));
  }

  reloadTime() {
    this.appointmentsData = new DataSource({
      store: new CustomStore({
        load: (options) => {
          var dxSchdeduler = options["dxScheduler"];
          this.searchModel.BookDateF = this.convertLocalTimeSearch(dxSchdeduler.startDate);
          this.searchModel.BookDateT = this.convertLocalTimeSearch(dxSchdeduler.endDate);
          // Add condition search: UserId
          this.searchModel.UserId = this.currentuser.employeeId;

          let that = this;
          return that.facilityBookingService.search(this.searchModel)
            .toPromise()
            .then(response => {
              return {
                data: this.getAponintment(response),
                totalCount: response["payload"][0] ? response["payload"][0].totalCount : 0
              }
            }).catch(error => { throw error });
        }
      })
    });
  }

  searchFacilityBookings() {
    this.reloadTime()
  }
}

