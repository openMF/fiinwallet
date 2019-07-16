import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CountryOfBirthPage } from './country-of-birth';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CountryOfBirthPage,
  ],
  imports: [
    IonicPageModule.forChild(CountryOfBirthPage),
    TranslateModule.forChild()
  ],
})
export class CountryOfBirthPageModule {}
