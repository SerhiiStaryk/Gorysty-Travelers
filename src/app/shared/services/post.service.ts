import { Injectable } from '@angular/core';
import { IPost } from '../interfaces/post.interface';
import { DocumentReference } from '@angular/fire/firestore/interfaces';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  public getAllFirebasePosts() {
    return this.firestore.collection<any>('posts', ref => ref.orderBy('date', 'desc')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  public getAllFirebasePostsID() {
    return this.firestore.collection<any>('posts').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        return { id };
      }))
    );
  }

  public getFirebasePublishPost() {
    return this.firestore.collection<any>('posts', ref => ref.where('publish', '==', true)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  public getFirebasePostsByCategory(category: string) {
    return this.firestore.collection<any>('posts', ref => ref.where('category.name', '==', category)
      .where('publish', '==', true)).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  public getOnePostFirebase(id: string) {
    return this.firestore.collection<any>('posts').doc(id).get();
  }

  public getLimitPostFirebade(count: number) {
    return this.firestore.collection<any>('posts', ref => ref.orderBy('date', 'desc')
      .where('publish', '==', true)
      .limit(count)).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })));
  }

  public addFirebasePost(post: IPost): Promise<DocumentReference> {
    return this.firestore.collection<IPost>('posts').add({ ...post });
  }

  public updateFirebasePost(post: IPost, id: string): Promise<any> {
    return this.firestore.collection<IPost>('posts').doc(id).update({ ...post });
  }

  public deleteFirebasePost(id: string): Promise<any> {
    return this.firestore.collection<IPost>('posts').doc(id).delete();
  }
}
