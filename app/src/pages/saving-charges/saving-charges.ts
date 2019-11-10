import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import {User} from "../../providers";
import {SelfServiceProvider} from "../../providers/self-service/self-service";

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public self: SelfServiceProvider, public loadingCtrl: LoadingController, public user: User) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SavingChargesPage');
    this.setSACharges();
  }

  setSACharges(){
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present();
    this.self.getSACharges({"key": this.user.userinfo().authentication.base64EncodedAuthenticationKey})
      .subscribe(() => {
        this.charges = this.self.listSACharges();
        loader.dismiss();
      }, err =>{
        loader.dismiss();
        console.log(err);
        alert('Error occured');
      });
  
  }
}
