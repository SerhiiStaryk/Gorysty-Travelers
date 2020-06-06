import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AlertService } from 'src/app/shared/services/alert.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { ICity } from 'src/app/shared/interfaces/city.interface';
import { WeatherService } from 'src/app/shared/services/weather.service';
import { City } from 'src/app/shared/models/city.module';

@Component({
  selector: 'app-admin-weather',
  templateUrl: './admin-weather.component.html',
  styleUrls: ['./admin-weather.component.scss']
})
export class AdminWeatherComponent implements OnInit {
  // data from firebase
  arrCity: Array<ICity> = [];

  modalRef: BsModalRef;
  editStatus = false;
  cityId: string;

  form: FormGroup;

  sourceImg: string;

  uploadProgress: Observable<number>;
  imgLoad = true;
  // RegEXP
  extractNameImg = /%2F(.*?)\\?alt/;


  constructor(
    private modalService: BsModalService,
    private afStorage: AngularFireStorage,
    private alert: AlertService,
    private weatherService: WeatherService
  ) { }

  ngOnInit(): void {
    // Form
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      titleImg: new FormControl(null, Validators.required),
      longitude: new FormControl(null, Validators.required),
      latitude: new FormControl(null, Validators.required)
    });
    this.getCities();
  }

  // open modal window
  public openModal(modal: TemplateRef<any>) {
    this.modalRef = this.modalService.show(modal);
    this.editStatus = false;
    this.sourceImg = '';
    this.imgLoad = true;
    this.form.reset();
  }


  // get elementfrom firebase
  private getCities() {
    return this.weatherService.getAllFirebaseCity().subscribe((
      data => {
        this.arrCity = data;
      }));
  }

  // add new city to firebase
  public addCity() {
    if (this.form.invalid) {
      return;
    }
    const city: ICity = new City(
      null,
      this.form.value.name,
      this.sourceImg,
      this.form.value.longitude,
      this.form.value.latitude
    );

    delete city.id;

    this.weatherService.addFirebaseCity(city)
      .then(() => this.alert.success('місто додане у базу'))
      .catch(err => this.alert.danger(err));
    this.form.reset();
    this.modalRef.hide();
  }

  public editCity(template: TemplateRef<any>, city: any): void {
    this.modalRef = this.modalService.show(template);
    this.editStatus = true;
    this.imgLoad = false;
    this.cityId = city.id;
    this.sourceImg = city.titleImg;
    this.form.patchValue({
      name: city.name,
      longitude: city.longitude,
      latitude: city.latitude
    });
  }

  public saveEdit() {
    const city: ICity = new City(
      null,
      this.form.value.name,
      this.sourceImg,
      this.form.value.longitude,
      this.form.value.latitude
    );
    delete city.id;

    this.weatherService.updateFirebaseCity(city, this.cityId)
      .then(() => this.alert.success('інформація оновлена'))
      .catch(err => this.alert.danger(err));
    this.form.reset();
    this.modalRef.hide();
    this.sourceImg = '';
  }

  public cancelAddCity(): void {
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

  public deleteCity(city: ICity) {
    if (confirm('yes or not')) {
      if (this.arrCity.length > 1) {
        console.log((this.extractNameImg.exec(city.titleImg)[0]).substr(3).slice(0, -4));
        this.weatherService.deleteFirebaseCity(city.id)
          .then(() => this.alert.success('місто видалено'))
          .catch(err => this.alert.danger(err));
        const nameImg = (this.extractNameImg.exec(city.titleImg)[0]).substr(3).slice(0, -4);
        this.afStorage.storage.ref('images').child(`${nameImg}`).delete();
      } else { this.alert.warning('Видалити усі міста не можливо...'); }
    }
  }
}


