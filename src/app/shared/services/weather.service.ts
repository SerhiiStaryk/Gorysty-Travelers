import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocumentReference } from '@angular/fire/firestore/interfaces';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { ICity } from '../interfaces/city.interface';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  apiKey = 'f01e6d5f529a7db99adaf7656ffc267a';
  url = 'https://api.openweathermap.org/data/2.5/onecall?';

  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore
  ) { }

  public getAllFirebaseCity() {
    return this.firestore.collection<any>('cities').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
  }

  public addFirebaseCity(city: ICity): Promise<DocumentReference> {
    return this.firestore.collection<ICity>('cities').add({ ...city });
  }

  public updateFirebaseCity(city: ICity, id: string): Promise<any> {
    return this.firestore.collection<ICity>('cities').doc(id).update({ ...city });
  }

  public deleteFirebaseCity(id: string): Promise<any> {
    return this.firestore.collection<ICity>('cities').doc(id).delete();
  }

  public getWeatherData(city: any) {
    return this.http.get(`${this.url}lat=${city.latitude}&lon=${city.longitude}&exclude=hourly&units=metric&appid=${this.apiKey}`);
  }
}




