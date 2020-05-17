import { Component, OnInit } from '@angular/core';
import { IPost } from 'src/app/shared/interfaces/post.interface';
import { PostService } from 'src/app/shared/services/post.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-latest-posts',
  templateUrl: './latest-posts.component.html',
  styleUrls: ['./latest-posts.component.scss']
})
export class LatestPostsComponent implements OnInit {

  arrPost: Array<IPost[]> = [];

  constructor(
    private postService: PostService,
    private router: Router
  ) {
    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        // trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        // if you need to scroll back to top, here is the right place
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit(): void {
    this.getLatesPost();
  }

  private getLatesPost(): void {
    this.postService.getLimitPostFirebade(5).subscribe(
      data => {
        this.arrPost = data;
      }
    );
  }

}
