import { Pipe, PipeTransform } from '@angular/core';
import { IPhoto } from '../interfaces/photo.interface';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  tempArr: Array<IPhoto> = [];

  transform(arrPhoto: Array<IPhoto>, searchText: string): Array<IPhoto> {
    if (!searchText) {
      return arrPhoto;
    }

    if (!arrPhoto) {
      return [];
    }

    arrPhoto.map(el => {
      if (el.tags.find(e => e.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)) {
        if (!this.tempArr.includes(el)) {
          this.tempArr.push(el);
        }
      }
    });
    return arrPhoto = this.tempArr;
  }
}
