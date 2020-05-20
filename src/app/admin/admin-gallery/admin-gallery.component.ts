import { Component, OnInit, TemplateRef } from '@angular/core';
import { IPhoto } from 'src/app/shared/interfaces/photo.interface';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CategoryService } from 'src/app/shared/services/category.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { TagsService } from 'src/app/shared/services/tags.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { ITag } from 'src/app/shared/interfaces/tag.interface';
import { Tag } from 'src/app/shared/models/tag.module';
import { AngularFireStorage } from '@angular/fire/storage';
import { GalleryService } from 'src/app/shared/services/gallery.service';
import { Photo } from 'src/app/shared/models/photo.module';

@Component({
  selector: 'app-admin-gallery',
  templateUrl: './admin-gallery.component.html',
  styleUrls: ['./admin-gallery.component.scss']
})
export class AdminGalleryComponent implements OnInit {

  // data from firebase
  arrTags: Array<ITag> = [];
  arrayCategories: Array<any> = [];
  arrPhotos: Array<IPhoto[]> = [];

  tagList: string;

  modalRef: BsModalRef;
  editStatus = false;
  photoId: string;
  photoDate: Date;
  photoCategory: ICategory;
  selected: string;

  form: FormGroup;
  formModal: FormGroup;
  sourceImg: string;
  imgLoad = true;

  uploadProgress: Observable<number>;

  // multiSelect
  dropdownList = [];
  selectedTags = [];
  dropdownSettings = {};

  // RegEXP
  extractNameImg = /%2F(.*?)\\?alt/;

  constructor(
    private modalService: BsModalService,
    private alert: AlertService,
    private tagsService: TagsService,
    private categoryService: CategoryService,
    private afStorage: AngularFireStorage,
    private galleryService: GalleryService
  ) { }

  ngOnInit(): void {
    // Form
    this.form = new FormGroup({
      category: new FormControl(null, Validators.required),
      galleryImg: new FormControl(null, Validators.required),
      tags: new FormControl(null)
    });

    this.getCategories();
    this.getTags();
    this.getGellery();

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
      position: top,
      showCheckbox: false,
      labelKey: 'name'
    };
  }

  // open modal window for create element photo gallery
  public openModal(photoModal: TemplateRef<any>) {
    this.modalRef = this.modalService.show(photoModal);
    this.editStatus = false;
    this.sourceImg = '';
    this.imgLoad = true;
    this.selectedTags = [];
    this.selected = 'Виберіть категорію...';
  }

  // get tags for dropdown multi select
  private getTags() {
    return this.tagsService.getAllFirebaseTags().subscribe((
      data => {
        this.dropdownList = data;
      }));
  }
  // get option for select
  private getCategories() {
    return this.categoryService.getAllFirebaseCategories().subscribe((
      data => {
        this.arrayCategories = data;
      }));
  }

  // get element gallery from firebase
  private getGellery() {
    return this.galleryService.getAllFirebasePhoto().subscribe((
      data => {
        this.arrPhotos = data;
      }));
  }

  // get list tags from selectedTags for view table
  public getListTags(tags: Array<ITag>): string {
    const tempArr: Array<string> = [];
    tags.map(el => tempArr.push(el.name));
    return tempArr.join(', ');
  }

  // function set objectCategory to photo
  public setCategory(categoryName: string) {
    return this.arrayCategories.filter(el => {
      if (el.name === categoryName) {
        this.photoCategory = el;
      }
    });
  }

  // add new photo to firebase
  public addPhoto() {
    if (this.form.invalid) {
      return;
    }
    const date = new Date();
    const photo: IPhoto = new Photo(
      null,
      this.photoCategory,
      this.sourceImg,
      date,
      this.arrTags
    );
    delete photo.id;

    this.galleryService.addFirebasePhoto(photo)
      .then(() => this.alert.success('фото додано до галереї'))
      .catch(err => this.alert.danger(err));
    this.form.reset();
    this.modalRef.hide();
  }

  public editPhoto(template: TemplateRef<any>, photo: any): void {
    this.modalRef = this.modalService.show(template);
    this.editStatus = !this.editStatus;
    this.imgLoad = false;
    this.photoCategory = photo.category;
    this.photoId = photo.id;
    this.selected = photo.category.name;
    this.sourceImg = photo.source;
    this.photoDate = photo.date;
    this.selectedTags = photo.tags;
  }

  public saveEdit() {
    const photo: IPhoto = new Photo(
      null,
      this.photoCategory,
      this.sourceImg,
      this.photoDate,
      this.selectedTags
    );
    delete photo.id;

    this.galleryService.updateFirebasePhoto(photo, this.photoId)
      .then(() => this.alert.success('інформація оновлена'))
      .catch(err => this.alert.danger(err));
    this.form.reset();
    this.modalRef.hide();
    this.selectedTags = [];
  }

  public cancelAddPhoto(): void {
    this.modalRef.hide();
    this.form.reset();
    this.sourceImg = 'string';
    this.imgLoad = true;

  }

  public uploadFile(event: any): void {
    const file = event.target.files[0];
    const filePath = `images/${this.uuid()}.${file.type.split('/')[1]}`;
    const task = this.afStorage.upload(filePath, file);
    this.uploadProgress = task.percentageChanges();
    task.then(e => {
      this.afStorage.ref(`images/${e.metadata.name}`).getDownloadURL().subscribe(url => {
        this.sourceImg = url;
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

  public deletePhoto(photo: IPhoto) {
    this.galleryService.deleteFirebasePhoto(photo.id)
      .then(() => this.alert.success('зображення видалено'))
      .catch(err => this.alert.danger(err));

    const nameImg = (this.extractNameImg.exec(this.sourceImg)[0]).substr(3).slice(0, -4);
    this.afStorage.storage.ref('images').child(`${nameImg}`).delete();
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
