import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-quote',
  templateUrl: './admin-quote.component.html',
  styleUrls: ['./admin-quote.component.scss']
})
export class AdminQuoteComponent implements OnInit {

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

  private getQuotes() {
    
  }

  public addQuote() {

  }

  public editQuote(template: TemplateRef<any>, quote: any): void {

  }

  public saveEdit() {
   
  }

  public deleteQuote(quote: any): void {
   
  }

  public cancelCreateQuote(): void {
    this.modalRef.hide();
  }

}
