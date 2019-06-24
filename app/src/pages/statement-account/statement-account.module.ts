import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import { StatementAccountPage } from './statement-account';
import {PipesModule} from "../../pipes/pipes.module";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    StatementAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(StatementAccountPage),
    PipesModule,
    ComponentsModule,
  ],
})
export class StatementAccountPageModule {}
