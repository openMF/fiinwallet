import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  Renderer,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'g[custom-chart-tooltip-area]',
  templateUrl: 'custom-chart-tooltip-area.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition('inactive => active', [
        style({
          opacity: 0,
        }),
        animate(250, style({opacity: 0.7}))
      ]),
      transition('active => inactive', [
        style({
          opacity: 0.7,
        }),
        animate(250, style({opacity: 0}))
      ])
    ])
  ]
})
export class CustomChartTooltipAreaComponent {
  anchorOpacity: number = 0;
  anchorPos: number = -1;
  anchorValues: any[] = [];
  lastAnchorPos: number;
  color = '#f26bf7';

  @Input() dims;
  @Input() xSet;
  @Input() xScale;
  @Input() yScale;
  @Input() results;
  @Input() colors;
  @Input() showPercentage: boolean = false;
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipTemplate: TemplateRef<any>;

  @Output() hover = new EventEmitter();
  @Output() touch = new EventEmitter();
  @Output() touchEnd = new EventEmitter();

  @ViewChild('tooltipAnchor') tooltipAnchor;

  constructor(private renderer: Renderer) {
  }

  getValues(xVal): any[] {
    const results = [];

    for (const group of this.results) {
      const item = group.series.find(d => d.name.toString() === xVal.toString());
      let groupName = group.name;
      if (groupName instanceof Date) {
        groupName = groupName.toLocaleDateString();
      }

      if (item) {
        const label = item.name;
        let val = item.value;
        if (this.showPercentage) {
          val = (item.d1 - item.d0).toFixed(2) + '%';
        }
        let color;
        if (this.colors.scaleType === 'linear') {
          let v = val;
          if (item.d1) {
            v = item.d1;
          }
          color = this.colors.getColor(v);
        } else {
          color = this.colors.getColor(group.name);
        }

        results.push({
          value: val,
          name: label,
          series: groupName,
          min: item.min,
          max: item.max,
          color
        });
      }
    }

    return results;
  }

  mouseMove(event) {
    const xPos = event.offsetX - this.dims.xOffset;
    const closestIndex = this.findClosestPointIndex(xPos);
    const closestPoint = this.xSet[closestIndex];
    this.anchorPos = this.xScale(closestPoint);
    this.anchorPos = Math.max(0, this.anchorPos);
    this.anchorPos = Math.min(this.dims.width, this.anchorPos) - 1.5;

    this.anchorValues = this.getValues(closestPoint);
    if (this.anchorPos !== this.lastAnchorPos) {
      const ev = new MouseEvent('mouseleave', {bubbles: false});
      this.renderer.invokeElementMethod(this.tooltipAnchor.nativeElement, 'dispatchEvent', [ev]);
      this.anchorOpacity = 0.7;
      this.hover.emit({
        value: closestPoint
      });
      // this.showTooltip();

      this.lastAnchorPos = this.anchorPos;
    }
  }

  touchMove(event) {
    const xPos = event.targetTouches[0].pageX - this.dims.xOffset;
    const closestIndex = this.findClosestPointIndex(xPos);
    const closestPoint = this.xSet[closestIndex];
    this.anchorPos = this.xScale(closestPoint);
    this.anchorPos = Math.max(0, this.anchorPos);
    this.anchorPos = Math.min(this.dims.width, this.anchorPos) - 1.5;

    this.anchorValues = this.getValues(closestPoint);
    if (this.anchorPos !== this.lastAnchorPos) {
      const ev = new MouseEvent('mouseleave', {bubbles: false});
      this.renderer.invokeElementMethod(this.tooltipAnchor.nativeElement, 'dispatchEvent', [ev]);
      this.anchorOpacity = 0.7;
      this.touch.emit({
        value: closestPoint
      });
      // this.showTooltip();

      this.lastAnchorPos = this.anchorPos;
    }
  }

  findClosestPointIndex(xPos) {
    let minIndex = 0;
    let maxIndex = this.xSet.length - 1;
    let minDiff = Number.MAX_VALUE;
    let closestIndex = 0;

    while (minIndex <= maxIndex) {
      const currentIndex = (minIndex + maxIndex) / 2 | 0;
      const currentElement = this.xScale(this.xSet[currentIndex]);

      const curDiff = Math.abs(currentElement - xPos);

      if (curDiff < minDiff) {
        minDiff = curDiff;
        closestIndex = currentIndex;
      }

      if (currentElement < xPos) {
        minIndex = currentIndex + 1;
      } else if (currentElement > xPos) {
        maxIndex = currentIndex - 1;
      } else {
        minDiff = 0;
        closestIndex = currentIndex;
        break;
      }
    }

    return closestIndex;
  }

  showTooltip(): void {
    const event = new MouseEvent('mouseenter', {bubbles: false});
    this.renderer.invokeElementMethod(this.tooltipAnchor.nativeElement, 'dispatchEvent', [event]);
  }

  hideTooltip(): void {
    const event = new MouseEvent('mouseleave', {bubbles: false});
    this.renderer.invokeElementMethod(this.tooltipAnchor.nativeElement, 'dispatchEvent', [event]);
    this.anchorOpacity = 0;
    this.lastAnchorPos = -1;
    this.touchEnd.emit();
  }

  getToolTipText(tooltipItem: any): string {
    let result: string = '';
    if (tooltipItem.series !== undefined) {
      result += tooltipItem.series;
    } else {
      result += '???';
    }
    result += ': ';
    if (tooltipItem.value !== undefined) {
      result += tooltipItem.value.toLocaleString();
    }
    if (tooltipItem.min !== undefined || tooltipItem.max !== undefined) {
      result += ' (';
      if (tooltipItem.min !== undefined) {
        if (tooltipItem.max === undefined) {
          result += '≥';
        }
        result += tooltipItem.min.toLocaleString();
        if (tooltipItem.max !== undefined) {
          result += ' - ';
        }
      } else if (tooltipItem.max !== undefined) {
        result += '≤';
      }
      if (tooltipItem.max !== undefined) {
        result += tooltipItem.max.toLocaleString();
      }
      result += ')';
    }
    return result;
  }

}

