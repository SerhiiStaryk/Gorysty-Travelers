import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  constructor() { }

  makePopup(data: any): string {
    // console.log(data);
    return `<div>Назва: ${data.properties.name}</div><div>Висота: ${data.properties.height} м</div>`;
  }
}

