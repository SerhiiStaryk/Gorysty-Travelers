import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-advices',
  templateUrl: './admin-advices.component.html',
  styleUrls: ['./admin-advices.component.scss']
})
export class AdminAdvicesComponent implements OnInit {

  modalRef: BsModalRef;
  editStatus = false;

  form: FormGroup;

  constructor(
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
  }

  openModal(modal: TemplateRef<any>) {
    this.modalRef = this.modalService.show(modal);
  }

  private getAdvices() {
    
  }

  public addAdvice() {

  }

  public editAdvice(template: TemplateRef<any>, advice: any): void {

  }

  public saveEdit() {
   
  }

  public deleteAdvice(advice: any): void {
   
  }

  public cancelCreateAdvice(): void {
    this.modalRef.hide();
  }

}
