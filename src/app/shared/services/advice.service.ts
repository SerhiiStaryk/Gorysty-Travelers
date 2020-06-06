import { Injectable } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore/interfaces';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { IAdvice } from '../interfaces/advice.interface';

@Injectable({
  providedIn: 'root'
})
export class AdviceService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  public getAllFirebaseAdvices() {
    return this.firestore.collection<any>('advices', ref => ref.orderBy('date', 'desc')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  public getOneAdviceFirebase(id: string) {
    return this.firestore.collection<any>('advices').doc(id).get();
  }

  public getLimitAdvicesFirebade(count: number) {
    return this.firestore.collection<any>('advices', ref => ref.orderBy('date', 'desc')
      .limit(count)).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })));
  }

  public addFirebaseAdvice(advice: IAdvice): Promise<DocumentReference> {
    return this.firestore.collection<IAdvice>('advices').add({ ...advice });
  }

  public updateFirebaseAdvice(advice: IAdvice, id: string): Promise<any> {
    return this.firestore.collection<IAdvice>('advices').doc(id).update({ ...advice });
  }

  public deleteFirebaseAdvice(id: string): Promise<any> {
    return this.firestore.collection<IAdvice>('advices').doc(id).delete();
  }
}
