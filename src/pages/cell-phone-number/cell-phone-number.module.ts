import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CellPhoneNumberPage } from './cell-phone-number';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CellPhoneNumberPage,
  ],
  imports: [
    IonicPageModule.forChild(CellPhoneNumberPage),
    TranslateModule.forChild()
  ],
})
export class CellPhoneNumberPageModule {}
