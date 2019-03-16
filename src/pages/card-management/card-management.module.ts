import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardManagementPage } from './card-management';

@NgModule({
  declarations: [
    CardManagementPage,
  ],
  imports: [
    IonicPageModule.forChild(CardManagementPage),
  ],
})
export class CardManagementPageModule {}
