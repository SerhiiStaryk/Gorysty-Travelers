import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Event, NavigationEnd } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { CategoryService } from 'src/app/shared/services/category.service';
import { IPhoto } from 'src/app/shared/interfaces/photo.interface';
import { GalleryService } from 'src/app/shared/services/gallery.service';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-gallery-category',
  templateUrl: './gallery-category.component.html',
  styleUrls: ['./gallery-category.component.scss']
})
export class GalleryCategoryComponent implements OnInit {

  arrPhoto: Array<IPhoto> = [];
  // tslint:disable-next-line: variable-name
  private _albums = [];
  searchText: string;

  category: Array<ICategory[]> = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore,
    private categoryService: CategoryService,
    private galleryService: GalleryService,
    // tslint:disable-next-line: variable-name
    private _lightbox: Lightbox
  ) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const nameOfCategory = this.activatedRoute.snapshot.paramMap.get('category');
        this.getPhotoByCategory(nameOfCategory);
      }
    });
  }

  ngOnInit(): void {
    this.getPhoto();
  }

  private getPhotoByCategory(category: string): void {
    this.galleryService.getFirebasePhotoByCategory(category).subscribe(
      data => {
        this.arrPhoto = data;
      });
  }

  private getPhoto() {
    this.galleryService.getAllFirebasePhoto().subscribe(
      data => {
        this.arrPhoto = data;
        this.arrPhoto.map(el => {
          const album = {
            src: el.source
          };
          this._albums.push(album);
        });
      });
  }

  public open(index: number): void {
    // open lightbox
    this._lightbox.open(this._albums, index);
  }

}
