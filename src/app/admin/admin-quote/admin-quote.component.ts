import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { QuoteService } from 'src/app/shared/services/quote.service';
import { IQuote } from 'src/app/shared/interfaces/quote.interface';
import { Quote } from 'src/app/shared/models/quote.module';
import { AlertService } from 'src/app/shared/services/alert.service';


@Component({
  selector: 'app-admin-quote',
  templateUrl: './admin-quote.component.html',
  styleUrls: ['./admin-quote.component.scss']
})
export class AdminQuoteComponent implements OnInit {

  modalRef: BsModalRef;
  editStatus = false;
  arrQuotes: Array<IQuote> = [];
  quoteID: string;
  quoteDate: Date;

  form: FormGroup;

  constructor(
    private modalService: BsModalService,
    private quoteService: QuoteService,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      quote: new FormControl('', Validators.required),
      author: new FormControl('', Validators.required)
    });
    this.getQuotes();
  }

  openModal(modal: TemplateRef<any>) {
    this.modalRef = this.modalService.show(modal);
    this.form.reset();
    this.quoteID = null;
    this.editStatus = false;
  }

  private getQuotes() {
    this.quoteService.getAllFirebaseQuotes().subscribe(
      data => {
        this.arrQuotes = data;
        console.log(this.arrQuotes);
      });
  }

  public addQuote() {
    const date = new Date();
    const newQuote = new Quote(
      null,
      this.form.value.quote,
      this.form.value.author,
      date
    );

    delete newQuote.id;

    this.quoteService.addFirebaseQuote(newQuote)
      .then(() => this.alert.success('цитату додано у базу'))
      .catch(err => this.alert.danger(err));
    this.cancelCreateQuote();
  }

  public editQuote(modal: TemplateRef<any>, quote: any): void {
    this.modalRef = this.modalService.show(modal);
    this.editStatus = true;
    this.quoteID = quote.id;
    this.quoteDate = quote.date;
    this.form.patchValue({
      quote: quote.quote,
      author: quote.author
    });
  }

  public saveEdit() {
    const editQuote = new Quote(
      this.quoteID,
      this.form.value.quote,
      this.form.value.author,
      this.quoteDate
    );

    delete editQuote.id;

    this.quoteService.updateFirebaseQuote(editQuote, this.quoteID)
      .then(() => this.alert.success('цитату оновлено'))
      .catch(err => this.alert.danger(err));

    this.editStatus = false;
    this.cancelCreateQuote();

  }

  public deleteQuote(quote: any): void {
    if (confirm('yes or no')) {
      this.quoteService.deleteFirebaseQuote(quote.id)
        .then(() => this.alert.success('цитату видалено'))
        .catch(err => this.alert.danger(err));
    }
  }

  public cancelCreateQuote(): void {
    this.modalRef.hide();
    this.form.reset();
  }

}
