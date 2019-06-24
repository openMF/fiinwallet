import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the NamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-name',
  templateUrl: 'name.html',
})
export class NamePage {

  checkedbtn : boolean = true; 
  submitAttempt: boolean = false;
  slideOneForm: FormGroup;
  name: string = "";
  lastname: string = "";
  secondlastname: string = "";
  // Our translated text strings
  private nameAlertTitle: string;
  private nameAlertText1: string;
  private nameAlertText2: string;
  private nameAlertTextConfirm: string;
  private nameAlertTextDeny: string;

  user: any;  

  account: {     
    countryofbirthIsMexico: boolean,
    state: string,
    country: string,
    clientId: string,
    firstname : string,
    middlename : string,
    lastname : string
  }={     
    countryofbirthIsMexico: false,
    state: "",
    country: "",
    clientId: "",
    firstname : "",
    middlename : "",
    lastname : ""
  };


  onTextInput(ev: any) {
    //let val = ev.target.value;    
    //console.log("VALOR ",val);
    if(!this.slideOneForm.valid){
      console.log("NO VALIDA");
      this.checkedbtn = true;
    }
    else {
      console.log("VALIDA");
      this.checkedbtn = false;
        console.log("success!")
        //this.navCtrl.push('SexPage');
    }    
  }

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public formBuilder: FormBuilder, 
    private alertCtrl: AlertController,
    public translateService: TranslateService) { 

    this.user = navParams.data;
    console.log("EL USUARIO EN NAME  ES ", this.user);       
    this.account.clientId = this.user.clientId;
    this.account.state = this.user.state;
    this.account.country = this.user.country;    

    this.slideOneForm = formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(60), Validators.pattern('[a-zA-Z ]*'), Validators.required])] ,
      lastname: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      secondlastname: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
    });    
    this.translateService.get('NAME_ALERT_TITLE').subscribe((value) => {
      this.nameAlertTitle = value;
    });
    this.translateService.get('NAME_ALERT_TEXT_1').subscribe((value) => {
      this.nameAlertText1 = value;
    });
    this.translateService.get('NAME_ALERT_TEXT_2').subscribe((value) => {
      this.nameAlertText2 = value;
    });
    this.translateService.get('NAME_ALERT_TEXT_NO').subscribe((value) => {
      this.nameAlertTextDeny = value;
    });
    this.translateService.get('NAME_ALERT_TEXT_YES').subscribe((value) => {
      this.nameAlertTextConfirm = value;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NamePage');
  } 
  
  doActivateCustomerSex() {
    let alert = this.alertCtrl.create({
      title: this.nameAlertTitle,
      message: this.nameAlertText1 +this.name+' '+this.lastname+' '+this.secondlastname+ this.nameAlertText2 ,
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
            this.account.firstname = this.name;
            this.account.middlename = this.lastname;
            this.account.lastname = this.secondlastname;
            this.navCtrl.push('SexPage',this.account);
          }
        }
      ]
    });
    alert.present();
  }

}
