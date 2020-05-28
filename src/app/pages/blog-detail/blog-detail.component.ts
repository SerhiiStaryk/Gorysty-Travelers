import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/shared/services/post.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IComment } from 'src/app/shared/interfaces/comments.interface';
import { Comment } from 'src/app/shared/models/comment.module';
import { IPost } from 'src/app/shared/interfaces/post.interface';
import { Post } from 'src/app/shared/models/post.module';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { ITag } from 'src/app/shared/interfaces/tag.interface';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {

  post: any;
  form: FormGroup;
  arrComments: Array<any> = [];

  postId: string;
  editCategory: ICategory;
  postImage: string;
  title: string;
  description: string;
  text: string;
  date: Date;
  author: string;
  Tags: Array<ITag>;
  // this.arrComments,
  statusPublish: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private alert: AlertService
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
    this.postService.getOnePostFirebase(id).subscribe(
      data => {
        this.post = data.data();
        this.postId = this.post.id;
        this.editCategory = this.post.category;
        this.postImage = this.post.titleImg;
        this.title = this.post.title;
        this.description = this.post.description;
        this.text = this.post.text;
        this.date = this.post.date;
        this.author = this.post.author;
        this.Tags = this.post.tags;
        this.arrComments = this.post.comments;
        this.statusPublish = this.post.publish;
        // console.log('this.post', this.post);
        // console.log('this.postId', this.postId);
        // console.log('this.editCategory', this.editCategory);
        // console.log('this.postImage', this.postImage);
        // console.log('this.title', this.title);
        // console.log('this.description', this.description);
        // console.log('this.text', this.text);
        // console.log('this.date', this.date);
        // console.log('this.author', this.author);
        // console.log('this.Tags', this.Tags);
        // console.log('this.arrComments', this.arrComments);
        // console.log('this.statusPublish', this.statusPublish);
      });
  }

  public createComment() {
    if (this.form.invalid) {
      return;
    }

    const newComment: IComment = new Comment(
      '1',
      this.form.value.userName,
      this.form.value.userEmail,
      new Date(),
      this.form.value.comment,
      true
    );

    this.arrComments.push(Object.assign({}, newComment));

    console.log(this.arrComments);


    const newPost: IPost = new Post(
      null,
      this.editCategory,
      this.postImage,
      this.title,
      this.description,
      this.text,
      this.date,
      this.author,
      this.Tags,
      this.arrComments,
      this.statusPublish
    );

    console.log(newPost);
    console.log(this.postId);
    console.log(this.arrComments);

    delete newPost.id;

    this.postService.updateFirebasePost(newPost, this.postId);
  }

}
