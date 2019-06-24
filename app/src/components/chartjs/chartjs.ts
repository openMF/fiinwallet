import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import * as moment from 'moment';
import Chart from 'chart.js';

@Component({
  selector: 'chartjs',
  templateUrl: 'chartjs.html'
})
export class ChartjsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: Object;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('scrubberX') scrubberX: ElementRef;
  @ViewChild('scrubberY') scrubberY: ElementRef;
  @ViewChild('chart') chart: ElementRef;
  chartjs: Chart;
  scrubberXPos: number;
  scrubberYPos: number;
  isLoading: boolean = true;
  allTicksPositions: any;
  currentTick: any;
  requestAnimation: any = null;
  canvasClientWidth: number;
  canvasClientHeight: number;
  @Output() price = new EventEmitter();
  @Output() date = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.destroyChart();
    const chartDataExists = changes.data.currentValue && changes.data.currentValue.labels.length > 0 && changes.data.currentValue.data.length > 0;
    if (chartDataExists) {
      this.isLoading = false;
      this.chartJS(changes.data.currentValue.labels, changes.data.currentValue.data);
    } else {
      this.isLoading = true;
    }
  }

  ngOnDestroy() {
    this.destroyChart();
  }

  chartJS(labels, data) {
    this.chartjs = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            'transparent',
          ],
          borderColor: [
            // TODO Different theme colors
            'rgba(114, 78, 94, 1)', // purple
            'rgba(78, 105, 141, 1)', // blue
            'rgba(159, 228, 32, 1)',
            'rgba(228, 107, 32, 1)',
            'rgba(228, 32, 110, 1)',
          ],
          borderWidth: 3,
          pointRadius: 0,
        }]
      },
      options: this.chartJsOptions()
    });
    this.canvasClientWidth = this.chartjs.canvas.clientWidth;
    this.canvasClientHeight = this.chartjs.canvas.clientHeight;
    this.getAllTickPositions();
  }

  private getAllTickPositions() {
    const data = this.chartjs.config.data.datasets[0]['_meta'];
    const firstKey = Object.keys(data)[0];
    const ticksArray = data[firstKey]['data'];

    this.allTicksPositions = ticksArray.map(item => {
      return {
        index: item['_index'],
        x: item['_model'].x,
        y: item['_model'].y,
        labels: this.chartjs.data.labels[item['_index']],
        value: this.chartjs.data.datasets[0].data[item['_index']],
      };
    });

    this.calculateCoordinates(this.allTicksPositions[this.allTicksPositions.length - 1]);
  }

  setScrubberPosition(evt) {
    const range = this.calculateRange();
    const targetTouch = evt.targetTouches[0];
    const xPos = Math.round(targetTouch.pageX);

    this.allTicksPositions.find(tick => {
      // console.log((xPos >= (tick.x - range) && xPos <= (tick.x + range)) + '--xPos: ' + xPos + ' --tick.x: ' + tick.x + '--range: ' + Math.floor(range));
      if (xPos >= (tick.x - range) && xPos <= (tick.x + range)) {
        this.currentTick = tick;
        this.calculateCoordinates(tick, () => {
          this.updatePriceAndDate(tick.labels, tick.value);
        });
      }
    });
  }

  private calculateRange() {
    const range = ((this.allTicksPositions[1].x - this.allTicksPositions[0].x) / 2);
    return range >= 0 ? range : 0;
  }

  glideToOriginalPosition() {
    const range = this.calculateRange();
    let isLastTick: boolean = false;
    let lastTickPositionReached: boolean = false;
    const speed = 6;
    const fps = 30;
    const then = Date.now();
    const interval = 1000 / fps;
    let now;
    let delta;
    const boundry = 0 - (this.scrubberX.nativeElement.clientWidth / 2);

    const animate = () => {
      now = Date.now();
      delta = now - then;

      if (delta > interval) {
        this.scrubberXPos = this.scrubberXPos - speed;

        if (isLastTick) {
          lastTickPositionReached = this.scrubberXPos === 0 - (this.scrubberX.nativeElement.clientWidth / 2);
        } else {
          const originalXPos = this.canvasClientWidth - this.scrubberXPos;
          this.allTicksPositions.find(tick => {
            if (originalXPos >= (tick.x - range) && originalXPos <= (tick.x + range)) {
              this.currentTick = tick;
              this.scrubberYPos = tick.y;
              this.updatePriceAndDate(tick.labels, tick.value);
              isLastTick = this.allTicksPositions.indexOf(this.currentTick) === 0;
            }
          });
        }
      }

      if (!lastTickPositionReached && this.scrubberXPos > boundry && this.scrubberXPos > -50) {
        this.requestAnimation = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(this.requestAnimation);
        this.resetDateAndPrice();
      }
    };
    this.requestAnimation = requestAnimationFrame(animate);
  }

  private resetDateAndPrice() {
    this.price.emit(null);
    this.date.emit(null);
  }

  private calculateCoordinates(tick, next?) {
    if (this.scrubberX && this.scrubberY) {
      this.scrubberXPos = (this.canvasClientWidth - tick.x) - (this.scrubberX.nativeElement.clientWidth / 2);
      this.scrubberYPos = tick.y;
      if (next) {
        next();
      }
    }
  }

  onScrubStart(event) {
    cancelAnimationFrame(this.requestAnimation);
    this.setScrubberPosition(event);
  }

  onScrubMove(event) {
    cancelAnimationFrame(this.requestAnimation);
    this.setScrubberPosition(event);
  }

  onScrubEnd(event) {
    this.glideToOriginalPosition();
  }

  private destroyChart() {
    if (!!this.chartjs) {
      this.chartjs.destroy();
      this.chartjs = null;
    }
  }

  private updatePriceAndDate(label, value) {
    if (label && value) {
      const timestamp = moment.unix(label).format("DD-MM-YYYY HH:mm");
      this.price.emit(value);
      this.date.emit(timestamp);
    }
  }

  private chartJsOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      elements: {
        line: {
          tension: 0.2
        },
        point: {
          radius: 0,
          hitRadius: 0,
          hoverRadius: 0
        }
      },
      tooltips: {
        enabled: false,
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(122,122,122,0.8)',
        callbacks: {
          labelTextColor: (item, chart) => {
            console.log(item, chart);
          }
        },
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        yAxes: [{
          display: false,
          scaleLabel: {
            display: false,
          },
          ticks: {
            beginAtZero: false
          }
        }],
        xAxes: [{
          display: false,
          scaleLabel: {
            display: false,
          },
          ticks: {
            display: false,
            beginAtZero: true,
          },
          distribution: 'series',
          time: {
            unit: 'hour',
            displayFormats: {
              quarter: 'h:mm a'
            }
          },
          gridLines: {
            display: true,
            lineWidth: 1,
            drawBorder: false,
            drawOnChartArea: true,
            drawTicks: true,
            color: "rgba(255, 255, 255, 0.4)",
          }
        }]
      }
    };
  }
}
