import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AddBenefeciaryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'add-benefeciary'
})
@Component({
  selector: 'page-add-benefeciary',
  templateUrl: 'add-benefeciary.html',
})
export class AddBenefeciaryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddBenefeciaryPage');
  }

}
