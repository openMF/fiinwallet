import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
    this.displayName = this.userdata.user.firstname +" "+ this.userdata.user.lastname;
  }

}
