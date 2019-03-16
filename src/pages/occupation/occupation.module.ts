import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OccupationPage } from './occupation';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    OccupationPage,
  ],
  imports: [
    IonicPageModule.forChild(OccupationPage),
    TranslateModule.forChild()
  ],
})
export class OccupationPageModule {}
