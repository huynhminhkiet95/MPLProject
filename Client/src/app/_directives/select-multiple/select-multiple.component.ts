import { Component,ViewChild} from '@angular/core';
import { SelectComponent } from 'ng2-select';
@Component({
  selector: 'app-select-multiple',
  templateUrl: './select-multiple.component.html',
  styleUrls: ['./select-multiple.component.css'],
})
export class SelectMultipleComponent{

  @ViewChild('SelectId') private select: SelectComponent;
  public items:any = [];

  public value:any = [];
  public _disabledV:string = '0';
  public disabled:boolean = false;

  public get disabledV():string {
    return this._disabledV;
  }

  public set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  public selected(value:any):void {
    //console.log('Selected value is: ', value);
  }

  public removed(value:any):void {
    //console.log('Removed value is: ', value);
  }

  public refreshValue(value:any):void {
    this.value = value;
    this.select.active=value;
  }

  public itemsToString(value:Array<any> = []):string {
    return value
      .map((item:any) => {
        return item.text;
      }).join(',');
  }
}