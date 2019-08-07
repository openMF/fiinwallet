import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountsPage } from './accounts';
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    AccountsPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountsPage),
    DirectivesModule,
  ],
})
export class AccountsPageModule {}
