import { Injectable } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore/interfaces';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { IPhoto } from '../interfaces/photo.interface';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  public getAllFirebasePhoto() {
    return this.firestore.collection<any>('photos', ref => ref.orderBy('date', 'desc')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
  }

  public getFirebasePhotoByCategory(category: string) {
    return this.firestore.collection<any>('photos', ref => ref.where('category.name', '==', category)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  public addFirebasePhoto(photo: IPhoto): Promise<DocumentReference> {
    return this.firestore.collection<IPhoto>('photos').add({ ...photo });
  }

  public updateFirebasePhoto(post: IPhoto, id: string): Promise<any> {
    return this.firestore.collection<IPhoto>('photos').doc(id).update({ ...post });
  }

  public deleteFirebasePhoto(id: string): Promise<any> {
    return this.firestore.collection<IPhoto>('photos').doc(id).delete();
  }

  public getLimitPhotoFirebade(count: number) {
    return this.firestore.collection<any>('photos', ref => ref.orderBy('date', 'desc')
      .limit(count)).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }
}









