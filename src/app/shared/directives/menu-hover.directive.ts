import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appMenuHover]'
})
export class MenuHoverDirective {

  constructor(
    private el: ElementRef,
    private render: Renderer2
  ) {

    // el.nativeElement.style.color = 'red';
  }

  @HostListener('mouseenter', ['$event.target']) onEnter(event: Event) {
        this.render.setStyle(this.el.nativeElement, 'margin-left', '15px');
  }

  @HostListener('mouseout', ['$event.target']) outEnter(event: Event) {
   
    this.render.setStyle(this.el.nativeElement, 'margin-left', '0');
  }

}
