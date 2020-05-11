import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/shared/services/post.service';
import { IPost } from 'src/app/shared/interfaces/post.interface';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  arrPosts: Array<IPost[]> = [];

  constructor(
    public postService: PostService,
    public alert: AlertService
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

  public deletePost(post: IPost): void {
    if (confirm('yes or Not')) {
      this.postService.deleteFirebasePost(post.id)
        .then(() => this.alert.warning('Пост видалений з бази'))
        .catch(err => this.alert.danger(err));
    }
  }
}
