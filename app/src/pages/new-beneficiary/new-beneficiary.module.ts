import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewBeneficiaryPage } from './new-beneficiary';

@NgModule({
  declarations: [
    NewBeneficiaryPage,
  ],
  imports: [
    IonicPageModule.forChild(NewBeneficiaryPage),
  ],
})
export class NewBeneficiaryPageModule {}
