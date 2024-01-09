import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdownDirective]'
})
export class DropdownDirectiveDirective {
  isOpen=false
  @HostListener('click') mouseClick(){
    this.isOpen=!this.isOpen
    if(this.isOpen){
      this.renderer.addClass(this.elRef.nativeElement,'open')
    }
    else{
      this.renderer.removeClass(this.elRef.nativeElement,'open')
    }
  }
  constructor(private renderer:Renderer2,private elRef:ElementRef) { }

}
