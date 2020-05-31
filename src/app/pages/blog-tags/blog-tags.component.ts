import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Event, NavigationEnd } from '@angular/router';
import { IPost } from 'src/app/shared/interfaces/post.interface';
import { PostService } from 'src/app/shared/services/post.service';

@Component({
  selector: 'app-blog-tags',
  templateUrl: './blog-tags.component.html',
  styleUrls: ['./blog-tags.component.scss']
})
export class BlogTagsComponent implements OnInit {

  arrPosts: Array<IPost> = [];

  // pagination
  pageList: Array<IPost> = [];
  config = {
    itemsPerPage: 9,
    currentPage: 1,
    totalItems: this.arrPosts.length
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private postService: PostService
  ) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const nameOfTag = this.activatedRoute.snapshot.paramMap.get('tag');
        this.getPostByTag(nameOfTag);
      }
    });
  }

  ngOnInit(): void { }

  private getPostByTag(tag: string): void {
    this.postService.getAllFirebasePosts().subscribe(
      data => {
        const arr = data;
        arr.map(el => {
          if (el.tags.find(e => e.name === tag)) {
            this.arrPosts.push(el);
          }
        });
      });
  }

  onPageChange(event) {
    this.config.currentPage = event;
    window.scrollTo(0, 650);
  }



}
