import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SavingChargesPage } from './saving-charges';

@NgModule({
  declarations: [
    SavingChargesPage,
  ],
  imports: [
    IonicPageModule.forChild(SavingChargesPage),
  ],
})
export class SavingChargesPageModule {}
