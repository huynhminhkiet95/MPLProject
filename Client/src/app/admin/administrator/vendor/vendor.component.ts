import { Component, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { BaseComponent } from "../../../_directives/base.component";
import { CommonService } from "../../../_services";
import { ModalDirective, BsModalRef, BsModalService } from "ngx-bootstrap";
import { _const } from "../../../_helpers/constants";
import { VendorPopupComponent } from "./vendor-popup/vendor-popup.component";
import { VendorService } from "../../../_services/vendor.service";
import { confirm } from "devextreme/ui/dialog";

declare var AdminLTE: any;
@Component({
  selector: "app-vendor",
  templateUrl: "./vendor.component.html",
  styleUrls: ["./vendor.component.css"]
})
export class VendorComponent extends BaseComponent {
  dataSource: any = [];
  vendorModel: any = {};
  serviceCategories: any = [];
  @ViewChild("childModal") itAdminModal: ModalDirective;
  bsModalRef: BsModalRef;
  _isAdmin: any = false;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private commonsv: CommonService,
    private modalService: BsModalService,
    private vendorSvc: VendorService
  ) {
    super(router);
  }

  ngOnInit() {
    if (this.commonsv.isAdmin(this.currentuser.roleId)) this._isAdmin = true;

    AdminLTE.init();
    this.getVendors();
  }

  getVendors() {
    this.vendorSvc.getAllVendor().subscribe(data => {
      this.dataSource = data[this.payLoad];
    });
  }

  onEditorPreparing(e) {
    if (e.parentType === "dataRow" && e.dataField === "itAdmin") {
      if (e.row.inserted == true) {
        e.editorOptions.disabled = false;
      } else {
        e.editorOptions.disabled = true;
      }
    }
  }

  deleteVendor(id) {
    var model: any = {};
    model.id = id;

    var result = confirm("Are you sure delete this row?", "Confirm Delete");
    result.done((dialogResult: any) => {
      if (dialogResult) {
        this.vendorSvc.deleteVendor(model).subscribe(
          data => {
            if (data[this.payLoad] > 0) {
              this.toastr.success("Delete Successfuly", " Delete Vendor");
              this.getVendors();
            }
          },
          error => {
            this.toastr.error(error["message"] ? error["message"] : error);
          }
        );
      }
    });
  }

  updateVendor(id) {
    this.vendorSvc.getById(id).subscribe(data => {
      let vendorModel = data[this.payLoad];

      const initialState = {
        model: vendorModel
      };

      this.bsModalRef = this.modalService.show(VendorPopupComponent, {
        class: "modal-lg",
        initialState,
        backdrop: true,
        ignoreBackdropClick: true
      });

      this.bsModalRef.content.editMode = true;

      this.bsModalRef.content.reloadGrid
        .take(1)
        .subscribe(this.getVendors.bind(this));
    });
  }

  addNewVendor() {
    this.bsModalRef = this.modalService.show(VendorPopupComponent, {
      class: "modal-lg",
      backdrop: true,
      ignoreBackdropClick: true
    });

    this.bsModalRef.content.reloadGrid
      .take(1)
      .subscribe(this.getVendors.bind(this));
  }

  hideModal() {
    this.itAdminModal.hide();
  }
}
