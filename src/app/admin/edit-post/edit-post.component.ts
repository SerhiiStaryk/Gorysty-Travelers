import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IPost } from 'src/app/shared/interfaces/post.interface';
import { Post } from 'src/app/shared/models/post.module';
import { PostService } from 'src/app/shared/services/post.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent implements OnInit {

  form: FormGroup;

  editPost: any;
  editPostId: string;

  postImage: string;
  imgLoad = false;
  uploadProgress: Observable<number>;
  tag: string;
  arrTags = [];
  listTags: string;

  // Regexp
  oneWord = '^[a-zA-Z]+$';
  pattern = new RegExp(this.oneWord);

  constructor(
    private activatedRoute: ActivatedRoute,
    private postServices: PostService,
    private afStorage: AngularFireStorage,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    this.editPostId = this.activatedRoute.snapshot.paramMap.get('id');
    this.postServices.getOnePostFirebase(this.editPostId).subscribe(
      data => {
        this.editPost = data.data();
        this.postImage = this.editPost.titleImg;
        this.arrTags = this.editPost.tags;
        this.listTags = (this.editPost.tags).join(', ');
        this.form = new FormGroup({
          titleImg: new FormControl(''),
          title: new FormControl(this.editPost.title, Validators.required),
          description: new FormControl(this.editPost.description, [Validators.required, Validators.maxLength(200)]),
          text: new FormControl(this.editPost.text, Validators.required),
          author: new FormControl(this.editPost.author, Validators.required),
          tags: new FormControl('', [Validators.pattern(this.oneWord)])
        });
      });
  }


  // update methods

  public updatePost() {
    if (this.form.invalid) {
      return;
    }
    const newPost: IPost = new Post(
      null,
      this.postImage,
      this.form.value.title,
      this.form.value.description,
      this.form.value.text,
      this.editPost.date,
      this.form.value.author,
      this.arrTags,
      false
    );

    delete newPost.id;
    this.postServices.updateFirebasePost(newPost, this.editPostId)
      .then(() => this.alert.success('оновлено у базі'))
      .catch(err => this.alert.danger(err));
  }

  uploadFile(event: any): void {
    const file = event.target.files[0];
    const filePath = `images/${this.uuid()}.${file.type.split('/')[1]}`;
    const task = this.afStorage.upload(filePath, file);
    this.uploadProgress = task.percentageChanges();
    task.then(e => {
      this.afStorage.ref(`images/${e.metadata.name}`).getDownloadURL().subscribe(url => {
        this.postImage = url;
        this.imgLoad = false;
      });
    });
  }

  uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  addTags() {
    if (this.pattern.test(this.form.value.tags)) {
      this.arrTags.push(this.tag);
      this.listTags = (this.arrTags).join(', ');
      this.tag = '';
    } else {
      return;
    }
  }

}
