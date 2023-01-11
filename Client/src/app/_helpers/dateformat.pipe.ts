import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateformat'
})
export class DateformatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return null;
    if(!args)
    {
        args="DD/MM/YYYY hh:mm A";
    } 

    if (value != "" && value != " " && value != undefined) 
    {
        var tempDate = new Date(value);
        let dateTime = new Date(tempDate.getUTCFullYear(), tempDate.getUTCMonth(), tempDate.getUTCDate(), tempDate.getUTCHours(), tempDate.getUTCMinutes(), tempDate.getUTCSeconds());
        return moment(dateTime).format(args);
    }
    else {
        return "";
    }
    
  }

}
