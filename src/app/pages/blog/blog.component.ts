import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/shared/services/post.service';
import { IPost } from 'src/app/shared/interfaces/post.interface';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  arrPosts: Array<IPost[]> = [];

  // pagination
  pageList: Array<IPost> = [];
  config = {
    itemsPerPage: 9,
    currentPage: 1,
    totalItems: this.arrPosts.length
  };

  constructor(
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.getAllPosts();
  }

  private getAllPosts() {
    return this.postService.getAllFirebasePosts().subscribe(
      data => {
        this.arrPosts = data;
      }
    );
  }

  onPageChange(event) {
    this.config.currentPage = event;
    window.scrollTo(0, 650);
  }
}
