import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  arrCategories: Array<any> = [];

  constructor(
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.getCategories()
  }

  private getCategories() {
    return this.categoryService.getAllFirebaseCategories().subscribe((
      data => {
        this.arrCategories = data;
      }
    ));
  }

}
