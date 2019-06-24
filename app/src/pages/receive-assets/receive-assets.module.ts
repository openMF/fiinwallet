import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiveAssetsPage } from './receive-assets';

@NgModule({
  declarations: [
    ReceiveAssetsPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiveAssetsPage),
  ],
})
export class ReceiveAssetsPageModule {}
