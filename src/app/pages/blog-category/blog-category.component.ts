import { Component, OnInit } from '@angular/core';
import { IPost } from 'src/app/shared/interfaces/post.interface';
import { PostService } from 'src/app/shared/services/post.service';
import { Router, ActivatedRoute, Event, NavigationEnd } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';



@Component({
  selector: 'app-blog-category',
  templateUrl: './blog-category.component.html',
  styleUrls: ['./blog-category.component.scss']
})
export class BlogCategoryComponent implements OnInit {

  arrayPost: any;
  titlePage: string;
  descriptionPage: string;

  constructor(
    private postService: PostService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore
  ) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const nameOfCategory = this.activatedRoute.snapshot.paramMap.get('category');
        this.titlePage = nameOfCategory;
        this.getPostByCategory(nameOfCategory);
      }
    })
  }

  ngOnInit(): void { }


  private getPostByCategory(category: string) {
    this.postService.getFirebasePostsByCategory(category).subscribe(
      data => {
        this.arrayPost = data;
      });
  }
}
