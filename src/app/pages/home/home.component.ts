import { Component, OnInit } from '@angular/core';
import { IPost } from 'src/app/shared/interfaces/post.interface';
import { PostService } from 'src/app/shared/services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  arrPost: Array<IPost[]> = [];

  constructor(
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.getLatestPosts();
  }

  private getLatestPosts() {
    this.postService.getLimitPostFirebade(3).subscribe((
      date => {
        this.arrPost = date;
      }
    ));
  }
}
