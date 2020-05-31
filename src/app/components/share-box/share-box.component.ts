import { Component, OnInit, Input } from '@angular/core';
import { IPost } from 'src/app/shared/interfaces/post.interface';

@Component({
  selector: 'app-share-box',
  templateUrl: './share-box.component.html',
  styleUrls: ['./share-box.component.scss']
})
export class ShareBoxComponent implements OnInit {

  @Input() postId: string;
  telegramURL: string;
  pinteresrURL: string;
  facebookURL: string;

  constructor() { }

  ngOnInit(): void {
    // tslint:disable-next-line: max-line-length
    this.telegramURL = `https://telegram.me/share/url?url=https://gorystytravelers.web.app/blog-detail/${this.postId}&text=gorystytravelers`;
    this.pinteresrURL = `https://www.pinterest.com/pin/create/button/?url=https://gorystytravelers.web.app/blog-detail/${this.postId}`;
    this.facebookURL = `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fgorystytravelers.web.app%2Fblog-detail%2F${this.postId}&amp;src=sdkpreparse`;
  }


}
