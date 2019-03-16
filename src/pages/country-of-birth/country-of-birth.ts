import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { countryPickerServiceFactory } from 'ngx-country-picker';

/**
 * Generated class for the CountryOfBirthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-country-of-birth',
  templateUrl: 'country-of-birth.html',
})
export class CountryOfBirthPage {

  checkedbtn : boolean = true;  
  visability : boolean = false;
  state: string ="";
  country: string ="";
  user: any;  

  account: {     
    countryofbirthIsMexico: boolean,
    state: string,
    country: string,
    clientId: string
  }={     
    countryofbirthIsMexico: false,
    state: "",
    country: "",
    clientId: ""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {    
    this.user = navParams.get('client');
    console.log("EL USUARIO EN COUNTRY OF BIRTH  ES ", this.user); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CountryOfBirthPage');
  }

  doActivateCustomerName(){
    
    this.account.clientId = this.user.id;
    let paisCode: string = "";
    if(this.visability === true){
      paisCode = "Mexico"
    }
    else {
      paisCode = "Otro"
    }
    this.account.country = paisCode;
    this.account.state = this.state;
    console.log("SE ENVIA A NAME ",this.account);
    this.navCtrl.push('NamePage',this.account);
  }

  onChange(value: any) {
    this.state = value;
    if (value ) {      
      console.log("LOG DE VALORES");
      console.log("VALOR ", value);
      this.checkedbtn = false;
    }
  }

  enableState(event: any){    
    this.visability = true;
    this.checkedbtn = true;
    console.log("VISIBLE ",this.visability);
    console.log("BOTON VISIBLE ", this.checkedbtn);
  }

  disableState(){
    this.visability = false;
    this.state = "";
    console.log("VISIBLE ",this.visability);
    this.checkedbtn = false;
  }
  
}
