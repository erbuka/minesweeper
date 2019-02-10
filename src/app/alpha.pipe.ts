import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'alpha'
})
export class AlphaPipe implements PipeTransform {

  transform(value: any, length: number = 3): string {
    let s = "" + value;
    while (s.length < length)
      s = "0" + s;
    return s;
  }

}
