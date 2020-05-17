import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IPost } from 'src/app/shared/interfaces/post.interface';
import { Post } from 'src/app/shared/models/post.module';
import { PostService } from 'src/app/shared/services/post.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { CategoryService } from 'src/app/shared/services/category.service';


@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent implements OnInit {

  form: FormGroup;

  editPostId: string;
  editPost: any;
  postImage: string;
  editCategory: ICategory;

  selected: string;

  imgLoad = false;
  uploadProgress: Observable<number>;
  tag: string;
  arrTags = [];
  listTags: string;

  arrayCategories: Array<any>;
  postCategory: ICategory;

  // Regexp
  oneWord = '^[А-Яа-яЇїІіЄєҐґ\']+$';
  pattern = new RegExp(this.oneWord);

  extractNameImg = /%2F(.*?)\\?alt/;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postServices: PostService,
    private afStorage: AngularFireStorage,
    private alert: AlertService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      selected: new FormControl(null),
      titleImg: new FormControl(''),
      title: new FormControl('', Validators.required),
      description: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      text: new FormControl('', Validators.required),
      author: new FormControl('', Validators.required),
      tags: new FormControl('', [Validators.pattern(this.oneWord)]),
    });
    this.getCategories();
    this.getPost();
  }

  private getCategories() {
    return this.categoryService.getAllFirebaseCategories().subscribe((
      data => {
        this.arrayCategories = data;
      }));
  }

  private getPost(): void {
    this.editPostId = this.activatedRoute.snapshot.paramMap.get('id');
    this.postServices.getOnePostFirebase(this.editPostId).subscribe(
      data => {
        this.editPost = data.data();
        this.postImage = this.editPost.titleImg;
        this.selected = this.editPost.category.name;
        this.arrTags = this.editPost.tags;
        this.listTags = (this.editPost.tags).join(', ');

        this.setValueForm(
          this.editPost.title,
          this.editPost.description,
          this.editPost.text,
          this.editPost.author
        );
      });
  }

  private setValueForm(editTitle: string, editDescription: string, editText: string, editAuthor: string) {

    this.form.patchValue({
      title: editTitle,
      description: editDescription,
      text: editText,
      author: editAuthor
    });
  }

  public setCategory(categoryName: string) {
    this.arrayCategories.filter(el => {
      if (el.name === categoryName) {
        this.editCategory = el;
      }
    });
  }

  // update methods

  public updatePost() {
    if (this.form.invalid) {
      return;
    }
    const newPost: IPost = new Post(
      null,
      this.editCategory,
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

  removeImg() {
    const nameImg = (this.extractNameImg.exec(this.postImage)[0]).substr(3).slice(0, -4);

    this.afStorage.storage.ref('images').child(`${nameImg}`).delete()
      .then(() => this.alert.success('зображення видалено'))
      .catch(err => this.alert.danger(err));

    this.imgLoad = true;
    this.postImage = '';
  }

}
