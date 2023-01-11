import { Component, OnInit, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment';
import { Globalconst } from '../../_helpers/globalvariable';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { colors } from '../../_helpers/colors';
import { UserService, FileService, ApplyLeaveService, EmployeeService, AuthenticationService } from '../../_services/index';
import { EmployeeComponent } from '../employee/employee.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import 'rxjs/add/operator/take';
import { FacilityBookingService, CommonService } from '../../_services/index';
import { UserprofileViewdetailComponent } from '../user-profile/userprofile-viewdetail/userprofile-viewdetail.component';
import { AnnounceService } from '../../_services/announce.service';
import { _const } from '../../_helpers/constants';
import { AnnouncePopupComponent } from '../announce/announce-popup/announce-popup.component';
import { Router, ActivatedRoute } from '@angular/router';
import { HolidaySubsidiary } from '../../_services/holiday-subsidiary.service';
import * as $ from 'jquery';
import 'jqueryui';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { OnlineTrainingService } from '../../_services/onlinetraining.service';
import { OnlineTrainingDetailComponent } from '../online-training/online-training-detail/online-training-detail.component';
import { BaseComponent } from '../../_directives/base.component';
import { BasePopupComponent } from '../../_directives/base.popup.component';

declare var AdminLTE: any;
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent extends BasePopupComponent {
  bsModalRef: BsModalRef;
  bsModalRef2: BsModalRef;
  userInfo: any = {};
  listItService: any = {};
  searchItserviceModel: any;
  listAnnounce: any = [];
  view: string = "week";
  viewDate: Date = new Date();
  listSubsidiaries: any = [];
  model: any = {};
  newsView: any = {};
  excludeDays: number[] = [0];
  searchModel: any = {};
  events: CalendarEvent[] = [];
  events2: CalendarEvent[] = [];
  events3: CalendarEvent[] = [];
  events4: CalendarEvent[] = [];
  bsRangeValue: any = [];
  facilityList: any = [];
  languages: any = [];
  statusSummary: any = {};
  listBirth: any = [];
  listPendingApproval: any = {};
  leaveOndesk: any = {};
  listnewEmployee: any = [];
  math: Math;
  commentType: any = "ONTRAIN";
  listTrainings: any = [];
  contents: any;
  listLogs: any;
  constructor(
    public globals: Globalconst,
    private announceSvc: AnnounceService,
    private modalService: BsModalService,
    private userSvc: UserService,
    private fileSvc: FileService,
    public facilityBookingService: FacilityBookingService,
    private commonSvc: CommonService,
    private authenSvc: AuthenticationService,
    public router: Router,
    private svleave: ApplyLeaveService,
    private emplsv: EmployeeService,
    private holidaysv: HolidaySubsidiary,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    public onlineTrainingSrv: OnlineTrainingService
  ) {
    super();
    this.math = Math;
    this.languages = globals._resources || {};
    this.userInfo = globals._userinfo || {};

    this.searchItserviceModel = {
      Details: "",
      ISRNo: "",
      ITService: "",
      PostDateF: moment(new Date(2018, 1, 1)).format(
        _const.DATE_FORMAT.mm_dd_yyyy
      ),
      PostDateT: moment().format(_const.DATE_FORMAT.mm_dd_yyyy),
      SvcType: "",
      CreateUserName: "",
      Subject: "",
      SubsidiaryId: "",
      Subsidiary: "",
      Status: "",
      ServiceType: "",
      CreatedUser: "",
      SkipRecord: 0,
      TakeRecord: 10,
      SortColumn: "ISRNo",
      SortOrder: "DESC"
    };

    this.bsRangeValue = [new Date(), moment().add(7, "days")["_d"]];
    this.searchModel = {
      BookDateF: moment()
        .startOf("week")
        .format(_const.DATE_FORMAT.mmddyyyy),
      BookDateT: moment()
        .endOf("week")
        .format(_const.DATE_FORMAT.mmddyyyy),
      SubsidiaryId: this.userInfo.subsidiaryId,
      FacilityCode: "",
      UserId: this.userInfo.employeeId,
      WorkLocId:this.userInfo.workingLocation

    };

    setTimeout(() => {
      this.getHolidayCalendar();
    }, 300);

    this.getAponintment();
    this.getDivisionleave();
  }

  ngOnInit() {
    let updatePass = this.route.snapshot.queryParams["updatePass"] || false;
    if (updatePass) {
      setTimeout(() =>
        this.toastr.warning(
          "Your's password is still use defaull,please change it to continue",
          "Change default password!"
        )
      );
      setTimeout(() => this.router.navigate(["intranet/userprofile"]), 3000);
    }

    AdminLTE.init();
    this.loadAnnouncement();
    this.loadStatusSummary();
    this.countPenddingRequest();
    this.getNewEmployee();
    this.searchOnlineTraining();
  }

  getday(date) {
    var result = date.getDay();
    return result;
  }

  endFirstWeek(firstDate, firstDay) {
    if (!firstDay) {
      return 7 - firstDate.getDay();
    }
    if (firstDate.getDay() < firstDay) {
      return firstDay - firstDate.getDay();
    } else {
      return 7 - firstDate.getDay() + firstDay;
    }
  }

  convertLocalTimeSearch(localtime) {
    var localTime1 = moment.utc(localtime);
    return moment(localTime1).format(_const.DATE_FORMAT.mmddyyyy);
  }

  convertLocalTimeDate(localtime) {
    var localTime1 = moment.utc(localtime);
    return moment(localTime1).local(true)["_d"];
  }

  getAponintment() {
    this.facilityBookingService.search(this.searchModel).subscribe(
      data => {
        var datas = data[_const.API_KEYS.payload];
        var totalCount = datas.length;

        if (totalCount > 0) {
          datas.forEach(element => {
            var calendar = {
              cssClass: "my-custom-class",
              title: element.bookSubject,
              color: {
                primary: element.colorCode,
                secondary: element.colorCode
              },
              id: element.fbId,
              facilityDesc: element.facilityDesc,
              facilityCode: element.facilityCode,
              group: element.facilityGroup,
              bookBy: element.createName,
              start: this.convertLocalTimeDate(element.bookDateStart),
              end: this.convertLocalTimeDate(element.bookDateTo) // an end date is always required for resizable events to work
            };

            if (calendar.group == "MTROOM") this.events.push(calendar);
            else {
              calendar.color = colors.yellow;
              this.events2.push(calendar);
            }
          });
          this.refresh.next();
        }
      },
      error => {}
    );
  }

  refresh: Subject<any> = new Subject();

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }

  SearchEmployee() {
    this.bsModalRef = this.modalService.show(EmployeeComponent, {
      class: "modal-lg"
    });
    this.bsModalRef.content.title = "Search Employee";
    this.bsModalRef.content.listSubsidiaries = this.listSubsidiaries;
    this.bsModalRef.content.searchModel.employeeName =
      this.model.employeename || "";
    this.bsModalRef.content.viewDetailUser
      .take(1)
      .subscribe(this.ViewUserProfile.bind(this));
  }

  searchEmployee() {
    this.router.navigate([
      { outlets: { modal: ["employeesearch", this.model.employeename] } }
    ]);
  }

  SearchAnnouncement() {
    this.bsModalRef = this.modalService.show(AnnouncePopupComponent, {
      class: "modal-lg"
    });
    this.bsModalRef.content.title = "Search Announcement";
    this.bsModalRef.content.listSubsidiaries = this.listSubsidiaries;
  }

  searchAnnouncement() {
    this.router.navigate([{ outlets: { modal: ["announcementsearch"] } }]);
  }

  ViewUserProfile(id: any) {
    this.authenSvc.getUserInfoById(id).subscribe(
      data => {
        this.bsModalRef.content.viewDetailUser
          .take(1)
          .subscribe(this.ViewUserProfile.bind(this));
        this.bsModalRef2 = this.modalService.show(
          UserprofileViewdetailComponent,
          { class: "modal-lg second" }
        );
        this.bsModalRef2.content.model = data[_const.API_KEYS.payload].userInfo;
        this.bsModalRef2.content.subsidiary =
          data[_const.API_KEYS.payload].userSubsidiary[0];

        this.fileSvc
          .getById(data[_const.API_KEYS.payload].userInfo.docNo)
          .subscribe(
            data => {
              if (
                data[_const.API_KEYS.payload] &&
                data[_const.API_KEYS.payload].filestream != null
              ) {
                let avatar =
                  "data:" +
                  data[_const.API_KEYS.payload].dS_GetDocument_Result.fileType +
                  ";base64," +
                  data[_const.API_KEYS.payload].filestream;
                this.bsModalRef2.content.avatar = avatar;
              }
            },
            error => {}
          );
      },
      error => {}
    );
  }

  openNewsModel(template: TemplateRef<any>, news: any) {
    this.announceSvc.getById(news.annId, this.globals._userinfo.employeeId).subscribe(data => {
      this.newsView = data[_const.API_KEYS.payload].announInfo;
      this.newsView.contents = this.sanitizer.bypassSecurityTrustHtml(
        this.newsView.contents
      );
      this.newsView.listDocs = data[_const.API_KEYS.payload].listDoc;
      this.newsView.viewCount = data[_const.API_KEYS.payload].viewCount; 
      this.bsModalRef = this.modalService.show(template);
    });
  }

  loadAnnouncement() {
    let searchModel: any = {};
    searchModel.EmployeeId = this.currentuser.employeeId;
    searchModel.Type = "";
    searchModel.Subject = "";
    searchModel.DateFrom = moment()
      .subtract(20, "days")
      .format(_const.DATE_FORMAT.yyyymmdd);
    searchModel.DateTo = moment().format(_const.DATE_FORMAT.yyyymmdd);

    this.announceSvc.searchForDashboard(searchModel).subscribe(
      data => {
        this.listAnnounce = data[_const.API_KEYS.payload];
      },
      error => {}
    );
  }

  loadStatusSummary() {
    let model: any = {};
    model.employeeId = this.globals._userinfo.employeeId;
    model.subsidiaryId = this.globals._userinfo.subsidiaryId;

    this.userSvc.getStatusSummary(model).subscribe(
      data => {
        this.statusSummary = data[_const.API_KEYS.payload];
        this.statusSummary.leaveTotal = 0.0;
        this.statusSummary.remainTotal = 0.0;
        this.statusSummary.leaveList.forEach(d => {
          this.statusSummary.leaveTotal += d.leaveDays;
          if(d.remains>0){
            this.statusSummary.remainTotal += d.remains;
          }
        });
        this.listBirth = data[_const.API_KEYS.payload].status;
      },
      error => {}
    );
  }

  countPenddingRequest() {
    this.commonSvc
      .getPendingRequest(this.userInfo.subsidiaryId, this.userInfo.employeeId)
      .subscribe(
        data => {
          this.listItService.list = data[_const.API_KEYS.payload];
          this.listItService.total = 0;
          this.listItService.list.forEach(d => {
            this.listItService.total += d.cnt;
          });
        },
        error => {}
      );

    this.commonSvc.getpendingapproval(this.userInfo.employeeId).subscribe(
      data => {
        this.listPendingApproval.list = data[_const.API_KEYS.payload];
        this.listPendingApproval.total = 0;
        this.listPendingApproval.list.forEach(d => {
          this.listPendingApproval.total += d.count;
        });
      },
      error => {}
    );
  }

  downloadFile(docNo) {
    this.fileSvc.downloadFile(docNo);
  }

  getDivisionleave() {
    let model = {
      LDateF: moment()
        .startOf("week")
        .format(_const.DATE_FORMAT.yyyymmdd),
      LDateT: moment()
        .endOf("week")
        .format(_const.DATE_FORMAT.yyyymmdd),
      Division: this.userInfo.divisionCode
    };

    this.svleave.getDivisionleave(model).subscribe(
      data => {
        var datas = data[_const.API_KEYS.payload].leaves;
        this.leaveOndesk = data[_const.API_KEYS.payload].leaveDesk;
        var totalCount = datas.length;

        if (totalCount > 0) {
          datas.forEach(element => {
            var calendar = {
              cssClass: "my-custom-class",
              title: element.employeeName,
              color: colors.yellow,
              id: element.lvNo,
              employeeName: element.employeeName,
              employeeCode: element.employeeCode,
              divisionDesc: element.divisionDesc,
              leaveType: element.leaveType,
              leaveDays: element.leaveDays,
              marker: element.marker,
              start: this.convertLocalTimeDate(element.fromDate),
              end: this.convertLocalTimeDate(element.toDate) // an end date is always required for resizable events to work
            };

            this.events3.push(calendar);
          });
          this.refresh.next();
        }
      },
      error => {}
    );
  }

  Showpopupondesk(id: string) {
    this.router.navigate([{ outlets: { modal: ["ondesk", id] } }]);
  }

  getNewEmployee() {
    this.emplsv.getNewEmployee().subscribe(data => {
      this.listnewEmployee = data[_const.API_KEYS.payload];
    });
  }

  private getHolidayCalendar() {
    let model = {
      SubsidiaryId: this.userInfo.subsidiaryId,
      HDateF: moment()
        .startOf("week")
        .format(_const.DATE_FORMAT.yyyy_mm_dd),
      HDateT: moment()
        .endOf("week")
        .format(_const.DATE_FORMAT.yyyy_mm_dd)
    };
    var datef: number = 0;
    var datet: number = 0;

    this.holidaysv.search(model).subscribe(data => {
      data[_const.API_KEYS.payload].forEach(element => {
        datef = new Date(element.hDateF).getDate();
        datet = new Date(element.hDateT).getDate();
        for (let index = datef; index < datet + 1; index++) {
          $(".holiday" + index + "").css("background-color", "red");
          $(".holiday" + index + "").attr("title", element.holidaySubject);
        }
      });
    });
  }
  searchOnlineTraining() {
    this.onlineTrainingSrv
      .search({
        Subject: "",
        Type: "",
        DateTo: "2021-03-20",
        DateFrom: "2020-03-06"
      })
      .subscribe(data => {
        this.listTrainings = data["payload"];
      });
  }
  showOnlineDetail(item) {}
  
  async showContentModal(news: any) {
    var comments = await this.commonSvc.getGenerateComment(
      news.id,
      this.commentType
    );

    this.onlineTrainingSrv.getById(news.id, this.globals._userinfo.employeeId).subscribe(data => {
      this.contents = data["payload"].onlineTraining.contents

      this.listLogs = comments["payload"];

      const initialState = {
        subject: data["payload"].onlineTraining.subject,
        contents: this.contents
      };

      this.bsModalRef = this.modalService.show(OnlineTrainingDetailComponent, {
        class: "modal-lg",
        initialState,
        backdrop: true,
        ignoreBackdropClick: true
      });
     
      this.newsView = data["payload"].onlineTraining;
      this.newsView.listDocs = data["payload"].listDoc;
      this.newsView.viewCount = data["payload"].viewCount;
      this.newsView.isDashboard = true;
      this.bsModalRef.content.newsView = this.newsView;
      this.bsModalRef.content.listLogs = this.listLogs;
    });
  }
}