import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



/**
 * Generated class for the BeneficiariesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'beneficiaries'
})
@Component({
  selector: 'page-beneficiaries',
  templateUrl: 'beneficiaries.html',
})
export class BeneficiariesPage {

  beneficiaries: Array<any> =[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BeneficiariesPage');
    this.fetchBeneficiaries();
  }


  addBeneficiary(){
    console.log('Adding new beneficiary');
    this.navCtrl.push('new-beneficiary')
  }


  fetchBeneficiaries() {}


}

