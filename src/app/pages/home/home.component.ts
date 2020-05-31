import { Component, OnInit } from '@angular/core';
import { IPost } from 'src/app/shared/interfaces/post.interface';
import { PostService } from 'src/app/shared/services/post.service';
import { GalleryService } from 'src/app/shared/services/gallery.service';
import { IPhoto } from 'src/app/shared/interfaces/photo.interface';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  arrPost: Array<IPost[]> = [];
  arrPhoto: Array<IPhoto> = [];
  // tslint:disable-next-line: variable-name
  private _albums = [];

  constructor(
    private postService: PostService,
    private galleryService: GalleryService,
    // tslint:disable-next-line: variable-name
    private _lightbox: Lightbox
  ) { }

  ngOnInit(): void {
    this.getLatestPosts();
    this.getLatestPhoto();
  }

  private getLatestPosts() {
    this.postService.getLimitPostFirebade(3).subscribe((
      date => {
        this.arrPost = date;
      }));
  }

  private getLatestPhoto() {
    this.galleryService.getLimitPhotoFirebade(4).subscribe((
      data => {
        this.arrPhoto = data;
        this.arrPhoto.map(el => {
          const album = {
            src: el.source
          };
          this._albums.push(album);
        });
      }));
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
