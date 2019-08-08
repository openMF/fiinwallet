import { Directive, ElementRef, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Gesture } from 'ionic-angular/gestures/gesture';


/**
 * Generated class for the SwipeSegmentDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[swipe-segment]' // Attribute selector
})
export class SwipeSegmentDirective implements OnInit{
  el: HTMLElement;
  swipeGesture: Gesture;

  @Input() tabsList: Array<string> = [];
  @Input() currentTab: string = '';
  @Output() tabChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor(public _el: ElementRef) {
    this.el = _el.nativeElement;
  }

  ngOnInit() {
    this.swipeGesture = new Gesture(this.el);
    this.swipeGesture.listen();
    this.swipeGesture.on('swipe', (event) => {
      this.swipeHandler(event);
    })

}
  swipeHandler(event) {
    if (event.direction == '2') {
      // move forward
      const currentIndex = this.tabsList.indexOf(this.currentTab),
        nextIndex = currentIndex + 1;

      if (nextIndex < this.tabsList.length) {
        this.currentTab = this.tabsList[nextIndex];
        this.tabChanged.emit(this.currentTab);
      }
    } else if (event.direction == '4') {
      // move backward
      const currentIndex = this.tabsList.indexOf(this.currentTab),
        nextIndex = currentIndex - 1;

      if (nextIndex >= 0) {
        this.currentTab = this.tabsList[nextIndex];
        this.tabChanged.emit(this.currentTab);
      }
    }
  }
}
