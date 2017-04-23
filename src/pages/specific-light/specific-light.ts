import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { LightService } from "../../services/light";
import { DatabaseService } from "../../services/database";
import { AuthService } from "../../services/auth";

@Component({
    selector: 'page-specific-light',
    templateUrl: 'specific-light.html'
})
export class SpecificLightPage {

    public lightId: any = "testtest";
    public myDynamicColor: any = "rgba(123, 103, 103, 0.48)";

    public currentWeather: any = {};

    public red: number = 255;
    private blue: number = 255;
    private green: number = 255;
    private opacity: any = 0.90;
    public rawOp: any = this.opacity * 100;
    private easyView: string = "black";

    constructor(public navCtrl: NavController, private databaseService: DatabaseService, private authService: AuthService, private loadingCtrl: LoadingController, public navParams: NavParams, public viewCtrl: ViewController, private alertCtrl: AlertController, private lightService: LightService) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad SpecificLightPage');
        console.log(this.lightService.specificLight.sms);
        this.lightId = this.lightService.specificLightId;
        this.setColor(255, 'red');
        this.getWeather();
    }

    getWeather() {

        const loading = this.loadingCtrl.create({
            content: "Updating Light Data..."
        });

        loading.present();
        this.authService.getToken()
            .then((token) => {
                this.databaseService.getLight(token, this.lightId)
                    .subscribe(
                        (data) => {
                            loading.dismiss();
                            if (data == null) {

                                const alert = this.alertCtrl.create({
                                    title: 'Error',
                                    message: "No light was found.",
                                    buttons: ['ok']
                                });
                                alert.present();
                            } else if (data.used == true) {

                              this.currentWeather = data.currentWeather;
                              console.log("WEATHER SET");

                                
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

    dismiss() {
        this.viewCtrl.dismiss();
    }

    setColor(val, color) {
        if (color == 'red') {
            this.red = val;
        } else if (color == 'blue') {
            this.blue = val;
        } else if (color == 'green') {
            this.green = val;
        } else if (color == 'opacity') {
            this.rawOp = val;
            if (this.rawOp < 50) {
                this.easyView = "white";
            } else {
                this.easyView = "black";
            }
            this.opacity = Number(val / 100).toFixed(2);
            console.log(this.opacity);
        }

        this.myDynamicColor = "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + this.opacity + ")";
    }

    colorToPercent(color) {
        return Number(color / 255 * 100).toFixed(0);
    }

    info(mode) {
        if (mode == "construction") {
            var title = "Construction Mode";
            var message = "Construction Mode can be used to warn drivers and pedestrians of upcoming constuction. A light orange color is used.";
        } else if (mode == "accident") {
            title = "Accident Mode";
            message = "Accident Mode can be used to warn drivers and pedestrians of an accident ahead and to slow down.  A light red hue is used.";
        } else if (mode == "evacuation") {
            title = "Evacuation Mode";
            message = "Evacuation Mode can be used to show people that they need to leave.";
        }

        const alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: ['ok']
        });
        alert.present();
    }

    enable(mode) {

        const alert = this.alertCtrl.create({
            title: "Confirm " + mode + " Mode",
            message: "Are you sure you want to enable " + mode + " Mode?",
            buttons: [{
                text: 'Cancel',
                handler: (data) => {
                    console.log('Disagree clicked');
                }
            }, {
                text: 'Activate',
                handler: (data) => {

                    if (data[0] == 'chain') {
                        console.log("enable entire chain..");
                        this.sendMode(mode);

                    } else {
                        console.log("enable just this light");
                        this.sendMode(mode);
                    }
                    console.log('Agree clicked');
                    console.log(mode);

                }
            }]
        });

        alert.addInput({
            type: 'checkbox',
            label: 'Set all associated lights',
            value: 'chain'
        });
        alert.present();
    }

    updateWeather() {

        this.getWeather();

    }

    sendMode(mode) {

        const loading = this.loadingCtrl.create({
            content: "Connecting to Light..."
        })

        if (mode == "Construction") {
            var message = "_4_";
        } else if (mode == "Accident") {
            message = "_3_";
        } else if (mode == "Evacuation") {
            message = "_5_";
        } else if (mode == "Active") {
            message = "_2_";
        }else if (mode == "Manual Color") {
            message = "_6_" + this.red + "_"+ this.green + "_" + this.blue + "_" + this.rawOp + "_";
            console.log(message);
        } else {
            console.log("MODE EQUIALS");
            console.log(mode);
            message = "_2_";
        }

        if (this.lightService.specificLight.sms == '') {
            var mysms = this.lightService.specificLight.masterSms
        } else {
            mysms = this.lightService.specificLight.sms;
        }

        loading.present();
        this.authService.getToken()
            .then((token) => {
                this.databaseService.talkToLight(token, this.lightId, mysms, message)
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

                                loading.dismiss();
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
