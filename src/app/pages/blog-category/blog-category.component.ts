import { Component, OnInit } from '@angular/core';
import { IPost } from 'src/app/shared/interfaces/post.interface';
import { PostService } from 'src/app/shared/services/post.service';
import { Router, ActivatedRoute, Event, NavigationEnd } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-blog-category',
  templateUrl: './blog-category.component.html',
  styleUrls: ['./blog-category.component.scss']
})
export class BlogCategoryComponent implements OnInit {

  arrayPost: Array<IPost[]> = [];
  titlePage: string;
  descriptionPage: string;
  category: Array<ICategory[]> = [];

  // pagination
  pageList: Array<IPost> = [];
  config = {
    itemsPerPage: 4,
    currentPage: 1,
    totalItems: this.arrayPost.length
  };

  constructor(
    private postService: PostService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore,
    private categoryService: CategoryService
  ) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const nameOfCategory = this.activatedRoute.snapshot.paramMap.get('category');
        this.titlePage = nameOfCategory;
        this.getPostByCategory(nameOfCategory);
        this.getCategory(nameOfCategory);
      }
    });
  }

  ngOnInit(): void { }

  private getPostByCategory(category: string): void {
    this.postService.getFirebasePostsByCategory(category).subscribe(
      data => {
        this.arrayPost = data;
      });
  }

  private getCategory(name: string): void {
    this.categoryService.getOneFirebaseCategoryByName(name).subscribe(
      data => {
        const tempCategory = data;
        this.category = tempCategory;
      });
  }


  public onPageChange(event) {
    this.config.currentPage = event;
    window.scrollTo(0, 0);
  }
}
