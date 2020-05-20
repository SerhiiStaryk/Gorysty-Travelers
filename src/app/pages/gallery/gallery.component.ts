import { Component, OnInit } from '@angular/core';
import { IPhoto } from 'src/app/shared/interfaces/photo.interface';
import { GalleryService } from 'src/app/shared/services/gallery.service';
import { ITag } from 'src/app/shared/interfaces/tag.interface';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  arrPhoto: Array<IPhoto[]> = [];
  arrTag: Array<ITag[]> = [];

  constructor(
    private galleryService: GalleryService
  ) { }

  ngOnInit(): void {
    this.getPhoto();
  }

  private getPhoto() {
    this.galleryService.getAllFirebasePhoto().subscribe(
      data => {
        this.arrPhoto = data;
        console.log(this.arrPhoto);

      });
  }

}
