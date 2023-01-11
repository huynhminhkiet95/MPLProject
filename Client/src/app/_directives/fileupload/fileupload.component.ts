import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { FileService } from '../../_services/file.service';
import { Globalconst } from '../../_helpers/globalvariable';
import { AngularCropperjsComponent } from 'angular-cropperjs';
import * as Cropper from 'cropperjs/dist/cropper';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ViewImageComponent } from '../view-image/view-image.component';
@Component({
    selector: 'app-fileupload',
    templateUrl: './fileupload.component.html',
    styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {
    errors: Array<string> = [];
    files: File[] = [];
    files2: any = [];
    url: any;
    config: any = {};
    @ViewChild('angularCropper') public angularCropper: AngularCropperjsComponent;
    dragAreaClass: string = 'dragarea';
    @Input() projectId: number;
    @Input() sectionId: number;
    @Input() fileExt: string = "JPG, GIF, PNG, PDF, DOC, DOCX, XLSX, XLS,JPEG,PPTX,PPT,MSG,TIF,TXT";
    @Input() maxFiles: number = 5;
    @Input() maxSize: number = 10; // 2MB
    @Input() isVatar: boolean = false;
    @Output() uploadStatus = new EventEmitter();
    @Input() refNoType: string;
    @Input() refNoValue: string;
    @Input() autoSave: boolean = false;
    _userId: string;
    bsModalRef: BsModalRef;
    constructor(private fileService: FileService, public globals: Globalconst, private modalService: BsModalService, ) { }

    ngOnInit() {
        this.config = {
            checkCrossOrigin: false,
            viewMode: 0,
            modal: true,
            guides: true
        };
    }
    onFileChange(event) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();

            reader.onload = (event: any) => {
                this.url = event.target.result;
                if (this.isVatar) {
                    this.angularCropper.imageUrl = this.url;
                    this.angularCropper.cropper.destroy();
                    this.angularCropper.cropper = new Cropper(this.url, this.config);
                }

            }

            reader.readAsDataURL(event.target.files[0]);
        }
        let files = event.target.files;
        this.getListFiles(files);
        if (this.autoSave)
            this.autoSaveFile();

    }

    @HostListener('dragover', ['$event']) onDragOver(event) {
        this.dragAreaClass = "droparea";
        event.preventDefault();
    }

    @HostListener('dragenter', ['$event']) onDragEnter(event) {
        this.dragAreaClass = "droparea";
        event.preventDefault();
    }

    @HostListener('dragend', ['$event']) onDragEnd(event) {
        this.dragAreaClass = "dragarea";
        event.preventDefault();
    }

    @HostListener('dragleave', ['$event']) onDragLeave(event) {
        this.dragAreaClass = "dragarea";
        event.preventDefault();
    }
    @HostListener('drop', ['$event']) onDrop(event) {
        this.dragAreaClass = "dragarea";
        event.preventDefault();
        event.stopPropagation();
        var files = event.dataTransfer.files;
        this.getListFiles(files);
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            var reader = new FileReader();

            reader.onload = (event: any) => {
                this.url = event.target.result;
            }

            reader.readAsDataURL(event.dataTransfer.files[0]);
        }
        if (this.autoSave)
            this.autoSaveFile();
    }
    getListFiles(files) {
        if (this.isVatar) {
            this.files = [];
            this.files.push(files[0]);
        }
        else {
            for (var j = 0; j < files.length; j++) {
                this.files.push(files[j]);
            }
        }
    }

    // saveFiles(files){
    //   this.errors = []; // Clear error
    //   // Validate file size and allowed extensions
    //   if (files.length > 0 && (!this.isValidFiles(files))) {
    //       this.uploadStatus.emit(false);
    //       return;
    //   }  

    //   if (files.length > 0) {
    //         let formData: FormData = new FormData();
    //         for (var j = 0; j < files.length; j++) {
    //             formData.append("file[]", files[j], files[j].name);
    //         }
    //         var parameters = {
    //             projectId: this.projectId,
    //             sectionId: this.sectionId
    //         }
    //         this.fileService.upload(formData, parameters)
    //             .subscribe(
    //             success => {
    //               this.uploadStatus.emit(true);
    //               console.log(success)
    //             },
    //             error => {
    //                 this.uploadStatus.emit(true);
    //                 this.errors.push(error.ExceptionMessage);
    //             }) 
    //     } 
    // }


    public isValidFiles() {
        // Check Number of files
        this.errors = [];
        if (this.files.length > this.maxFiles) {
            this.errors.push("Error: At a time you can upload only " + this.maxFiles + " files");
            return;
        }
        this.isValidFileExtension(this.files);
        return this.errors.length === 0;
    }

    private isValidFileExtension(files) {
        // Make array of file extensions
        var extensions = (this.fileExt.split(','))
            .map(function (x) { return x.toLocaleUpperCase().trim() });

        for (var i = 0; i < files.length; i++) {
            // Get file extension
            var ext = files[i].name.toUpperCase().split('.').pop() || files[i].name;
            // Check the extension exists
            var exists = extensions.includes(ext);
            if (!exists) {
                this.errors.push("Error (Extension): " + files[i].name);
            }
            // Check file size
            this.isValidFileSize(files[i]);
        }
    }


    private isValidFileSize(file) {
        var fileSizeinMB = file.size / (1024 * 1000);
        var size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
        if (size > this.maxSize)
            this.errors.push("Error (File Size): " + file.name + ": exceed file size limit of " + this.maxSize + "MB ( " + size + "MB )");
    }
    SaveFile(doc) {
        if (this.isValidFiles()) {
            let formData: FormData = new FormData();
            formData.append('docRefType', doc.IDR);
            formData.append('refNoType', doc.IDR);
            formData.append('refNoValue', doc.refNoValue);
            formData.append('createUser', doc.employeeId);
            formData.append('userId', doc.employeeId);
            if (this.isVatar) {
                if (this.angularCropper) {
                    var blob = this.angularCropper.cropper.getCroppedCanvas().toDataURL();
                    formData.append('files', this.fileService.dataURLtoFile(blob, "avatar.jpg"), "avatar.jpg");
                }
                else {
                    formData.append("files", this.files[0], "avatar.jpg");
                }
                if (doc.IDR == "GAL") {
                    return this.fileService.creategallery(formData).map((response: Response) => response);
                }
                else {
                    return this.fileService.create(formData).map((response: Response) => response);
                }

            }
            else {
                for (let file of this.files) {
                    if (file) {
                        formData.append("files", file, file.name);

                    };
                }
                if (doc.IDR == "GAL") {
                    return this.fileService.creategallery(formData).map((response: Response) => response);
                }
                else {
                    return this.fileService.create(formData).map((response: Response) => response);
                }
            }
        }
        else {
                
                return null;
        }
    }
    autoSaveFile() {
        if (this.isValidFiles) {
            var reader = new FileReader();
            let formData: FormData = new FormData();
            for (let file of this.files) {
                if (file) {
                    formData.append("files", file, file.name);
                };
            }

            formData.append('docRefType', this.refNoType);
            formData.append('refNoType', this.refNoType);
            formData.append('refNoValue', this.refNoValue);
            formData.append('createUser', this._userId);
            return this.fileService.create(formData).map((response: Response) => response).subscribe(
                data => {
                    if (data["success"]) {
                        let filenew: any = {};
                        filenew.dFileName = this.files[0].name;
                        filenew.docNo = data["payload"];
                        this.files2.push(filenew);
                        this.files = [];
                    }
                }
            );
        }
    }
    ReturnNameFile() {
        let rs = [];
        var reader = new FileReader();
        let formData: FormData = new FormData();
        for (let file of this.files) {
            if (file) {
                rs.push(file.name)
            };
        }
        return rs;
    }
    private deleteFile(file) {
        const index: number = this.files.indexOf(file);
        if (index !== -1) {
            this.files.splice(index, 1);
        }
    }
    private deleteFileOnserver(file) {
        const index: number = this.files2.indexOf(file);
        if (index !== -1) {
            this.files2.splice(index, 1);
        }
        let employeeId = this.globals._userinfo.employeeId;
        this.fileService.delete(file.docNo, employeeId).subscribe(
            data => {

            },
            error => {

            }
        );
    }
    downloadFile(docNo) {
        this.fileService.downloadFile(docNo);
    }
    setFile(file) {
        this.files2 = file;
        this.files = [];
    }

    getFile(refNovalue: string, refNoType: string) {
        this.fileService.getList(refNoType, refNovalue).subscribe(
            data => {
                this.files2 = data['payload'];
            }
        );
    }
    getFile2() {
        this.fileService.getList(this.refNoType, this.refNoValue).subscribe(
            data => {
                this.files2 = data['payload'];
            }
        );
    }
    canDelete(file) {

        return this.globals._userinfo.employeeId == file.createUser;
    }
    cropImage() {
        var d = this.angularCropper.cropper.getCroppedCanvas().toDataURL();
        alert();
    }
    viewImage(docNo) {
        const initialState = {
            docNo: docNo
        };
        this.bsModalRef = this.modalService.show(ViewImageComponent, Object.assign({}, { class: 'modal-lg', initialState }));
    }
    isImage(item) 
    {
        if (item.fileType == 'image/jpeg' || item.fileType == 'image/gif' || item.fileType == 'image/png' || item.fileType == 'image/jpg')
            return true;
        else return false;
    }
}