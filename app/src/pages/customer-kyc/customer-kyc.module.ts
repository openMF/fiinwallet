import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerKycPage } from './customer-kyc';

@NgModule({
  declarations: [
    CustomerKycPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerKycPage),
  ],
})
export class CustomerKycPageModule {}
