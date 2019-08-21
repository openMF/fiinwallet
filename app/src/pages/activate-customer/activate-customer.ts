import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { User } from '../../providers';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the ActivateCustomerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'activate-customer'
})
@Component({
  selector: 'page-activate-customer',
  templateUrl: 'activate-customer.html',
})
export class ActivateCustomerPage {

  private signupErrorString: string;

  constructor(public navCtrl: NavController, 
    public toastCtrl: ToastController,
    public user: User,
    public navParams: NavParams,
    public translateService: TranslateService) {
      this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
        this.signupErrorString = value;
      });
  }

  account: {
    requestId: string,
    authenticationToken: string
  }={
    requestId : "",
    authenticationToken: ""
  };

  checkedbtn : boolean = true;

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivateCustomerPage');
  }

  onTextInputRequestId(ev: any) {
    let val = ev.target.value;    
    //console.log("VALOR ",val);
    this.account.requestId = val;
    if(this.account.authenticationToken.length > 1){
      this.checkedbtn = false;    
    } else{
      this.checkedbtn = true;    
    }  
  }

  onTextInputAuthenticationToken(ev: any) {
    let val = ev.target.value;    
    //console.log("VALOR ",val);
    this.account.authenticationToken = val;
    if(this.account.requestId.length > 1){
      this.checkedbtn = false;    
    } else{
      this.checkedbtn = true;    
    }    
  }

  doActivateCustomer() {
    // Attempt to login in through our User service
    //console.log("SE ENVIAN ",this.account);
    this.user.activate(this.account).subscribe((resp) => {
      this.navCtrl.push('LoginPage');
    }, (err) => {
      //this.navCtrl.push('LoginPage');
      // Unable to activate
      let toast = this.toastCtrl.create({
        message: this.signupErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

}
