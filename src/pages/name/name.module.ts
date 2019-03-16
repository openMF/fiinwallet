import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NamePage } from './name';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    NamePage,
  ],
  imports: [
    IonicPageModule.forChild(NamePage),
    TranslateModule.forChild()
  ],
})
export class NamePageModule {}
