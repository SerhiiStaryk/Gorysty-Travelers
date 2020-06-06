import { Injectable } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore/interfaces';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { IQuote } from '../interfaces/quote.interface';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  public getAllFirebaseQuotes() {
    return this.firestore.collection<any>('quotes', ref => ref.orderBy('date', 'desc')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  public getOneQuoteFirebase(id: string) {
    return this.firestore.collection<any>('quotes').doc(id).get();
  }

  public getLimitQuotesFirebade(count: number) {
    return this.firestore.collection<any>('quotes', ref => ref.orderBy('date', 'desc')
      .limit(count)).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })));
  }

  public addFirebaseQuote(quote: IQuote): Promise<DocumentReference> {
    return this.firestore.collection<IQuote>('quotes').add({ ...quote });
  }

  public updateFirebaseQuote(quote: IQuote, id: string): Promise<any> {
    return this.firestore.collection<IQuote>('quotes').doc(id).update({ ...quote });
  }

  public deleteFirebaseQuote(id: string): Promise<any> {
    return this.firestore.collection<IQuote>('quotes').doc(id).delete();
  }
}
