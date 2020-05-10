import { Injectable } from '@angular/core';
import { IPost } from '../interfaces/post.interface';
import { DocumentReference } from '@angular/fire/firestore/interfaces';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  addFirebasePost(post: IPost): Promise<DocumentReference> {
    return this.firestore.collection<IPost>('posts').add({ ...post });
  }
}
