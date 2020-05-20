import { Component, OnInit } from '@angular/core';
import { IPost } from 'src/app/shared/interfaces/post.interface';
import { PostService } from 'src/app/shared/services/post.service';
import { GalleryService } from 'src/app/shared/services/gallery.service';
import { IPhoto } from 'src/app/shared/interfaces/photo.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  arrPost: Array<IPost[]> = [];
  arrPhoto: Array<IPhoto[]> = [];

  constructor(
    private postService: PostService,
    private galleryService: GalleryService
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
      date => {
        this.arrPhoto = date;
      }));
  }
}
