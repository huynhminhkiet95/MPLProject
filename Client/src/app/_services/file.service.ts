import { Injectable } from '@angular/core';
import { WindowRef } from '../_helpers/windowRef'
import { Observable } from 'rxjs/Observable';
import { ApplicationHttpClient } from './_base/http-client';
@Injectable()
export class FileService {
    urlAPI: string;
    constructor(private http: ApplicationHttpClient,
        private winRef: WindowRef) {
        this.urlAPI = http._urlAPI + "/documentservice";
    }

    getById(id: number) {
        return this.http.Get(this.urlAPI + '/document/' + id).map((response: Response) => response)
            .catch(error => Observable.of({ error: true }));
    }
    getByRefNoValue(id: string) {
        return this.http.Get(this.urlAPI + '/documents/refnovalue/' + id).map((response: Response) => response);
    }
    getList(refNoType: string, refNoValue: string) {
        return this.http.Get(this.urlAPI + '/documents/' + refNoType + '/' + refNoValue).map((response: Response) => response);
    }
    create(document: FormData) {
        return this.http.Post(this.urlAPI + '/document', document).map((response: Response) => response);
    }
    creategallery(document: FormData) {
        return this.http.Post(this.urlAPI + '/document/gallery', document).map((response: Response) => response);

    }

    delete(docNo: number, userId: number) {
        return this.http.Delete(this.urlAPI + '/document/docno/' + docNo + '/userid/' + userId).map((response: Response) => response);
    }

    upload(url: string, file: File) {
        const formData: FormData = new FormData();
        if (file) {
            formData.append('files', file, file.name);
        }

        return this.http.Post(url, formData);
    }
    downloadFile(docNo) {
        this.getById(docNo).subscribe(
            data => {
                if (data["success"]) {
                    let dataR = data["payload"];
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    var blob = this.b64toBlob(dataR.filestream, dataR.dS_GetDocument_Result.fileType, 512)
                    var url = (this.winRef.nativeWindow.URL || this.winRef.nativeWindow.webkitURL).createObjectURL(blob);
                    a.href = url;
                    a.download = dataR.dS_GetDocument_Result.dFileName;
                    a.click();
                    this.winRef.nativeWindow.revokeObjectURL(url);
                }
            },
            error => {

            }
        )
    }

    downloadExcel(binary: any, filename: string) {
        var a = document.createElement("a");
        document.body.appendChild(a);
        var blob = this.b64toBlob(binary, "application/vnd.open", 512)
        var url = (this.winRef.nativeWindow.URL || this.winRef.nativeWindow.nativeWindow.webkitURL).createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        //this.winRef.nativeWindow.revokeObjectURL(url);
    }
    public dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }
    public b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }
    GetGalleryByType(type: string) {
        return this.http.Get(this.urlAPI + '/document/gallerys/' + type).map((response: Response) => response);
    }
    getDocumentWorkflow(model: any) {
        return this.http.Post(this.urlAPI + '/document/getdocumentworkflow', model).map((response: Response) => response);
    }

    copyDocuments(model: any) {
        return this.http.Post(this.urlAPI + '/copydocuments', model).map((response: Response) => response);
    }
}