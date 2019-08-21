import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {User} from "../../providers";
import {SelfServiceProvider} from "../../providers/self-service/self-service";



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

  beneficiaries: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public user:User,
              public loadingCtrl: LoadingController, public self: SelfServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BeneficiariesPage');
    this.fetchBeneficiaries();
  }


  addBeneficiary(){
    console.log('Adding new beneficiary');
    this.navCtrl.push('new-beneficiary')
  }


  fetchBeneficiaries() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present();
    this.self.getTptBeneficiary({"key": this.user.userinfo().authentication.base64EncodedAuthenticationKey})
      .subscribe(() => {
        this.beneficiaries = this.self.listBeneficiaries();
        loader.dismiss();
        console.log('Inside the promise')
      }, err =>{
        loader.dismiss();
        alert('Error occured');
      });
    console.log("this page benefeciaries", this.beneficiaries);

  }


}

