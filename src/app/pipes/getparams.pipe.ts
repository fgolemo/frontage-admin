import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'getparams'})
export class GetparamsPipe implements PipeTransform {

  transform(value) {
    // ES6 array destructuring
    console.log(value);
    return value['params'];
  }

}
