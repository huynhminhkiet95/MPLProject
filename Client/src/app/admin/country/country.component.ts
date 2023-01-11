import { Component, OnInit } from '@angular/core';
import {CountryService} from '../../_services/index';
import CustomStore from 'devextreme/data/custom_store';
import {Observable} from 'rxjs/Observable';
declare var AdminLTE: any;
@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  countryLists:any={};
  title="Country";
  gridColumns = [
        {
            allowEditing:false,
            dataField:'countryId'
        },
        "countryName", 
        "regionId"
    ];
  constructor(public country:CountryService) { }
    ngOnInit() {
        AdminLTE.init();
        //this.countryLists=this.country.getAll().subscribe(countrys=>this.countryLists=countrys.payload);
        this.countryLists.store = new CustomStore({
            load:(loadOptions)=> {
                let that=this;
                 return that.country.getAll()
                    .toPromise()
                    .then(res => {
                        return {
                            data: res["payload"],
                            totalCount:res["payload"].length,
                        }
                });
                    
            }
          });
    }
    onContentReady(e) 
    {
        e.component.columnOption("command:edit", {
            visibleIndex: 4,
            width: 80
        });
    }     
}
