import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CountryPickerService, ICountry } from 'ngx-country-picker';
import { IonicPage, NavController, ToastController,NavParams } from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-cell-phone-number',
  templateUrl: 'cell-phone-number.html'
})
export class CellPhoneNumberPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  public countries: ICountry[] = [];
  // Our translated text strings
  private signupErrorString: string;
  checkedbtn : boolean = true;
  //slideOneForm: FormGroup;
  userData: any;  
  phonenumber: any;

  accountData: {     
    countryofbirthIsMexico: boolean,
    state: string,
    country: string,
    clientId: string,
    firstname: string,
    middlename: string,
    lastname: string,
    gender: string,
    dateofbirth: string,
    occupation: string,
    cellphone: string
  }={     
    countryofbirthIsMexico: false,
    state: "",
    country: "",
    clientId: "",
    firstname: "",
    middlename: "",
    lastname: "",
    gender: "",
    dateofbirth: "",
    occupation: "",
    cellphone: ""
  };

  constructor(public navCtrl: NavController,
    protected countryPicker: CountryPickerService,
    public user: User, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {

      this.userData = navParams.data;
      console.log("EL USUARIO EN DATE OF BIRTH  ES ", this.userData);  
      this.accountData.clientId = this.userData.clientId;
      this.accountData.state = this.userData.state;
      this.accountData.country = this.userData.country;   
      this.accountData.firstname = this.userData.firstname;
      this.accountData.middlename = this.userData.middlename;
      this.accountData.lastname = this.userData.lastname;
      this.accountData.dateofbirth = this.userData.dateofbirth;
      this.accountData.gender = this.userData.gender;
      this.accountData.occupation = this.userData.occupation;

      this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
        this.signupErrorString = value;
      });
      /*  this.slideOneForm = formBuilder.group({
        phonenumber: ['', Validators.compose([Validators.maxLength(60), Validators.pattern('[a-zA-Z ]*'), Validators.required])] 
      });  
      */
  }

  public ngOnInit(): void {    
    this.countryPicker.getCountries().subscribe((countries: ICountry[]) => //get all country
    this.countries = countries);  // store it in countries
  }

  onTextInput(ev: any) {
    //let val = ev.target.value;    
    //console.log("VALOR ",val);
    this.checkedbtn = false;
    /*if(!this.slideOneForm.valid){
      console.log("NO VALIDA");
      this.checkedbtn = true;
    }
    else {
      console.log("VALIDA");
      this.checkedbtn = false;
        console.log("success!")
        //this.navCtrl.push('SexPage');
    } */   
  }

  doActivateAccountLevel1() {
    // Attempt to login in through our User service
    //this.phonenumber = this.account.country + this.phonenumber;
    this.accountData.cellphone = this.phonenumber;
    this.user.activateLevel1(this.accountData).subscribe((resp) => {
      console.log("EXITO");
      console.log("RESPUESTA ",resp);
      this.navCtrl.push(MainPage);
    }, (err) => {
      console.log("ERROR");
      //this.navCtrl.push(MainPage);
      // Unable to sign up
      let toast = this.toastCtrl.create({
        message: this.signupErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
  
  account: {
    country: string
  } = {    
    country: "MX"
  };

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
