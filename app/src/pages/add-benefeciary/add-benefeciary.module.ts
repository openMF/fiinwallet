import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddBenefeciaryPage } from './add-benefeciary';

@NgModule({
  declarations: [
    AddBenefeciaryPage,
  ],
  imports: [
    IonicPageModule.forChild(AddBenefeciaryPage),
  ],
})
export class AddBenefeciaryPageModule {}
