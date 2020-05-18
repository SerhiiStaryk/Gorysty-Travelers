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
import { TagsService } from 'src/app/shared/services/tags.service';
import { Tag } from 'src/app/shared/models/tag.module';
import { ITag } from 'src/app/shared/interfaces/tag.interface';
import { IComment } from 'src/app/shared/interfaces/comments.interface';


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
  statusPublish = false;
  uploadProgress: Observable<number>;

  arrTags: Array<ITag> = [];
  arrComments: Array<IComment> = [];

  arrayCategories: Array<any>;
  postCategory: ICategory;

  // multiSelect

  dropdownList = [];
  selectedTags = [];
  dropdownSettings = {};

  // Regexp
  extractNameImg = /%2F(.*?)\\?alt/;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postServices: PostService,
    private afStorage: AngularFireStorage,
    private alert: AlertService,
    private categoryService: CategoryService,
    private tagsService: TagsService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      selected: new FormControl(null),
      titleImg: new FormControl('null', Validators.required),
      title: new FormControl('', Validators.required),
      description: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      text: new FormControl('', Validators.required),
      author: new FormControl('', Validators.required),
      tags: new FormControl(''),
    });
    this.getCategories();
    this.getPost();
    this.getTags();

    // multiSelect tags
    this.dropdownList = [];
    this.selectedTags = [];
    this.dropdownSettings = {
      enableCheckAll: true,
      enableSearchFilter: true,
      searchPlaceholderText: 'Знайти...',
      text: 'Виберіть теги',
      selectAllText: 'Вибрати всі',
      unSelectAllText: 'Скасувати всі',
      classes: 'myclass custom-class',
      addNewItemOnFilter: true,
      addNewButtonText: 'Додати',
      noDataLabel: 'Такого тегу не існує',
      position: top,
      showCheckbox: false,
      labelKey: 'name'
    };
  }

  private getTags() {
    return this.tagsService.getAllFirebaseTags().subscribe((
      data => {
        this.dropdownList = data;
      }));
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
        this.selectedTags = this.arrTags;
        this.editCategory = this.editPost.category;

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
    return this.arrayCategories.filter(el => {
      if (el.name === categoryName) {
        this.editCategory = el;
      }
    });
  }

  // update methods

  public updatePost() {
    console.log(this.editCategory);

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
      this.arrComments,
      this.statusPublish
    );

    delete newPost.id;

    this.postServices.updateFirebasePost(newPost, this.editPostId)
      .then(() => this.alert.success('оновлено у базі'))
      .catch(err => this.alert.danger(err));
    window.scrollTo(0, 0);
  }

  public uploadFile(event: any): void {
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

  private uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public removeImg() {
    const nameImg = (this.extractNameImg.exec(this.postImage)[0]).substr(3).slice(0, -4);

    this.afStorage.storage.ref('images').child(`${nameImg}`).delete()
      .then(() => this.alert.success('зображення видалено'))
      .catch(err => this.alert.danger(err));

    this.imgLoad = true;
    this.postImage = '';
    this.form.patchValue({
      titleImg: null
    });
  }
  // multiSelect tags
  public onItemSelect(item: any) {
    this.arrTags = this.selectedTags;
  }

  public OnItemDeSelect(item: any) {
    this.arrTags = this.selectedTags;
  }

  public onSelectAll(items: any) {
    this.arrTags = this.selectedTags;
  }

  public onDeSelectAll(items: any) {
    this.arrTags = this.selectedTags;
  }

  public onAddItem(item: any) {
    const newTag = new Tag(
      null,
      (item).toUpperCase()
    );

    delete newTag.id;

    this.tagsService.addFirebaseTag(newTag)
      .then(() => this.alert.success('тег збережено у базі'))
      .catch(err => this.alert.danger(err));
  }

}
