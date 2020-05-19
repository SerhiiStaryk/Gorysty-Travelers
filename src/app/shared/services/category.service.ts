import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { ICategory } from '../interfaces/category.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private firestore: AngularFirestore) { }

  getAllFirebaseCategories() {
    return this.firestore.collection<ICategory[]>('categories').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getOneFirebaseCategory(id: string) {
    return this.firestore.collection<ICategory[]>('categories').doc(id).get();
  }

  getOneFirebaseCategoryByName(name: string) {
    return this.firestore.collection<ICategory[]>('categories', ref => ref.where('name', '==', name)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  addFirebaseCategory(category: ICategory): Promise<DocumentReference> {
    return this.firestore.collection<any>('categories').add({ ...category });
  }

  updateFirebaseCategory(category: ICategory, id: string): Promise<void> {
    return this.firestore.collection<ICategory[]>('categories').doc(id).update({ ...category });
  }

  deleteFirebaseCategory(id: string): Promise<void> {
    return this.firestore.collection<ICategory[]>('categories').doc(id).delete();
  }
}
