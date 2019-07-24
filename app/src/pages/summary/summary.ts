import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AccountsPage} from "../accounts/accounts";

/**
 * Generated class for the SummaryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
})
export class SummaryPage {

  userdata: any={};
  client: any={};
  displayName: String="";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SummaryPage');
    this.userdata = this.navParams.get('user');
    //console.log(this.userdata);
    //this.client = this.navParams.get('savingaccounts');
    //console.log(this.client);
    this.displayName = this.userdata.user.firstname +" "+ this.userdata.user.lastname;
  }
  viewAccounts(){
   //set this.navCtrl.push(AccountsPage,{user:this.userdata});
    console.log("opening accounts page");
  }
}
