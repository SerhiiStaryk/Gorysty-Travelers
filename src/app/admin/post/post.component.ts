import { Component, OnInit, TemplateRef } from '@angular/core';
import { PostService } from 'src/app/shared/services/post.service';
import { IPost } from 'src/app/shared/interfaces/post.interface';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IComment } from 'src/app/shared/interfaces/comments.interface';
import { findIndex } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  arrPosts: Array<IPost[]> = [];
  arrComments: Array<IComment> = [];

  postComment: IPost;
  postCommentID: string;

  publishStatus: boolean;

  modalRef: BsModalRef;

  // RegEXP
  extractNameImg = /%2F(.*?)\\?alt/;

  // sort
  sortDisabled = true;
  sortBy = '';
  sortDirection = true;
  noSortPostTitle = true;
  noSortPostDate = true;

  constructor(
    public postService: PostService,
    public alert: AlertService,
    private afStorage: AngularFireStorage,
    private modalService: BsModalService
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

        const nameImg = (this.extractNameImg.exec(post.titleImg)[0]).substr(3).slice(0, -4);
        this.afStorage.storage.ref('images').child(`${nameImg}`).delete();

      } else { this.alert.warning('Видалити всі пости не можливо'); }
    }
  }

  public setPublish(post: IPost): void {
    post.publish = !post.publish;
    this.postService.updateFirebasePost(post, post.id)
      .then(() => this.alert.success('оновлено'))
      .catch(err => this.alert.danger(err));
  }

  private clearSortArrow() {
    this.noSortPostTitle = true;
    this.noSortPostDate = true;
  }

  // Sort
  public ShowEvent(event: any): string {
    this.sortDisabled = false;
    this.sortDirection = !this.sortDirection;
    this.clearSortArrow();
    if (event.target.textContent === 'Тема') {
      console.log('work');

      this.noSortPostTitle = false;
      return this.sortBy = 'title';
    }
    if (event.target.textContent === 'Дата') {
      console.log('work');
      this.noSortPostDate = false;
      return this.sortBy = 'date';
    }
  }

  public openModal(template: TemplateRef<any>, post: IPost) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
    this.arrComments = post.comments;
    this.postComment = post;
    this.postCommentID = post.id;

  }

  public deleteComment(comment: IComment): void {
    const idx = this.arrComments.findIndex(el => el === comment);
    this.postComment.comments.splice(idx, 1);
    this.postService.updateFirebasePost(this.postComment, this.postCommentID)
      .then(() => this.alert.success('коментар видалено'))
      .catch(err => this.alert.danger(err));
  }
}
