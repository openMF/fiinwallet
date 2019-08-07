import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BeneficiariesPage } from './beneficiaries';

@NgModule({
  declarations: [
    BeneficiariesPage,
  ],
  imports: [
    IonicPageModule.forChild(BeneficiariesPage),
  ],
})
export class BeneficiariesPageModule {}
