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
  account: { username: string, password: string } = {
    username: 'victor.romero@fintecheando.mx',
    password: 'gusana02'
  };

  userData: any;
  savingaccounts: any;

  // Show/Hide password fields
  usernameType: string = 'password';
  usernameIcon: string = 'eye-off';
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  // Login state flag
  isLoggingIn: boolean = false;

  hideShowUserName() {
    this.usernameType = this.usernameType === 'text' ? 'password' : 'text';
    this.usernameIcon = this.usernameIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  private loginErrorString: string;

  constructor(
    public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService
  ) {
    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    });
  }

  doLogin() {
    this.isLoggingIn = true;

    this.user.login(this.account).subscribe(
      (resp) => {
        this.userData = resp;
        console.log('here is', this.userData);
        this.isLoggingIn = false;
        this.navCtrl.push(MainPage);
      },
      (err) => {
        this.isLoggingIn = false;
        let toast = this.toastCtrl.create({
          message: this.loginErrorString,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    );
  }
}
