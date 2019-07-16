import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SexPage } from './sex';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    SexPage,
  ],
  imports: [
    IonicPageModule.forChild(SexPage),
    TranslateModule.forChild()
  ],
})
export class SexPageModule {}
