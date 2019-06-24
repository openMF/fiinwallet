import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {curveNatural} from "d3-shape";
import * as moment from "moment";

@Component({
  selector: 'ngx-chart',
  templateUrl: 'ngx-chart.html'
})
export class NgxChartComponent implements OnChanges {
  @Input() data: Object;
  view: any[] = undefined;
  showXAxis = false;
  showYAxis = false;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  showYAxisLabel = false;
  curve = curveNatural;
  colorScheme = {
    domain: ['#2a95da']
  };
  autoScale = true;

  @Output() price = new EventEmitter();
  @Output() date = new EventEmitter();

  constructor(private cdRef: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.data.currentValue) {
    }
  }

  onScrub(event, serie) {
    const timestamp = moment.unix(event.name).format("DD-MM-YYYY HH:mm");
    this.price.emit(event.value);
    this.date.emit(timestamp);
    this.cdRef.detectChanges();
  }

  onScrubEnd() {
    this.price.emit(null);
  }

}
