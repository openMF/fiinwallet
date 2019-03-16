import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DateOfBirthPage } from './date-of-birth';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DateOfBirthPage,
  ],
  imports: [
    IonicPageModule.forChild(DateOfBirthPage),
    TranslateModule.forChild()
  ],
})
export class DateOfBirthPageModule {}
