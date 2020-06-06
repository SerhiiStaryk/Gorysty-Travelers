import { Injectable } from '@angular/core';
import 'firebase/firestore';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { ITag } from '../interfaces/tag.interface';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  public getAllFirebaseTags() {
    return this.firestore.collection<ITag[]>('tags', ref => ref.orderBy('name', 'asc')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  public getLimitFirebaseTags() {
    return this.firestore.collection<ITag[]>('tags', ref => ref.limit(10)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  public addFirebaseTag(tag: ITag): Promise<DocumentReference> {
    return this.firestore.collection<ITag>('tags').add({ ...tag });
  }

  public updateFirebaseTag(tag: ITag, id: string): Promise<any> {
    return this.firestore.collection<ITag>('tags').doc(id).update({ ...tag });
  }

  public deleteFirebaseTag(id: string): Promise<any> {
    return this.firestore.collection<ITag>('tags').doc(id).delete();
  }
}
