import { Component, EventEmitter, Output } from "@angular/core";
import { BaseComponent } from "../../../../_directives/base.component";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CommonService } from "../../../../_services";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { VendorService } from "../../../../_services/vendor.service";

@Component({
  selector: "app-vendor-popup",
  templateUrl: "./vendor-popup.component.html",
  styleUrls: ["./vendor-popup.component.css"]
})
export class VendorPopupComponent extends BaseComponent {
  title: any = 'Add New Vendor';
  dataSource: any = [];
  vendorModel: any = {};
  serviceCategories: any = [];
  editMode: any = false;
  @Output() reloadGrid: EventEmitter<any> = new EventEmitter();

  constructor(
    public router: Router,
    private toastr: ToastrService,
    public bsModalRef: BsModalRef,
    private commonSvc: CommonService,
    private vendorSvc: VendorService,
    public modalService: BsModalService
  ) {
    super(router);
    if (modalService.config["initialState"] != null) {
      this.vendorModel = modalService.config["initialState"].model || {};
    }
    
    if(this.editMode) this.title = 'Update Vendor';
  }

  ngOnInit() {
    this.getStdcodes();
  }

  getStdcodes() {
    this.commonSvc.getStdcodesByCode("SVRTYPE").subscribe(data => {
      this.serviceCategories = data["payload"];
    });
  }

  saveVendor() {
    if (
      this.vendorModel.vendorName == "" ||
      this.vendorModel.vendorName == undefined
    ) {
      this.toastr.info("Vendor name can not be empty", "Insert Vendor");
      return;
    }

    if (this.editMode) {
      this.vendorModel.updateUser = this.currentuser.employeeId;

      this.vendorSvc.updateVendor(this.vendorModel).subscribe(
        data => {
          if (data[this.payLoad] > 0) {
            this.toastr.success("Update Successfuly", "Update Vendor");
            this.reloadGrid.emit(null);
            this.hideModal();
          } else {
            this.toastr.error("Error: Update Failed !!", "Update Vendor");
          }
        },
        error => {
          this.toastr.error(error["message"] ? error["message"] : error);
        }
      );
    } else {
      this.vendorModel.createUser = this.currentuser.employeeId;

      this.vendorSvc.insertVendor(this.vendorModel).subscribe(
        data => {
          if (data[this.payLoad] > 0) {
            this.toastr.success("Insert Successfuly", "Insert Vendor");
            this.reloadGrid.emit(null);
            this.hideModal();
          } else {
            this.toastr.error("Error: Insert Failed !!", "Insert Vendor");
          }
        },
        error => {
          this.toastr.error(error["message"] ? error["message"] : error);
        }
      );
    }
  }

  hideModal() {
    this.bsModalRef.hide();
  }
}
