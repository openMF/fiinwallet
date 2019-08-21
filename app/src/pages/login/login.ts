import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { username: string, password: string } = {
    username: 'victor.romero@fintecheando.mx',
    password: 'gusana02'
  };

  userData: any;
  savingaccounts: any;

  //Show/Hide password
  usernameType: string = 'password';
  usernameIcon: string = 'eye-off';
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  hideShowUserName() {
      this.usernameType = this.usernameType === 'text' ? 'password' : 'text';
      this.usernameIcon = this.usernameIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  // Attempt to login in through our User service
  doLogin() {
    this.user.login(this.account).subscribe((resp) => {
      this.userData = resp;
      //this.user.applySavingsAccount({"clientId":1,"dateFormat":"dd MMMM yyyy","locale":"en","productId":2,"submittedOnDate":"19 July 2019"})
        //.subscribe(res=> this.savingaccounts = resp )
      console.log('here is',this.userData);
      this.navCtrl.push(MainPage);
    }, (err) => {
      //TODO: remove after  testing purposes
      //this.navCtrl.push('scan-qr');
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
}
