import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { BaseComponent } from '../../../../_directives/base.component';
import { Router } from '@angular/router';
import { FileuploadComponent } from '../../../../_directives';
import { ConfigurationDto } from '../../../../_models/configurationDto';
import { SSOCommonService, FileService } from '../../../../_services';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ThemeService } from '../../../../_theme/theme.service';
import { Theme } from '../../../../_theme/symbols';
import { Globalconst } from '../../../../_helpers';
import { SelectComponent } from 'ng2-select';
const COLORS = [
  { 'name': 'Navy', 'hex': '#447695' },
  { 'name': 'Black', 'hex': '#000000' },
  { 'name': 'Gray', 'hex': '#666666' },
  { 'name': 'Green', 'hex': '#60A917' },
  { 'name': 'Wood', 'hex': '#A0522D' },
  { 'name': 'Orange', 'hex': '#FFCD28' },
]
@Component({
  selector: 'app-configuration-generate',
  templateUrl: './configuration-generate.component.html',
  styleUrls: ['./configuration-generate.component.css']
})
export class ConfigurationGenerateComponent extends BaseComponent {
  @ViewChild('staticModal') public uploadImage: ModalDirective;

  @ViewChild(FileuploadComponent) private fileUpload: FileuploadComponent;

  @ViewChild("themeColor") public themeColor: SelectComponent;
  model: ConfigurationDto = new ConfigurationDto();
  listColor: any = [];
  logochanged: any = {}
  imageSelected: number = 0;
  colorString = "";
  public items: Array<any> = [];
  private value: any = {};
  constructor(public router: Router,
    private _commonService: SSOCommonService,
    private _fileService: FileService,
    private _toastService: ToastrService,
    private _themeService: ThemeService,
    private _global: Globalconst
  ) {
    super(router);
  }

  ngOnInit() {
    this.fileUpload.isVatar = false;
    COLORS.forEach((color: { name: string, hex: string }) => {
      this.items.push({
        id: color.hex,
        text: `<colorbox style='background-color:${color.hex};'></colorbox>${color.name} (${color.hex})`
      });
    });
    this.loadData();

  }
  loadData() {
    this._commonService.getConfiguration("S1", "GENERATE").subscribe(
      data => {
        this.model = data['payload'];
        let themeColorvalue = this.items.find(x => x.id == this.model.colortheme);
        this.model.showfloatlogo = data['payload'].showfloatlogo=='true'?true:false;
        this.themeColor.active = [themeColorvalue]
      });;
  }
  showUploadImage(selected) {
    this.imageSelected = selected;
    this.uploadImage.show();
  }
  updateImage() {
    if (this.imageSelected == 1) {
      this.logochanged.ownerlogo = this.fileUpload.files[0];
      this._fileService.upload(`${environment.urlAPIService}/documentservice/upload`, this.logochanged.ownerlogo).subscribe(
        data => {
          this.model.ownerlogo = data['location'];
          this.saveLogo("OWNERLOGO", data['location']);
          this._global._themeOption.ownerlogo = this.model.ownerlogo
        }
      );
    }
    else
      if (this.imageSelected == 2) {

        this._fileService.upload(`${environment.urlAPIService}/documentservice/upload`, this.fileUpload.files[0]).subscribe(
          data => {
            this.model.systemlogo = data['location'];
            this.saveLogo("SYSTEMLOGO", data['location']);
            this._global._themeOption.systemlogo = this.model.systemlogo
          }
        );
      }

      else
        if (this.imageSelected == 3) {

          this._fileService.upload(`${environment.urlAPIService}/documentservice/upload`, this.fileUpload.files[0]).subscribe(
            data => {
              this.model.floatlogo = data['location'];
              this.saveLogo("FLOATLOGO", data['location']);
              this._global._themeOption.floatlogo = this.model.floatlogo
            }
          );

        }
        else
          if (this.imageSelected == 4) {

            this._fileService.upload(`${environment.urlAPIService}/documentservice/upload`, this.fileUpload.files[0]).subscribe(
              data => {
                this.model.loginlogo = data['location'];
                this.saveLogo("LOGINLOGO", data['location']);
                this._global._themeOption.floatlogo = this.model.loginlogo
              }
            );

          }
    this.fileUpload.files = [];
    this.fileUpload.url = null;
    this.uploadImage.hide();
  }
  save() {
    let saveModel: any = [];
    saveModel.push({ "ParaName": "COLORTHEME", "SubsidiaryId": "S1", "ParaValue": this.model.colortheme, "ParaDesc": "", "Type": "GENERATE" });
    saveModel.push({ "ParaName": "NORFONTCLOR", "SubsidiaryId": "S1", "ParaValue": this.model.norfontclor, "ParaDesc": "", "Type": "GENERATE" });
    saveModel.push({ "ParaName": "NORFRAMFONTCOLOR", "SubsidiaryId": "S1", "ParaValue": this.model.norframfontcolor, "ParaDesc": "", "Type": "GENERATE" });
    saveModel.push({ "ParaName": "SHOWFLOATLOGO", "SubsidiaryId": "S1", "ParaValue": this.model.showfloatlogo, "ParaDesc": "", "Type": "GENERATE" });
    this._commonService.saveConfiguration(saveModel).subscribe(
      data => {
        this._toastService.success("Update configuration sucessfull", "Update Configuration");
        this.updateTheme();
      }
    );
  }
  saveLogo(paraName, Paravalue) {
    let param = {
      "ParaName": paraName,
      "SubsidiaryId": "S1",
      "ParaValue": Paravalue,
      "ParaDesc": "",
      "Type": "GENERATE",
    }
    this._commonService.saveConfiguration([param]).subscribe();
  }
  updateTheme() {
    const theme: Theme = {
      name: 'light',
      properties: {
        '--background': this.model.colortheme,
        '--background-header': '#dfe6e9',
        '--font-color-menu': this.model.norframfontcolor,
        '--font-color-normal': this.model.norfontclor
      }
    };
    this._themeService.UpdateTheme2(theme);
  }
  public refreshValue(value: any): void {
    this.value = value;
  }
  public selectedThemColor(value:any):void {

    this.model.colortheme=value.id;
  }
}
