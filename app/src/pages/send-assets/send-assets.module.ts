import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendAssetsPage } from './send-assets';

@NgModule({
  declarations: [
    SendAssetsPage,
  ],
  imports: [
    IonicPageModule.forChild(SendAssetsPage),
  ],
})
export class SendAssetsPageModule {}
