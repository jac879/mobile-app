
export class LightService {

    constructor() {}

    public lightId = null;
    private userId = '';

    public light = {
        location: {
            lat: 0,
            lng: 0
        },
        active: false,
        emergency: false,
        sms: '',
        slaves: {},
        owner: this.userId

    }

    newLight(id, sms, uid) {
        this.lightId = id;
        this.light.sms = sms;
        this.light.owner = uid;
    }

    getFinalLight() {
        var json = {};

        json = this.light;

        return json;
    }

    clearLight() {
        this.lightId = null;
        this.light = {
            location: {
                lat: 0,
                lng: 0
            },
            active: false,
            emergency: false,
            sms: '',
            slaves: {},
            owner: this.userId

        }
    }

    setLocation(marker) {
        this.light.location = marker;
        console.log(this.light);
    }

}
