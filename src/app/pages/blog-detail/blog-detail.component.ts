import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/shared/services/post.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {

  post: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.getOnePost();
  }

  private getOnePost(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.postService.getOnePostFirebase(id).subscribe(
      data => {
        this.post = data.data();
      });
  }
 
}
