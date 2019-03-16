import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionsHistoryPage } from './transactions-history';
import { TranslateModule } from '@ngx-translate/core';

import { TimelineComponent } from '../../components/timeline/timeline';
import { TimelineTimeComponent } from '../../components/timeline/timeline';
import { TimelineItemComponent } from '../../components/timeline/timeline';

@NgModule({
  declarations: [
    TransactionsHistoryPage,    
    TimelineComponent,
    TimelineItemComponent,
    TimelineTimeComponent
  ],
  imports: [
    IonicPageModule.forChild(TransactionsHistoryPage),
    TranslateModule.forChild(),
  ],
})
export class TransactionsHistoryPageModule {}
