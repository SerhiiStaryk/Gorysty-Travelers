import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { CategoryService } from 'src/app/shared/services/category.service';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  arrCategory: any;
  localCategories: any;

  constructor(
    private categoryService: CategoryService,
    private firestore: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.getAllCategory();
    setTimeout(() => {
      this.setCountCategory();
    }, 1000);
  }

  private getAllCategory(): void {
    this.categoryService.getAllFirebaseCategories().subscribe(
      data => {
        this.arrCategory = data;
        console.log(this.arrCategory);
        sessionStorage.setItem('category', JSON.stringify(this.arrCategory));
      }
    );
  }

  private setCountCategory() {
    this.localCategories = JSON.parse(sessionStorage.getItem('category'));
    // console.log(this.localCategories);

    this.localCategories.map(el => {
      this.firestore.collection<any>('posts', ref => ref.where('category.name', '==', el.name)).get().subscribe(
        snap => {
          el.count = snap.size;
        });
    });
  }
}




