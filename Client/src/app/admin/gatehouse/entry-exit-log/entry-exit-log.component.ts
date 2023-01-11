import { Component, ViewChild, ElementRef } from '@angular/core';
import { UserService, EmployeeService } from '../../../_services';
import { EntryExitLogService } from '../../../_services/entry-exit-log.service';
import { EntryExitLogModel, EntryExitLogSearchModel } from '../../../_models/baoVeScanDto';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../_directives/base.component';
import { Router } from '@angular/router';
declare var AdminLTE: any;
@Component({
  selector: 'app-entry-exit-log',
  templateUrl: './entry-exit-log.component.html',
  styleUrls: ['./entry-exit-log.component.css']
})
export class EntryExitLogComponent extends BaseComponent {

  model: any = {};
  searchModel: EntryExitLogSearchModel = new EntryExitLogSearchModel();
  employeeId: any;
  loading = true;
  entryExitLogModel: EntryExitLogModel = new EntryExitLogModel();

  constructor(
    public userService: UserService
    , public empSvc: EmployeeService
    , private toastr: ToastrService
    , public entryExitLogService: EntryExitLogService
    , public router: Router
  ) {
    super(router);
  }

  ngOnInit() {
    AdminLTE.init()
  }

  search() {
    if (this.searchModel.vehicleNo != "") {
      this.empSvc.search(this.searchModel).subscribe(
        data => {
          this.entryExitLogModel = data[this.payLoad][0] || {};
          if (data[this.payLoad].length > 0) {
            this.loading = false;
            if (this.model.autosave) {
              this.insert(this.model.mode);
            }
          }
          else if (this.loading == false) {
            this.loading = true;
          }
          $('#vehicleNoS').val($('#vehicleNoS').val() + " ");
          $('#vehicleNoS').select();
        }
      );
    }
  }

  insert(mode) {
    this.entryExitLogModel.mode = mode;
    this.entryExitLogModel.equipmentNo = this.entryExitLogModel.vehicleNo;
    this.entryExitLogModel.createDate = new Date();
    this.entryExitLogModel.createUser = this.currentuser.employeeId;

    this.entryExitLogService.insert(this.entryExitLogModel).subscribe(
      data => {
        if (data["sucess"] = true) {
          this.toastr.success("Insert successfuly", "Entry Exit Log");
        } else {
          this.toastr.error("Error: This data already exists !!", "Entry Exit Log");
        }
      },
      error => {
        this.toastr.error("Insert failed", "Entry Exit Log");
      }
    )
  }

  init() {
    this.currentuser = JSON.parse(localStorage.getItem('currentUser'));
    var BarcodesScanner = {
      barcodeData: '',
      deviceId: '',
      symbology: '',
      timestamp: 0,
      dataLength: 0,
      tmpTimestamp: 0,
      tmpData: ''
    };

    function onScannerNavigate(barcodeData, deviceId, symbology, timestamp, dataLength) {
      BarcodesScanner.barcodeData = barcodeData;
      BarcodesScanner.deviceId = deviceId;
      BarcodesScanner.symbology = symbology;
      BarcodesScanner.timestamp = timestamp;
      BarcodesScanner.dataLength = dataLength;
      $(BarcodesScanner).trigger('scan');
    }

    BarcodesScanner.tmpTimestamp = 0;
    BarcodesScanner.tmpData = '';
    $(document).on('keypress', function (e) {
      e.stopPropagation();
      var keycode = (e.keyCode ? e.keyCode : e.which);
      if (BarcodesScanner.tmpTimestamp < Date.now() - 500) {
        BarcodesScanner.tmpData = '';
        BarcodesScanner.tmpTimestamp = Date.now();
      }
      if (keycode == 49 && BarcodesScanner.tmpData.length > 0) {
        onScannerNavigate(BarcodesScanner.tmpData, 'FAKE_SCANNER', 'WEDGE', BarcodesScanner.tmpTimestamp, BarcodesScanner.tmpData.length);
        BarcodesScanner.tmpTimestamp = 0;
        BarcodesScanner.tmpData = '';
      } else if (e.charCode && e.charCode > 0) {
        BarcodesScanner.tmpData += String.fromCharCode(e.charCode);
      }
    });
  }
}
