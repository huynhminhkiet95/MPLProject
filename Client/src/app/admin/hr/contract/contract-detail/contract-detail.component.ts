import { Component, OnInit, Output, EventEmitter, ViewChild, Compiler, ComponentFactoryResolver, ComponentRef, ModuleWithComponentFactories, ViewContainerRef, NgModule, ComponentFactory } from '@angular/core';
import { BaseComponent } from '../../../../_directives/base.component';
import { Globalconst } from '../../../../_helpers';
import { CommonService, FileService, EmployeeService, SSOUserProfileService, AuthenticationService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import * as moment from 'moment';
import { FileuploadComponent } from '../../../../_directives/fileupload/fileupload.component';
import { ContractDto } from '../../../../_models/ContractDto';
import { ContractService } from '../../../../_services/contract.service';
import { EContractDetailComponent } from '../e-contract-detail/e-contract-detail.component';
import { confirm } from 'devextreme/ui/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { RemovewhitespacesPipe } from '../../../../_directives/share-modules/upperandremovespace';
import { _const } from '../../../../_helpers/constants';
import { EnumMPLSystem } from '../../../../_helpers/enums';

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.css']
})
export class ContractDetailComponent extends BaseComponent {

  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;
  @ViewChild("assetUploadFile") public fileUpload: FileuploadComponent;
  @Output() reloadGrid: EventEmitter<any> = new EventEmitter()

  model: ContractDto = new ContractDto();
  modelContract: any = {};
  contractDate: Date = new Date();
  expiredDate: Date = new Date();
  listEmployer: any = [];
  contractTypes: any = [];
  econtractTypes: any = [];
  assets: any;
  editMode = false;
  listusers: any = [];
  dataeContract: any;
  bsModalRefViewReport: BsModalRef;
  template: string;
  contractId: any;
  contractNo: string;
  monthlysalary: number;
  lunchallowance: number;
  rewardforworkefficiency: number;
  allowance: number;
  contractPersonId: string;

  private componentRef: ComponentRef<{}>;

  constructor(
    public router: Router,
    public modalService: BsModalService,
    public _global: Globalconst,
    private _svcContract: ContractService,
    public commonsv: CommonService,
    private toastr: ToastrService,
    public bsModalRef: BsModalRef,
    public fileSvc: FileService,
    public employeeService: EmployeeService,
    public ssoUserProfileSvc: SSOUserProfileService,
    public auThenSvc: AuthenticationService,
    private spinner: NgxSpinnerService
  ) {
    super(router);
    // this.model.contractPerson = "2";
  }

  ngOnInit() {
    this.modelContract.typelunchallowance = 'tháng';

    if (this.modalService.config["model"]) {
      this.contractId = this.modalService.config["model"].id;
      this.listusers = this.modalService.config["listusers"];
      this.listEmployer = this.modalService.config["listEmployer"];
      this.contractTypes = this.modalService.config["contractTypes"];

      if (this.modalService.config["model"].employeeId != undefined)
        this.getEmployeeById(this.modalService.config["model"].employeeId);
    }

    if (this.modalService.config["model"].id != undefined) {
      this.eContract();
      this.expiredDate = this.modalService.config["model"].expiredDate;
      this.contractDate = this.modalService.config["model"].contractDate;
      this.contractPersonId = (this.modalService.config["model"].contracPerson).toString();
    }

    this.fileSvc.getList("CONTRACT", this.modalService.config["model"].id).subscribe(
      data => {
        this.fileUpload.setFile(data[this.payLoad]);
      },
      error => {
      }
    );

    this.geteContractType();
  }

  changedeContract(data) {
    const filterPipe = new RemovewhitespacesPipe();
    var objEmployee = data.selectedItem;
    this.modelContract.fullname = objEmployee.employeeName;
    this.modelContract.birthday = objEmployee.dob;
    this.modelContract.placeofbirth = objEmployee.address || '';
    this.modelContract.idcardnumber = objEmployee.idNo;
    this.modelContract.phonenumber = objEmployee.mobile || '';
    this.modelContract.residentialaddress = objEmployee.address || '';
    this.modelContract.position = objEmployee.designation;
    this.modelContract.employeenumber = objEmployee.employeeCode;

    objEmployee.systemId = !objEmployee.systemId ? EnumMPLSystem.DEFAULT : objEmployee.systemId;
    this.ssoUserProfileSvc.getPrivateInfo(objEmployee).subscribe(
      data => {
       
        if (data[this.payLoad]) {
          this.modelContract.placeofissue = data[this.payLoad].userDetail.idPlaceofIssue;
          this.modelContract.dateofissue = data[this.payLoad].userDetail.idIssueDate;
          this.modelContract.permanentAddress = data[this.payLoad].userDetail.permanentAddress || '';
          this.modelContract.placeofbirth = data[this.payLoad].userDetail.placeofBirth;
        }
      });

    this.getEmployeeById(objEmployee.employeeId);
  }

  getEmployeeById(employeeId) {
    this.auThenSvc.getUserInfoById(employeeId).subscribe(
      data => {
        
        this.modelContract.gender = "Bà";
        if (data[this.payLoad].userInfo.gender == 'M')
          this.modelContract.gender = "Ông";
      });
  }

  isCheckValidation() {
    if (this.model.employeeId == null || this.contractDate == null || this.expiredDate == null)
      return true;

    return false;
  }

  Save() {

    if (this.isCheckValidation())
      return;

    this.model.contractDate = this.contractDate;
    this.model.expiredDate = this.expiredDate;
    this.model.contracPerson = this.contractPersonId;

    if (this.contractId === undefined) {
      this.model.createdUser = this._global._userinfo.employeeId;

      this._svcContract.insert(this.model).subscribe(
        data => {
          if (data[this.payLoad]) {
            this.saveEContract(data[this.payLoad].id, this.modelContract.econtractTypes);
            if (this.fileUpload.files.length > 0) {
              let doc: any = {};
              doc.IDR = 'CONTRACT';
              doc.refNoValue = data['payload'].id;
              doc.employeeId = this._global._userinfo.employeeId;
              this.fileUpload.SaveFile(doc).subscribe(
                data => {
                }
              );
            }
            this.reloadGrid.emit(null);
          }
        }
      );
    }else {
      this.model.updatedUser = this._global._userinfo.employeeId;
      this._svcContract.update(this.model).subscribe(
        data => {
          this.saveEContract(data[this.payLoad], this.modelContract.econtractTypes);
        }
      )
    }
  }

  Delete(id) {
    this._svcContract.delete(id).subscribe(
      data => {
        if (data['payload']) {
          this.toastr.success("Delete Sucessfull", "Update Asset Activity");
          this.reloadGrid.emit(null);
          this.bsModalRef.hide();
        }
      }
    );
  }

  toggleContract() {
    $(".econtract").slideToggle("slow");
  }

  geteContractType() {
    this.commonsv.geteContractType("").subscribe(
      data => {
        this.econtractTypes = data[this.payLoad];
      });
  }

  delay(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }

  async saveEContract(contractId, eContractType) {
    this.spinner.show();
    this.modelContract.contractPerson = this.listEmployer.find(o => o.codeId == this.model.contracPerson).codeDesc;
    this.modelContract.positionEmployer = this.listEmployer.find(o => o.codeId == this.model.contracPerson).tagVariant;
    this.modelContract.contractDate = this.model.contractDate;
    this.modelContract.expiredDate = this.model.expiredDate;
    this.modelContract.monthlysalary = this.commonsv.moneyFormat(this.monthlysalary, '');
    this.modelContract.lunchallowance = this.commonsv.moneyFormat(this.lunchallowance || 0, '');
    this.modelContract.rewardforworkefficiency = this.commonsv.moneyFormat(this.rewardforworkefficiency, '');
    this.modelContract.allowance = this.commonsv.moneyFormat(this.allowance, '');
    var template = this.econtractTypes.find(o => o.eContractType == this.modelContract.econtractTypes).eContractTemplate;

    template = template
      .replace("{{modelContract.contractDate}}", this.commonsv.convertDate(this.modelContract.contractDate))
      .replace("{{modelContract.fullname}}", this.modelContract.fullname)
      .replace("{{modelContract.position}}", this.modelContract.position)
      .replace("{{modelContract.position2}}", this.modelContract.position)
      .replace("{{modelContract.employeenumber}}", this.modelContract.employeenumber)
      .replace("{{modelContract.birthday}}", this.commonsv.convertDate(this.modelContract.birthday))
      .replace("{{modelContract.placeofbirth}}", this.modelContract.placeofbirth || '')
      .replace("{{modelContract.idcardnumber}}", this.modelContract.idcardnumber)
      .replace("{{modelContract.dateofissue}}", this.commonsv.convertDate(this.modelContract.dateofissue))
      .replace("{{modelContract.placeofissue}}", this.modelContract.placeofissue || '')
      .replace("{{modelContract.permanentAddress}}", this.modelContract.permanentAddress || '')
      .replace("{{modelContract.residentialaddress}}", this.modelContract.residentialaddress || '')
      .replace("{{modelContract.phonenumber}}", this.modelContract.phonenumber || '')
      .replace("{{modelContract.contractDate}}", this.commonsv.convertDate(this.modelContract.contractDate))
      .replace("{{modelContract.expiredDate}}", this.commonsv.convertDate(this.modelContract.expiredDate))
      .replace("{{modelContract.monthlysalary}}", this.modelContract.monthlysalary)
      .replace("{{modelContract.lunchallowance}}", this.modelContract.lunchallowance)
      .replace("{{modelContract.rewardforworkefficiency}}", this.modelContract.rewardforworkefficiency)
      .replace("{{modelContract.allowance}}", this.modelContract.allowance)
      .replace("{{modelContract.gender}}", this.modelContract.gender)
      .replace("{{modelContract.gender}}", this.modelContract.gender)
      .replace("{{modelContract.fullname}}", this.modelContract.fullname)
      .replace("{{modelContract.typelunchallowance}}", this.modelContract.typelunchallowance)
      .replace("{{modelContract.contractperson}}", this.modelContract.contractPerson)
      .replace("{{modelContract.contractperson}}", this.modelContract.contractPerson)
      .replace("{{modelContract.positionemployer}}", this.modelContract.positionEmployer)
      .replace("{{modelContract.positionemployer}}", this.modelContract.positionEmployer)

    let jSONElement: any = {
      no: this.modelContract.no,
      contractDate: this.modelContract.contractDate,
      fullname: this.modelContract.fullname,
      position: this.modelContract.position,
      typeofemployeecontract: this.modelContract.typeofemployeecontract,
      employeenumber: this.modelContract.employeenumber,
      birthday: this.modelContract.birthday,
      placeofbirth: this.modelContract.placeofbirth,
      idcardnumber: this.modelContract.idcardnumber,
      dateofissue: this.modelContract.dateofissue,
      placeofissue: this.modelContract.placeofissue,
      permanentAddress: this.modelContract.permanentAddress,
      residentialaddress: this.modelContract.residentialaddress,
      expiredDate: this.model.expiredDate,
      monthlysalary: this.monthlysalary,
      lunchallowance: this.lunchallowance,
      rewardforworkefficiency: this.rewardforworkefficiency,
      allowance: this.allowance,
      phonenumber: this.modelContract.phonenumber,
      typelunchallowance: this.modelContract.typelunchallowance
    };

    var eContactContents = template
    let model: any = {
      contractId: contractId,
      eContractType: eContractType,
      jSONElement: JSON.stringify(jSONElement),
      eContactContents: eContactContents,
      user: this._global._userinfo.employeeId,
      contractNo: this.contractNo
    }

    if (this.contractId === undefined) {
      this._svcContract.SaveeContract(model).subscribe(
        data => {

          this.toastr.success("Save contract sucessfull", "Save Contract");
          this.spinner.hide();
          this.bsModalRef.hide();
        },
        error => {
          this.toastr.error("Please contract to admin to get more detail.", "Save faild");
        }
      );
    }
    else {

      this._svcContract.UpdateeContract(model).subscribe(
        data => {
          this.toastr.success("Update contract sucessfull", "Update Contract");
          this.spinner.hide();
          this.bsModalRef.hide();
        },
        error => {
          this.toastr.error("Please contract to admin to get more detail.", "Save faild");
        }
      );
    }
  }

  eContract() {
    this._svcContract.getEContract(this.modalService.config["model"].id).subscribe(data => {
      this.dataeContract = data[this.payLoad];
      this.contractNo = this.dataeContract.contractNo;
      this.modelContract.econtractTypes = this.dataeContract.eContractType;
      this.modelContract.contractStatus = this.dataeContract.contractStatus;
      this.modelContract.verifyDate = this.dataeContract.verifyDate;

      let dataEContractJson: any = JSON.parse(this.dataeContract.jsonElement);
      Object.assign(this.modelContract, dataEContractJson);
      this.monthlysalary = dataEContractJson.monthlysalary;
      this.lunchallowance = dataEContractJson.lunchallowance;
      this.rewardforworkefficiency = dataEContractJson.rewardforworkefficiency;
      this.allowance = dataEContractJson.allowance;
    });
  }

  viewReport(data: any) {

    const initialState = {
      template: this.dataeContract.eContactContents
    };
    this.bsModalRefViewReport = this.modalService.show(EContractDetailComponent, Object.assign({}, { initialState, class: 'modal-lg', ignoreBackdropClick: true }));
  }

  ChangeContractType(event: Event) {
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    let selectElementText = selectedOptions[selectedIndex].text;
    this.modelContract.typeofemployeecontract = selectElementText;
  }

  public DownloadEContractReport() {
    this._svcContract.exportPdfById(this.contractId)
      .subscribe(
        data => {
          this.fileSvc.downloadExcel(data['payload'], this.modelContract.fullname + moment().format("YYYYMMDDHHmmss") + '.pdf');
        }
      );
  }

  valueChangeExpiredDate() {
    this.modelContract.expiredDate = this.model.expiredDate
  }

  confirm() {
    let model: any = {};
    model.contractId = this.contractId;
    model.user = this.currentuser.employeeId;

    var result = confirm("Are you sure to confirm?", 'Confirm Contract');

    result.done((dialogResult: any) => {
      if (dialogResult) {
        this._svcContract.updateStatus(model).subscribe(
          data => {
            this.toastr.success("Confirm Sucessfull!  ", "Confirm Contract");
            this.bsModalRef.hide();
            this.reloadGrid.emit(null);
          },
          error => {
            this.toastr.error("Confirm Failed!", "Confirm Contract");
          }
        )
      }
    })
  }

  verify() {
    let model: any = {};
    model.contractId = this.contractId;
    model.user = this.currentuser.employeeId;

    var result = confirm("Are you sure to verify?", 'Verify Contract');
    
    result.done((dialogResult: any) => {
      if (dialogResult) {
        this._svcContract.verifyContract(model).subscribe(
          data => {
            this.toastr.success("Verify Sucessfull!  ", "Verify Contract");
            this.bsModalRef.hide();
            this.reloadGrid.emit(null);
          },
          error => {
            this.toastr.error("Verify Failed!", "Verify Contract");
          }
        )
      }
    })
  }
}
