import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/shared/services/post.service';
import { IPost } from 'src/app/shared/interfaces/post.interface';

@Component({
  selector: 'app-advices',
  templateUrl: './advices.component.html',
  styleUrls: ['./advices.component.scss']
})
export class AdvicesComponent implements OnInit {

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
    return this.postService.getFirebasePostsByType('advice').subscribe(
      data => {
        this.arrPosts = data;
        console.log(data);
      }
    );
  }

  onPageChange(event) {
    this.config.currentPage = event;
    window.scrollTo(0, 650);
  }
}
