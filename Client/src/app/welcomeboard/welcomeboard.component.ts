import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { EmployeeService } from '../_services/employee.service';
import { UserService, AnnounceService } from '../_services';
import { Globalconst } from '../_helpers/globalvariable';
import * as moment from 'moment';
import { DxSchedulerComponent } from 'devextreme-angular';
declare var $: any;
@Component({
  selector: 'app-welcomeboard',
  templateUrl: './welcomeboard.component.html',
  styleUrls: ['./welcomeboard.component.css'],
  animations: [
    trigger('heroState', [
      // state('inactive', style({
      //   opacity: 1, transform: 'translateY(-100px) rotate(360deg)',
      //   display:'none',
      // })
      // ),
      // state('active', style({
      //   transform: 'scale(0) translateY(-100px) rotate(360deg)',
      //   opacity: 1
      // })),
      // transition('inactive => active', animate('3000ms ease-in',style({ opacity: 1, transform: 'none' }))),
      // transition('active => inactive', animate('3000ms ease-in'))
    ]),
  ]
})
export class WelcomeboardComponent implements OnInit {
  @ViewChild(DxSchedulerComponent) scheduler: DxSchedulerComponent;
  listnewEmployee: any;
  session: number = 1;
  public state = 'inactive';
  listBirth: any;
  listAnnounce: any = [];
  today: Date = new Date();
  constructor(
    private _sanitizer: DomSanitizer,
    private _empSvc: EmployeeService,
    private userSvc: UserService,
    public globals: Globalconst,
    private announceSvc: AnnounceService,
  ) {

  }

  ngOnInit() {
    this.getNewEmployee();
    this.loadStatusSummary();
    this.loadAnnouncement();
    let carousel = $('.carousel')[0];
    this.carousel(carousel);
    setInterval(() => {
      this.today = new Date();
    }, 60000);
    setInterval(() => {
      $('button.next').click();
    }, 120000);
    setInterval(() => {
      this.getNewEmployee();
      this.loadStatusSummary();
      this.loadAnnouncement();
    }, 1800000);

  }
  selectItem(item: number) {

  }
  toggleState() {
    this.state = this.state === 'active' ? 'inactive' : 'active';
  }
  myTransform(value: string): SafeStyle {

    return this._sanitizer.bypassSecurityTrustStyle(value);
  }
  carousel(root) {
    let
      figure = root.querySelector('figure'),
      nav = root.querySelector('nav'),
      images = figure.children,
      n = images.length,
      gap = root.dataset.gap || 0,
      bfc = 'bfc' in root.dataset,
      theta = 2 * Math.PI / n,
      currImage = 0;
    setupCarousel(n, parseFloat(getComputedStyle(images[0]).width));
    window.addEventListener('resize', () => {
      setupCarousel(n, parseFloat(getComputedStyle(images[0]).width));
    });

    setupNavigation();

    function setupCarousel(n, s) {
      let apothem = s / (2 * Math.tan(Math.PI / n));
      $("figure").css("transformOrigin", "50% 50%" + -apothem + "px");
      $("figure").css("height", document.body.clientHeight - 96);
      for (var i = 0; i < n; i++)
        images[i].style.padding = '${gap}px';
      for (i = 1; i < n; i++) {
        images[i].style.transformOrigin = "50% 50% " + -apothem + "px";
        let temp = i * theta;
        images[i].style.transform = "rotateY(" + temp + "rad)";
      }
      if (bfc)
        for (i = 0; i < n; i++)
          images[i].style.backfaceVisibility = 'hidden';
      rotateCarousel(currImage);
    }

    function setupNavigation() {
      nav.addEventListener('click', onClick, true);
      function onClick(e) {
        e.stopPropagation();
        var t = e.target;
        if (t.tagName.toUpperCase() != 'BUTTON')
          return;
        if (t.classList.contains('next')) {
          currImage++;
        }
        else {
          currImage--;
        }
        rotateCarousel(currImage);
      }
    }

    function rotateCarousel(imageIndex) {
      let temp2 = -(imageIndex * theta)
      figure.style.transform = "rotateY(" + temp2 + "rad)";
    }
  }
  getNewEmployee() {
    this._empSvc.getNewEmployee().subscribe(
      data => {
        this.listnewEmployee = data["payload"];
      }
    )
  }
  loadStatusSummary() {
    let model: any = {};
    model.employeeId = this.globals._userinfo.employeeId;
    model.subsidiaryId = this.globals._userinfo.subsidiaryId;
    this.userSvc.getStatusSummary(model).subscribe(
      data => {

        this.listBirth = data["payload"].status;
      },
      error => {

      }
    );
  }
  loadAnnouncement() {
    let searchModel: any = {};
    searchModel.Type = '';
    searchModel.Subject = '';
    searchModel.DateFrom = moment().subtract(20, 'days').format('YYYY/MM/DD');
    searchModel.DateTo = moment().format('YYYY/MM/DD');
    this.announceSvc.searchForDashboard(searchModel).subscribe(
      data => {
        this.listAnnounce = data["payload"];
        this.listAnnounce = this.listAnnounce.splice(0, 3);
      },
      error => {
      }
    );
  }
}
