import { Pipe, PipeTransform } from '@angular/core';
 
@Pipe({
  name: 'removewhitespaces'
})
export class RemovewhitespacesPipe implements PipeTransform {
 
  transform(value: string, args?: any): string {
    
    if(value != undefined)
    {
      let returnValue:string = value.replace(/ /g, '');
      return returnValue.toLowerCase();
    }
    else
    return value;
   
  }
 
}