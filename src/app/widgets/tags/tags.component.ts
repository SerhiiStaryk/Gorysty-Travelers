import { Component, OnInit } from '@angular/core';
import { ITag } from 'src/app/shared/interfaces/tag.interface';
import { TagsService } from 'src/app/shared/services/tags.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  arrTags: Array<ITag[]> = [];

  constructor(private tagService: TagsService) { }

  ngOnInit(): void {
    this.getLimitTags();
  }

  private getLimitTags(): void {
    this.tagService.getLimitFirebaseTags().subscribe(
      data => {
        this.arrTags = data;
      });
  }

}
