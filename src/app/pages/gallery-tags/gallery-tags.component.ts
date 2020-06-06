import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Event, NavigationEnd } from '@angular/router';
import { IPhoto } from 'src/app/shared/interfaces/photo.interface';
import { GalleryService } from 'src/app/shared/services/gallery.service';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-gallery-tags',
  templateUrl: './gallery-tags.component.html',
  styleUrls: ['./gallery-tags.component.scss']
})
export class GalleryTagsComponent implements OnInit {

  arrPhoto: Array<IPhoto> = [];
  // tslint:disable-next-line: variable-name
  private _albums = [];
  searchText: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private galleryService: GalleryService,
    // tslint:disable-next-line: variable-name
    private _lightbox: Lightbox
  ) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const nameOfTag = this.activatedRoute.snapshot.paramMap.get('tag');
        this.getPhotoByTag(nameOfTag);
      }
    });
  }

  ngOnInit(): void { }

  private getPhotoByTag(tag: string): void {
    this.arrPhoto = [];
    this._albums = [];
    this.galleryService.getAllFirebasePhoto().subscribe(
      data => {
        const arr = data;
        arr.map(el => {
          if (el.tags.find(e => e.name === tag)) {
            this.arrPhoto.push(el);
            console.log(this.arrPhoto);
          }
        });

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
