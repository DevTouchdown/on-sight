import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';

import $ from 'jquery';

@Directive({
  selector: '[onSight]'
})
export class OnSightDirective implements AfterViewInit, OnDestroy {

  @Input() osThreshold: "full" | "partial" = "partial";
  @Input() osContainer: "standalone" | "iframe" | "webview" = "standalone";
  @Input() osAxis: "horizontal" | "vertical" | "both" = "vertical";
  @Input() osDeviation: number = 1;

  @Output() onSight: EventEmitter<boolean> = new EventEmitter();

  private container: any;
  private element: any;
  private standalone: boolean;
  private target: any;

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    this.setPrivateProperties();
    this.registerScrollEvent();
  }

  setPrivateProperties(): void {
    this.standalone = (this.osContainer === 'standalone');
    this.element = $(this.el.nativeElement)[0];
    this.target = (this.standalone)
      ? window
      : window.parent;
    this.container = (!this.standalone)
      ? $(this.target.document).find(this.osContainer)
      : undefined;
  }

  registerScrollEvent(): void {
    $(this.target.document).scroll(() => {
      this.onSight.emit((this.isElementOnHorizontalAxis() && this.isElementOnVerticalAxis()));
    });
  }


  isElementOnHorizontalAxis(): boolean {
    if (this.osAxis === 'vertical') {
      return true;
    }

    if (!this.standalone && (this.container && this.container.length === 0)) {
      return false;
    }

    const containerDistanceToLeft = (this.standalone)
      ? 0
      : this.container[0].offsetLeft;

    const scrollDistanceToLeft = $(this.target.document).scrollLeft();
    const parentWidth = $(this.target).width();

    const elementDistanceToContainerLeft = this.element.offsetLeft;
    const elementWidth = this.element.clientWidth;

    const elementStartsAt = scrollDistanceToLeft + parentWidth - elementDistanceToContainerLeft - containerDistanceToLeft;
    const elementEndsAt = (elementDistanceToContainerLeft + containerDistanceToLeft);

    return (this.osThreshold === 'full')
      ? (elementStartsAt - elementWidth > 0) && (scrollDistanceToLeft - this.osDeviation <= elementEndsAt)
      : (elementStartsAt > 0) && (scrollDistanceToLeft - this.osDeviation <= elementEndsAt + elementWidth)
  }

  isElementOnVerticalAxis(): boolean {
    if (this.osAxis === 'horizontal') {
      return true;
    }

    if (!this.standalone && (this.container && this.container.length === 0)) {
      return false;
    }

    const containerDistanceToTop = (this.standalone)
      ? 0
      : this.container[0].offsetTop;

    const scrollDistanceToTop = $(this.target.document).scrollTop();
    const parentHeight = $(this.target).height();

    const elementDistanceToContainerTop = this.element.offsetTop;
    const elementHeight = this.element.clientHeight;

    const elementStartsAt = scrollDistanceToTop + parentHeight - elementDistanceToContainerTop - containerDistanceToTop;
    const elementEndsAt = (elementDistanceToContainerTop + containerDistanceToTop);

    return (this.osThreshold === 'full')
      ? (elementStartsAt - elementHeight > 0) && (scrollDistanceToTop - this.osDeviation <= elementEndsAt)
      : (elementStartsAt > 0) && (scrollDistanceToTop - this.osDeviation <= elementEndsAt + elementHeight)
  }

  ngOnDestroy(): void {
    this.unregisterScrollEvent();
  }

  unregisterScrollEvent(): void {
    $(this.target.document).off('scroll');
  }
}
