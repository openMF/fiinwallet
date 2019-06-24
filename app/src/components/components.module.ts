import {NgModule} from '@angular/core';

import {CustomChartComponent} from './custom-chart/custom-chart';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {CustomChartTooltipAreaComponent} from "./custom-chart-tooltip-area/custom-chart-tooltip-area";
import {CustomChartCircleSeriesComponent} from './custom-chart-circle-series/custom-chart-circle-series';
import {CustomChartLineSeriesComponent} from './custom-chart-line-series/custom-chart-line-series';
import {CustomChartLineComponent} from './custom-chart-line/custom-chart-line';
import {ChartjsComponent} from './chartjs/chartjs';
import {NgxChartComponent} from './ngx-chart/ngx-chart';
import {IonicModule} from "ionic-angular";

@NgModule({
  declarations: [

    CustomChartComponent,
    CustomChartTooltipAreaComponent,
    CustomChartCircleSeriesComponent,
    CustomChartLineSeriesComponent,
    CustomChartLineComponent,
    ChartjsComponent,
    NgxChartComponent,
  ],
  imports: [
    IonicModule,
    NgxChartsModule,
  ],
  exports: [

    CustomChartComponent,
    CustomChartTooltipAreaComponent,
    CustomChartCircleSeriesComponent,
    CustomChartLineSeriesComponent,
    CustomChartLineComponent,
    ChartjsComponent,
    NgxChartComponent
  ]
})
export class ComponentsModule {
}
