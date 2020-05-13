import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {

  modalRef: BsModalRef;
  editStatus = false;

  constructor(
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
  }

  openModal(createCategory: TemplateRef<any>) {
    this.modalRef = this.modalService.show(createCategory);
  }

}
