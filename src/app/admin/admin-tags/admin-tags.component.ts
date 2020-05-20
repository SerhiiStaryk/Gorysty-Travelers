import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertService } from 'src/app/shared/services/alert.service';
import { TagsService } from 'src/app/shared/services/tags.service';
import { Tag } from 'src/app/shared/models/tag.module';

@Component({
  selector: 'app-admin-tags',
  templateUrl: './admin-tags.component.html',
  styleUrls: ['./admin-tags.component.scss']
})
export class AdminTagsComponent implements OnInit {

  modalRef: BsModalRef;
  editStatus = false;

  form: FormGroup;
  arrTags: any[];
  editTagId: string;

  constructor(
    private modalService: BsModalService,
    private alert: AlertService,
    private tagsService: TagsService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
    });
    this.getTags();
  }

  openModal(createCategory: TemplateRef<any>) {
    this.modalRef = this.modalService.show(createCategory);
    this.editStatus = false;
    this.form.patchValue({
      name: null
    });
  }

  private getTags() {
    return this.tagsService.getAllFirebaseTags().subscribe((
      data => {
        this.arrTags = data;
      }));
  }

  public addTag() {
    const tag = new Tag(
      null,
      (this.form.value.name).toLowerCase()
    );
    console.log(tag);
    delete tag.id;
    this.tagsService.addFirebaseTag(tag)
      .then(() => this.alert.success('збережено у базі'))
      .catch(err => this.alert.danger(err));
    this.form.reset();
    this.modalRef.hide();
  }

  public editTag(template: TemplateRef<any>, tag: any): void {
    this.editStatus = !this.editStatus;
    this.modalRef = this.modalService.show(template);
    this.editTagId = tag.id;
    this.form = new FormGroup({
      name: new FormControl(tag.name),
    });
  }

  public saveEdit() {
    const tag = new Tag(
      null,
      (this.form.value.name).toLowerCase()
    );
    delete tag.id;

    this.tagsService.updateFirebaseTag(tag, this.editTagId)
      .then(() => this.alert.success('зміни збережені у базі'))
      .catch(err => this.alert.danger(err));

    this.form.reset();
    this.modalRef.hide();
    this.editTagId = '';
    this.editStatus = !this.editStatus;
  }

  public deleteTag(tag: any): void {
    if (confirm('yes or not')) {
      if (this.arrTags.length > 0) {
        this.tagsService.deleteFirebaseTag(tag.id)
          .then(() => this.alert.success('тег змінено'))
          .catch(err => this.alert.danger(err));
      } else {this.alert.warning('Видалити усі теги не можливо...')}

    }
  }

  public cancelCreateTag(): void {
    this.modalRef.hide();
    this.form.reset();
    this.editTagId = '';
  }

}
