import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {id} from "@swimlane/ngx-charts/release/utils";
import {formatLabel} from "@swimlane/ngx-charts";

@Component({
  selector: 'g[custom-chart-circle-series]',
  templateUrl: 'custom-chart-circle-series.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition(':enter', [
        style({
          opacity: 0,
        }),
        animate(250, style({opacity: 1}))
      ])
    ])
  ]
})
export class CustomChartCircleSeriesComponent implements OnChanges, OnInit {
  @Input() data;
  @Input() type = 'standard';
  @Input() xScale;
  @Input() yScale;
  @Input() colors;
  @Input() scaleType;
  @Input() visibleValue;
  @Input() activeEntries: any[];
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipTemplate: TemplateRef<any>;

  @Output() select = new EventEmitter();
  @Output() activate = new EventEmitter();
  @Output() deactivate = new EventEmitter();

  areaPath: any;
  circles: any[];
  circle: any; // active circle
  barVisible: boolean = false;
  gradientId: string;
  gradientFill: string;

  ngOnInit() {
    this.gradientId = 'grad' + id().toString();
    this.gradientFill = `url(#${this.gradientId})`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    this.circles = this.getCircles();
    this.circle = this.circles.find(c => {
      return c.opacity !== 0;
    });
  }

  getCircles(): any[] {
    const seriesName = this.data.name;

    return this.data.series.map((d, i) => {
      const value = d.value;
      const label = d.name;
      const tooltipLabel = formatLabel(label);

      if (value) {
        let cx;
        if (this.scaleType === 'time') {
          cx = this.xScale(label);
        } else if (this.scaleType === 'linear') {
          cx = this.xScale(Number(label));
        } else {
          cx = this.xScale(label);
        }

        const cy = this.yScale(this.type === 'standard' ? value : d.d1);
        const radius = 5;
        const height = this.yScale.range()[0] - cy;

        let opacity = 0;
        if (label && this.visibleValue && label.toString() === this.visibleValue.toString()) {
          opacity = 0;
        }

        let color;
        if (this.colors.scaleType === 'linear') {
          if (this.type === 'standard') {
            color = this.colors.getColor(value);
          } else {
            color = this.colors.getColor(d.d1);
          }
        } else {
          color = this.colors.getColor(seriesName);
        }

        const data = {
          series: seriesName,
          value,
          name: label
        };

        if (label && this.visibleValue && label.toString() === this.visibleValue.toString()) {
          this.select.emit({
            name: label,
            value
          });
        }

        return {
          classNames: [`circle-data-${i}`],
          value,
          label,
          data,
          cx,
          cy,
          radius,
          height,
          tooltipLabel,
          color,
          opacity,
          seriesName,
          gradientStops: this.getGradientStops(color),
          min: d.min,
          max: d.max
        };
      }
    }).filter((circle) => circle !== undefined);
  }

  getTooltipText({tooltipLabel, value, seriesName, min, max}): string {
    return `
      <span class="tooltip-label">${seriesName} • ${tooltipLabel}</span>
      <span class="tooltip-val">${value.toLocaleString()}${this.getTooltipMinMaxText(min, max)}</span>
    `;
  }

  getTooltipMinMaxText(min: any, max: any) {
    if (min !== undefined || max !== undefined) {
      let result = ' (';
      if (min !== undefined) {
        if (max === undefined) {
          result += '≥';
        }
        result += min.toLocaleString();
        if (max !== undefined) {
          result += ' - ';
        }
      } else if (max !== undefined) {
        result += '≤';
      }
      if (max !== undefined) {
        result += max.toLocaleString();
      }
      result += ')';
      return result;
    } else {
      return '';
    }
  }

  getGradientStops(color) {
    return [
      {
        offset: 0,
        color,
        opacity: 0.2
      },
      {
        offset: 100,
        color,
        opacity: 1
      }];
  }

  onClick(value, label): void {
    this.select.emit({
      name: label,
      value
    });
  }

  isActive(entry): boolean {
    if (!this.activeEntries) return false;
    const item = this.activeEntries.find(d => {
      return entry.name === d.name;
    });
    return item !== undefined;
  }

  activateCircle(): void {
    this.barVisible = true;
    this.activate.emit({name: this.data.name});
  }

  deactivateCircle(): void {
    this.barVisible = false;
    this.circle.opacity = 0;
    this.deactivate.emit({name: this.data.name});
  }

}
