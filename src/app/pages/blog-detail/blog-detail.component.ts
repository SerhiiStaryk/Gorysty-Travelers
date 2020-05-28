import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/shared/services/post.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {

  post: any;
  form: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService

  ) { }

  ngOnInit(): void {
    this.getOnePost();

    this.form = new FormGroup({
      userName: new FormControl (null, Validators.required),
      userEmail: new FormControl (null, [Validators.required, Validators.email]),
      comment: new FormControl (null, Validators.required)
    });
  }

  private getOnePost(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.postService.getOnePostFirebase(id).subscribe(
      data => {
        this.post = data.data();
        console.log(this.post); 
      });
  }

  private createComment(){

  }
 
}
