import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { DatabaseService } from "../../services/database";
import { AuthService } from "../../services/auth";
import { LightService } from "../../services/light";

/*
  Generated class for the ConfirmLight page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-confirm-light',
    templateUrl: 'confirm-light.html'
})
export class ConfirmLightPage {

    constructor(private databaseService: DatabaseService, private lightService: LightService, private authService: AuthService, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad ConfirmLightPage');
    }

    lightGood() {
        console.log("bad light");
        const loading = this.loadingCtrl.create({
            content: "Connecting to Light..."
        })

        loading.present();
        this.authService.getToken()
            .then((token) => {
                this.databaseService.talkToLight(token, this.lightService.lightId, this.lightService.light.sms, 'active')
                    .subscribe(
                        (data) => {
                            if (data == null) {

                                loading.dismiss();
                                const alert = this.alertCtrl.create({
                                    title: 'Error',
                                    message: "Fatal Error, please start over.",
                                    buttons: ['ok']
                                });
                                alert.present();
                            } else if (data.a == true) {

                                loading.dismiss();
                                const alert = this.alertCtrl.create({
                                    title: 'Error',
                                    message: "There was an error.",
                                    buttons: ['ok']
                                });
                                alert.present();
                            } else if (data.a == false) {

                                this.databaseService.saveLightToUser(token)
                                    .subscribe(
                                        (data) => {
                                            loading.dismiss();
                                            const alert = this.alertCtrl.create({
                                                title: 'Light Connected Successfully!',
                                                message: "This light is now part of your network!",
                                                buttons: ['ok']
                                            });
                                            alert.present();
                                            this.navCtrl.popToRoot();
                                        },
                                        (error) => {
                                            loading.dismiss();
                                            const alert = this.alertCtrl.create({
                                                title: 'Light Could not be connected!',
                                                message: "Please check your network connection and try again.",
                                                buttons: ['ok']
                                            });
                                            alert.present();
                                        });

                            }

                        },
                        (error) => {
                            console.log(error);
                            loading.dismiss();

                            const alert = this.alertCtrl.create({
                                title: 'Error',
                                message: "There was an error connecting to the database.  Please check your network connection and try again.",
                                buttons: ['ok']
                            });
                            alert.present();
                        }
                    );

            })

    }

    lightBad() {
        console.log("bad light");
        const loading = this.loadingCtrl.create({
            content: "Connecting to Light..."
        })

        loading.present();
        this.authService.getToken()
            .then((token) => {
                this.databaseService.talkToLight(token, this.lightService.lightId, this.lightService.light.sms, 'blinkbw')
                    .subscribe(
                        (data) => {
                            loading.dismiss();
                            if (data == null) {

                                const alert = this.alertCtrl.create({
                                    title: 'Error',
                                    message: "Fatal Error, please start over.",
                                    buttons: ['ok']
                                });
                                alert.present();
                            } else if (data.a == true) {

                                const alert = this.alertCtrl.create({
                                    title: 'Error',
                                    message: "There was an error.",
                                    buttons: ['ok']
                                });
                                alert.present();
                            } else if (data.a == false) {

                                const alert = this.alertCtrl.create({
                                    title: 'Connection Reset',
                                    message: "A connection command has been re-sent. Please check the status of the light again.",
                                    buttons: ['ok']
                                });
                                alert.present();
                            }

                        },
                        (error) => {
                            console.log(error);
                            loading.dismiss();

                            const alert = this.alertCtrl.create({
                                title: 'Error',
                                message: "There was an error connecting to the database.  Please check your network connection and try again.",
                                buttons: ['ok']
                            });
                            alert.present();
                        }
                    );

            })

    }

}
