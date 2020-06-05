import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdviceService } from 'src/app/shared/services/advice.service';
import { IAdvice } from 'src/app/shared/interfaces/advice.interface';
import { Advice } from 'src/app/shared/models/advice.module';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-admin-advices',
  templateUrl: './admin-advices.component.html',
  styleUrls: ['./admin-advices.component.scss']
})
export class AdminAdvicesComponent implements OnInit {

  modalRef: BsModalRef;
  editStatus = false;

  arrAdvices: Array<IAdvice> = [];

  adviceId: string;
  adviceDate: Date;

  form: FormGroup;

  constructor(
    private modalService: BsModalService,
    private adviceService: AdviceService,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      text: new FormControl('', Validators.required)
    });
    this.getAdvices();
  }

  openModal(modal: TemplateRef<any>) {
    this.modalRef = this.modalService.show(modal);
    this.form.reset();
    this.adviceId = null;
    this.editStatus = false;
  }

  private getAdvices() {
    this.adviceService.getAllFirebaseAdvices().subscribe(
      data => {
        this.arrAdvices = data;
        console.log(this.arrAdvices);
      });
  }

  public addAdvice() {
    const date = new Date();
    const newAdvice = new Advice(
      null,
      this.form.value.text,
      date
    );

    delete newAdvice.id;

    this.adviceService.addFirebaseAdvice(newAdvice)
      .then(() => this.alert.success('Додано у базу даних'))
      .catch(err => this.alert.danger(err));

    this.cancelCreateAdvice();
  }

  public editAdvice(template: TemplateRef<any>, advice: any): void {
    this.modalRef = this.modalService.show(template);
    this.editStatus = true;
    this.adviceId = advice.id;
    this.adviceDate = advice.date;
    this.form.patchValue({
      text: advice.text
    });
  }

  public saveEdit() {
    const editAdvice = new Advice(
      this.adviceId,
      this.form.value.text,
      this.adviceDate
    );

    delete editAdvice.id;
    this.adviceService.updateFirebaseAdvice(editAdvice, this.adviceId)
      .then(() => this.alert.success('порада оновлена у базі даних'))
      .catch(err => this.alert.danger(err));
    this.cancelCreateAdvice();
    this.editStatus = false;
  }

  public deleteAdvice(advice: any): void {
    if (confirm('yes or no')) {
      this.adviceService.deleteFirebaseAdvice(advice.id)
        .then(() => this.alert.success('видалено з бази'))
        .catch(err => this.alert.danger(err));
    }
  }

  public cancelCreateAdvice(): void {
    this.modalRef.hide();
    this.form.reset();
  }

}
