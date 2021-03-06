import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IPost } from 'src/app/shared/interfaces/post.interface';
import { Post } from 'src/app/shared/modules/post.module';
import { PostService } from 'src/app/shared/services/post.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { TagsService } from 'src/app/shared/services/tags.service';
import { Tag } from 'src/app/shared/modules/tag.module';
import { ITag } from 'src/app/shared/interfaces/tag.interface';
import { IComment } from 'src/app/shared/interfaces/comments.interface';
import { ICategory } from 'src/app/shared/interfaces/category.interface';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})

export class CreatePostComponent implements OnInit {

  form: FormGroup;
  uploadProgress: Observable<number>;
  postImage: string;
  imgLoad = true;
  statusPublish = false;

  // data from firebase
  arrTags: Array<ITag> = [];
  arrayCategories: Array<ICategory[]> = [];
  arrComments: Array<IComment> = [];
  postTypes = ['post', 'advice'];

  // multiSelect
  dropdownList = [];
  selectedTags = [];
  dropdownSettings = {};

  // RegEXP
  extractNameImg = /%2F(.*?)\\?alt/;

  constructor(
    private postServices: PostService,
    private afStorage: AngularFireStorage,
    private alert: AlertService,
    private categoryService: CategoryService,
    private tagsService: TagsService
  ) { }

  ngOnInit(): void {
    this.getCategories();
    this.getTags();

    // Form
    this.form = new FormGroup({
      category: new FormControl(null, Validators.required),
      titleImg: new FormControl(null, Validators.required),
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      text: new FormControl(null, Validators.required),
      author: new FormControl(null, Validators.required),
      tags: new FormControl(null),
      type: new FormControl(null)
    });

    // multiSelect tags
    this.dropdownList = [];
    this.selectedTags = [];
    this.dropdownSettings = {
      enableCheckAll: true,
      enableSearchFilter: true,
      filterSelectAllText: 'Вибрати всі відфільтровані теги...',
      searchPlaceholderText: 'Знайти...',
      text: 'Виберіть теги',
      selectAllText: 'Вибрати всі',
      unSelectAllText: 'Скасувати всі',
      classes: 'myclass custom-class',
      addNewItemOnFilter: true,
      addNewButtonText: 'Додати',
      noDataLabel: 'Такого тегу не існує',
      // position: top,
      showCheckbox: false,
      labelKey: 'name'
    };
  }

  // private methods
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
      }
    ));
  }

  // public methods
  public savePost(): void {
    if (this.form.invalid) {
      return;
    }
    const date = new Date();
    const newPost: IPost = new Post(
      null,
      this.form.value.type,
      this.form.value.category,
      this.postImage,
      this.form.value.title,
      this.form.value.description,
      this.form.value.text,
      date,
      this.form.value.author,
      this.arrTags,
      this.arrComments,
      this.statusPublish
    );
    delete newPost.id;
    this.postServices.addFirebasePost(newPost)
      .then(() => this.alert.success('збережено у базі'))
      .catch(err => this.alert.warning(err));
    this.form.reset();
    this.postImage = '';
    this.imgLoad = true;
    this.arrTags = [];
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

  // multiSelect tags methods
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
