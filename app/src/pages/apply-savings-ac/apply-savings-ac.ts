import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User} from "../../providers";


@IonicPage({
  name: 'apply-savings-ac'
})
@Component({
  selector: 'page-apply-savings-ac',
  templateUrl: 'apply-savings-ac.html',
})
export class ApplySavingsAcPage {
  today = Date.now();
  clientDetails: any;
  clientName: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,public user:User) {
    this.clientDetails = user.userinfo();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApplySavingsAcPage');
    this.clientName = this.clientDetails.user.firstname + ' ' + this.clientDetails.user.lastname;
  }

  submitApplication(){
    console.log("Submitting account application");
  }

}
