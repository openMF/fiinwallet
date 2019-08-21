import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CountryPickerService, ICountry } from 'ngx-country-picker';
import { IonicPage, NavController, ToastController, AlertController } from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';
//import {ActivateCustomerPage} from '../activate-customer/activate-customer';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  public countries: ICountry[] = [];
  // Our translated text strings
  private signupErrorString: string;
  private nameAlertTitle: string;
  private nameAlertText1: string;
  private nameAlertTextConfirm: string;
  private nameAlertTextDeny: string;


  constructor(public navCtrl: NavController,
    protected countryPicker: CountryPickerService,
    public user: User,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    });
    this.translateService.get('SIGNUP_ALERT_TITLE').subscribe((value) => {
      this.nameAlertTitle = value;
    });
    this.translateService.get('SIGNUP_ALERT_TEXT_1').subscribe((value) => {
      this.nameAlertText1 = value;
    });    
    this.translateService.get('SIGNUP_ALERT_TEXT_NO').subscribe((value) => {
      this.nameAlertTextDeny = value;
    });
    this.translateService.get('SIGNUP_ALERT_TEXT_YES').subscribe((value) => {
      this.nameAlertTextConfirm = value;
    });
  }

  public ngOnInit(): void {    
    this.countryPicker.getCountries().subscribe((countries: ICountry[]) => //get all country
    this.countries = countries);  // store it in countries
  }

  goToTermsAndConditions() {
    this.navCtrl.push('PoliticasPrivacidadPage');
  }

  goToCommercialAgreement() {
    this.navCtrl.push('TerminosCondicionesPage');
  }

  doSignup() {
    let alert = this.alertCtrl.create({
      title: this.nameAlertTitle,
      message: this.nameAlertText1 ,
      buttons: [
        {
          text: this.nameAlertTextDeny,
          role: 'cancel',
          handler: () => {
            console.log('Edit clicked');
          }
        },
        {
          text: this.nameAlertTextConfirm,
          handler: () => {
            console.log('CONFIRMAR clicked');
            console.log('trying to open signup page')
            // Attempt to create the user in through our User service
            this.user.create(this.account).subscribe((resp) => {
              this.navCtrl.push('customer-kyc');
              let toast = this.toastCtrl.create({
                message: "Please complete the KYC in order to proceed",
                duration: 3000,
                position: 'top'
              });
              toast.present();
            }, (err) => {
              //this.navCtrl.push('ActivateCustomerPage');
              // Unable to sign up
              let toast = this.toastCtrl.create({
                message: this.signupErrorString,
                duration: 3000,
                position: 'top'
              });
              toast.present();
            });
          }
        }
      ]
    });
    alert.present();
  }
  
  account: {     
    email: string,     
    password: string,
    country: string,
    commercialagreement: boolean,
    privacypolity: boolean,
    legalage: boolean
  } = {
    email: "fintech"+new Date().getTime().toString().trim()+"@gmail.com",     
    password: "Fintech01",
    country: "MX",
    commercialagreement: false,
    privacypolity: false,
    legalage: false
  };

  checkedbtn : boolean = true;

  

  updateSingUpButton(event) {
    console.log('updateSingUpButton new state:', event);    
    if(event.checked){      
        if (this.account.commercialagreement == true && this.account.legalage == true && this.account.privacypolity == true)
        {
          this.checkedbtn = false;
          console.log("checkedbtn value",this.checkedbtn);
        } 
    }
    else{
        this.checkedbtn = true;
    } 
  }

  prepareCountryImageWithLabelSelector() {
		setTimeout(() => {
			let buttonElements = document.querySelectorAll('div.alert-radio-group button');
			if (!buttonElements.length) {
				this.prepareCountryImageWithLabelSelector();
			} else {
				for (let index = 0; index < buttonElements.length; index++) {
          let buttonElement = buttonElements[index];
					let optionLabelElement = buttonElement.querySelector('.alert-radio-label');
          //let image = optionLabelElement.innerHTML.trim().substr(0,2);
          //console.log("IMAGEN ",image);
          var totalWords = optionLabelElement.innerHTML.trim();
          var firstWord = totalWords.replace(/ .*/,'');
          //console.log("CODIGO ISO ",firstWord);
					buttonElement.classList.add('imagewithlabelselect', 'image_' + firstWord);
				}
			}
		}, 100);
  }
  
  setCountryImageWithLabel(image) {
		console.log('Selected image with label is', this.account.country);
  }
  
}
