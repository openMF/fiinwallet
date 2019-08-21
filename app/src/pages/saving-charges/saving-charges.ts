import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SavingChargesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'saving-charges'
})
@Component({
  selector: 'page-saving-charges',
  templateUrl: 'saving-charges.html',
})
export class SavingChargesPage {
  charges: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SavingChargesPage');
  }

}
