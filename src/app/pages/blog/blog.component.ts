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
        console.log(this.arrPosts);
      }
    );
  }



}
