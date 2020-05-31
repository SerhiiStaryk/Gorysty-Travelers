import { Component, OnInit } from '@angular/core';
import { IPhoto } from 'src/app/shared/interfaces/photo.interface';
import { GalleryService } from 'src/app/shared/services/gallery.service';
import { ITag } from 'src/app/shared/interfaces/tag.interface';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  arrPhoto: Array<IPhoto> = [];
  arrTag: Array<ITag[]> = [];
  // tslint:disable-next-line: variable-name
  private _albums = [];

  constructor(
    private galleryService: GalleryService,
    // tslint:disable-next-line: variable-name
    private _lightbox: Lightbox
  ) { }

  ngOnInit(): void {
    this.getPhoto();
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

  public close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }
}
