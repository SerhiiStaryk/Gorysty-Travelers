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

  publishStatus: boolean;

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
      }
    );
  }

  public deletePost(post: IPost): void {
    if (confirm('yes or not')) {
      if (this.arrPosts.length > 1) {
        this.postService.deleteFirebasePost(post.id)
          .then(() => this.alert.success('Пост видалений з бази'))
          .catch(err => this.alert.danger(err));
      } else { this.alert.warning('Видалити всі пости не можливо') }
    }
  }

  public setPublish(post: IPost): void {
    post.publish = !post.publish;
    this.postService.updateFirebasePost(post, post.id)
      .then(() => this.alert.success('оновлено'))
      .catch(err => this.alert.danger(err));

  }
}
