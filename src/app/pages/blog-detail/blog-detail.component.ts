import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/shared/services/post.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IComment } from 'src/app/shared/interfaces/comments.interface';
import { Comment } from 'src/app/shared/modules/comment.module';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {

  post: any;
  form: FormGroup;
  arrComments: Array<any> = [];
  arrIdx: Array<string> = [];

  postId: string;
  nextIdPost: string;
  nextNamePost: string;
  previousIdPost: string;
  previousNamePost: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.getOnePost();

    this.form = new FormGroup({
      userName: new FormControl(null, Validators.required),
      userEmail: new FormControl(null, [Validators.required, Validators.email]),
      comment: new FormControl(null, Validators.required)
    });
  }

  private getOnePost(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.postService.getOnePostFirebaseByType(id, 'post').subscribe(
      data => {
        this.post = data.data();
        this.postId = this.post.id;
        this.arrComments = this.post.comments;
      });

    this.postService.getAllFirebasePostsID().subscribe(
      data => {
        data.map(el => {
          this.arrIdx.push(el.id);
        });
        const findIdx = (el: string) => el === id;
        const Idx = this.arrIdx.findIndex(findIdx);
        const nextIdx = Idx + 1;
        const previousIdx = Idx - 1;

        if (nextIdx > this.arrIdx.length) {
          this.nextIdPost = this.arrIdx.shift();
          this.postService.getOnePostFirebaseByType(this.nextIdPost, 'post').subscribe(
            a => {
              const post = a.data();
              this.nextNamePost = post.title;
            });
        } else {
          this.nextIdPost = this.arrIdx.splice(nextIdx, 1)[0];
          this.postService.getOnePostFirebaseByType(this.nextIdPost, 'post').subscribe(
            a => {
              const post = a.data();
              this.nextNamePost = post.title;
            });
        }

        if (previousIdx < 0) {
          this.previousIdPost = this.arrIdx.pop();
          this.postService.getOnePostFirebaseByType(this.previousIdPost, 'post').subscribe(
            a => {
              const post = a.data();
              this.previousNamePost = post.title;
            });
        } else {
          this.previousIdPost = this.arrIdx.splice(previousIdx, 1)[0];
          this.postService.getOnePostFirebaseByType(this.previousIdPost, 'post').subscribe(
            a => {
              const post = a.data();
              this.previousNamePost = post.title;
            });
        }
      }
    );
  }

  public createComment() {
    if (this.form.invalid) {
      return;
    }

    const newComment: IComment = new Comment(
      `${(+(new Date())).toString(16)}`,
      this.form.value.userName,
      this.form.value.userEmail,
      new Date(),
      this.form.value.comment,
      true
    );

    this.arrComments.push(Object.assign({}, newComment));

    this.postService.updateFirebasePost(this.post, this.postId)
      .then(() => console.log(this.post.date))
      .catch(err => console.log(err)
      );
    this.form.reset();
    window.location.reload();
  }
}
