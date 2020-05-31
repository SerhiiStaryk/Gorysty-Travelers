import { Pipe, PipeTransform } from '@angular/core';
import { IPost } from '../interfaces/post.interface';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(arrPosts: Array<IPost[]>, sortDisabled: boolean, sortBy: string, sortDirection: boolean): Array<IPost[]> {
    if (sortDisabled) {
      return arrPosts;
    }
  
    if (!sortDisabled) {
      if (sortDirection) {
        function compare(a: any, b: any) {
          const A = a[sortBy];
          const B = b[sortBy];

          let comparison = 0;
          if (A > B) {
            comparison = 1;
          } else if (A < B) {
            comparison = -1;
          }
          return comparison;
        }
        return arrPosts.sort(compare);
      }
      if (!sortDirection) {
        function compare(a: any, b: any) {
          const A = a[sortBy];
          const B = b[sortBy];

          let comparison = 0;
          if (A < B) {
            comparison = 1;
          } else if (A > B) {
            comparison = -1;
          }
          return comparison;
        }
        return arrPosts.sort(compare);
      }
    }
  }

}
