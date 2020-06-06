import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Category } from 'src/app/shared/models/category.module';
import { CategoryService } from 'src/app/shared/services/category.service';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {

  modalRef: BsModalRef;
  editStatus = false;

  form: FormGroup;
  arrCategories: any[];
  editCategoryId: string;

  constructor(
    private modalService: BsModalService,
    private categoryService: CategoryService,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('')
    });

    this.getCategories();
  }

  openModal(createCategory: TemplateRef<any>) {
    this.modalRef = this.modalService.show(createCategory);
    this.editCategoryId = null;
    this.form.reset();
    this.editStatus = null;
  }

  private getCategories() {
    return this.categoryService.getAllFirebaseCategories().subscribe((
      data => {
        this.arrCategories = data;
      }
    ));
  }

  public addCategory() {
    const category = new Category(
      null,
      this.form.value.name,
      this.form.value.description,
      0
    );
    delete category.id;
    this.categoryService.addFirebaseCategory(category)
      .then(() => this.alert.success('збережено у базі'))
      .catch(err => this.alert.danger(err));
    this.form.reset();
    this.modalRef.hide();
  }

  public editCategory(template: TemplateRef<any>, category: any): void {
    this.editStatus = !this.editStatus;
    this.modalRef = this.modalService.show(template);
    this.editCategoryId = category.id;
    this.form = new FormGroup({
      name: new FormControl(category.name),
      description: new FormControl(category.description)
    });
  }

  public saveEdit() {
    const category = new Category(
      null,
      this.form.value.name,
      this.form.value.description,
      0
    );
    delete category.id;

    this.categoryService.updateFirebaseCategory(category, this.editCategoryId)
      .then(() => this.alert.success('зміни внесені у базу'))
      .catch(err => this.alert.danger(err));
    this.form.reset();
    this.modalRef.hide();
    this.editCategoryId = '';
    this.editStatus = !this.editStatus;
  }

  public deleteCategory(category: any): void {
    if (confirm('yes or not')) {
      if (this.arrCategories.length > 1) {
        this.categoryService.deleteFirebaseCategory(category.id)
          .then(() => this.alert.warning('Пост видалений з бази'))
          .catch(err => this.alert.danger(err));
      } else { this.alert.warning('Видалити усі категорії не можливо...')}

    }
  }

  public cancelCreateCategory(): void {
    this.modalRef.hide();
    this.form.reset();
    this.editCategoryId = '';
  }
}
