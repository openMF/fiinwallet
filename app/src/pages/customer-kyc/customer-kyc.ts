import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';


@IonicPage({
  name: 'customer-kyc'
})
@Component({
  selector: 'page-customer-kyc',
  templateUrl: 'customer-kyc.html',
})
export class CustomerKycPage {

  kycDetails: any = {};
  userPic: any;
  idPic: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera,
              private transfer: FileTransfer, private file: File, private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerKycPage');
  }

  submitKyc() {
    console.log("Submit button clicked");
    console.log(this.kycDetails);
    this.navCtrl.push('activate-customer')
  }

  takePhoto(type: string) {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {

      if(type == 'id'){
        this.idPic = 'data:image/jpeg;base64,' + imageData;
      }
      if (type == 'selfie') {
        this.userPic = 'data:image/jpeg;base64,' + imageData;
      }

    }, (err) => {
      console.log('Error', err)
    });
  }

  getImage(type) {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }

    this.camera.getPicture(options).then((imageData) => {
      if(type == 'id'){
        this.idPic = 'data:image/jpeg;base64,' + imageData;
      }
      if (type == 'selfie') {
        this.userPic = 'data:image/jpeg;base64,' + imageData;
      }

    }, (err) => {
      console.log('Error ', err)
    });
  }



  uploadImage() {
    /*let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();

    const fileTransfer: FileTransferObject = this.transfer.create();

    var id = 'userId';

    let options: FileUploadOptions = {
      fileKey: 'photo',
      fileName: "myImage_" + id + ".jpg",
      chunkedMode: false,
      httpMethod: 'post',
      mimeType: "image/jpeg",
      headers: {}
    }
    fileTransfer.upload(this.userPic, '', options)
      .then((data) => {
        alert("Success");
        loader.dismiss();
      }, (err) => {
        console.log(err);
        alert("Error");
        loader.dismiss();
      });
  }*/

  }
}
