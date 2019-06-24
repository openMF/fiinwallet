import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivateCustomerPage } from './activate-customer';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ActivateCustomerPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivateCustomerPage),
    TranslateModule.forChild()
  ],
})
export class ActivateCustomerPageModule {}
