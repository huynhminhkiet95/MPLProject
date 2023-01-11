import { Component, ViewChild, OnInit } from '@angular/core';
import { DxSchedulerComponent } from 'devextreme-angular';
import Query from 'devextreme/data/query';
import { FacilityBookingService, CommonService } from '../../_services';
import { Resource, Appointment } from '../../_models';
import * as moment from 'moment';
@Component({
  selector: 'app-todaybookingroom',
  templateUrl: './todaybookingroom.component.html',
  styleUrls: ['./todaybookingroom.component.css']
})
export class TodaybookingroomComponent implements OnInit {

  @ViewChild(DxSchedulerComponent) scheduler: DxSchedulerComponent;

  currentDate = moment(new Date()).add(1, "day").local(true)["_d"];
  theatreData: TheatreData[];
  facilityList: any;
  searchModel: any = {};
  appointmentData = [];

  constructor(public facilityBookingService: FacilityBookingService, private commonSvc: CommonService, ) {
  }
  ngOnInit() {
    this.searchModel.BookDateF = moment().format('MM/DD/YYYY');
    this.searchModel.BookDateT = moment().format('MM/DD/YYYY');
    this.searchModel.FacilityCode = "";
    this.searchModel.SubsidiaryId = "S1";


    this.commonSvc.getFacilities("S1").subscribe(
      data => {
        this.facilityList = data["payload"];
        let temp = [];
        this.facilityList.forEach(element => {
          if (element.facilityGroup == 'MTROOM') {
            var item = new TheatreData();
            item.id = element.facilityCode;
            item.text = element.facilityDesc
            temp.push(item);
          }
        });
        this.theatreData = temp;
        this.getBooking();
      }
    );
    setTimeout(() => {
      this.currentDate = new Date();

    }, 1000);
    // setInterval(() => {
    //   this.getBooking();
    // }, 1800000);

  }
  getBooking() {
    this.facilityBookingService.search(this.searchModel).subscribe(
      data => {
        let temp = [];
        
        data['payload'].forEach(element => {
          var appointment = new Appointment();
          appointment.text = element.bookSubject;
          appointment.description = element.bookMemo;
          appointment.startDate = this.convertLocalTimeDate(element.bookDateStart);
          appointment.endDate = this.convertLocalTimeDate(element.bookDateTo);
          appointment.facilityCode = element.facilityCode;
          appointment.id = element.fbId;
          appointment.description = element.bookMemo;
          appointment.createName = element.createName;
          appointment.GroupCode = element.facilityDesc;
          temp.push(appointment);

        });
        this.appointmentData = temp;
        this.scheduler.instance.getDataSource().reload();
      }
    );
  }
  onAppointmentFormCreated(data) {
    var that = this,
      form = data.form;
    // movieInfo = that.getMovieById(data.appointmentData.movieId) || {},
    // startDate = data.appointmentData.startDate;
    form.option("items", [
      {
        dataField: "startDate",
        editorType: "dxDateBox",

      }, {
        name: "endDate",
        dataField: "endDate",
        editorType: "dxDateBox",

      }, {
        dataField: "price",
        editorType: "dxRadioGroup",

      }]);
  }

  getFacilities() {

    let temp: TheatreData[] = [];
    this.commonSvc.getFacilities("S1")
      .toPromise()
      .then(response => {
        this.facilityList = response["payload"];
        this.facilityList.forEach(element => {
          var item = new TheatreData();
          item.id = element.facilityCode;
          item.text = element.facilityDesc
          temp.push(item);
        });
      }).catch(error => { throw error });


    return temp;
  }
  getAponintment(response) {
    var appointmentsJson = [];
    var data = response["payload"];
    var totalCount = data.length;
    if (totalCount > 0) {
      data.forEach(element => {
        var appointment = new Appointment();
        appointment.text = element.bookSubject;
        appointment.startDate = element.bookDateStart;
        appointment.endDate = element.bookDateTo;
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
        resource.color = '#' + Number(Math.random() * 0xffffff).toString(16)
        //appointmentsJson.push(resource);
      });
    }
    return appointmentsJson;
  }
  searchFacilityBookings() {
    this.searchModel.BookDateF = moment().format('MM/DD/YYYY');
    this.searchModel.BookDateT = moment().format('MM/DD/YYYY');
    this.searchModel.SubsidiaryId = "S1";
    this.searchModel.FacilityCode = "";
    let that = this;
    return that.facilityBookingService.search(this.searchModel).subscribe(
      data => {
        this.appointmentData = data["payload"];
      },

      error => {

      }
    );
  }
  convertLocalTimeSearch(localtime) {
    var localTime1 = moment.utc(localtime);
    return moment().format('MM/DD/YYYY');
  }
  convertLocalTimeDate(localtime) {
    var localTime1 = moment.utc(localtime);
    return moment(localTime1).local(true)["_d"];
  }

}
export class TheatreData {
  text: string;
  id: number;
}