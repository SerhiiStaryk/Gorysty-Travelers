import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IPost } from 'src/app/shared/interfaces/post.interface';
import { Post } from 'src/app/shared/models/post.module';
import { PostService } from 'src/app/shared/services/post.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})

export class CreatePostComponent implements OnInit {

  form: FormGroup;
  postImage: string;
  imgLoad = true;
  uploadProgress: Observable<number>;
  tag: string;
  arrTags = [];
  listTags: string;
  oneWord = '^[a-zA-Z]+$';
  pattern = new RegExp(this.oneWord);

  constructor(
    private postServices: PostService,
    private afStorage: AngularFireStorage,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      titleImg: new FormControl(null, Validators.required),
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      text: new FormControl(null, Validators.required),
      author: new FormControl(null, Validators.required),
      tags: new FormControl(null, [Validators.pattern(this.oneWord)])
    });
  }

  savePost(): void {
    if (this.form.invalid) {
      return;
    }
    const date = new Date();
    const newPost: IPost = new Post(
      null,
      this.postImage,
      this.form.value.title,
      this.form.value.description,
      this.form.value.text,
      date,
      this.form.value.author,
      this.arrTags,
      false
    );

    delete newPost.id;

    this.postServices.addFirebasePost(newPost)
      .then(() => this.alert.success('збережено у базі'))
      .catch(err => this.alert.warning(err));
    this.form.reset();
    this.postImage = '';
    this.imgLoad = true;
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
