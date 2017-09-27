import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'filterbyname'})
export class FilterbynamePipe implements PipeTransform {

  transform(value, args?) {
    // ES6 array destructuring
    const name = args;
    console.log(name);
    return value.filter(item => {
      return item.name === name;
    })[0];
  }

}
