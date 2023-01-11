import { Component, OnInit } from '@angular/core';
import { FileService } from '../../_services';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.css']
})
export class ViewImageComponent implements OnInit {
  title=""
  imageSrc: any;
  docNo: any;
  constructor(
    public fileSVC: FileService,
    private modalService: BsModalService) {
    if (modalService.config["initialState"]) {
      this.docNo = modalService.config["initialState"].docNo;
      this.downloadFile(this.docNo)
    }
  }

  ngOnInit() {
    this.imageSrc = 'data:image/png;base64,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';
  }
  downloadFile(docNo) {
    this.fileSVC.getById(docNo).subscribe(
      data => {
        if (data["payload"] && data["payload"].filestream != null) {
          this.imageSrc = 'data:' + data["payload"].dS_GetDocument_Result.fileType + ';base64,' + data["payload"].filestream;
        }
      }
    );

  }
  close() {
    this.modalService.hide(1);
  }
  hidemodal() {
    this.modalService.hide(1);
  }
}
