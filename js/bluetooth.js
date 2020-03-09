const service = 0xFFE0;

class Bluetooth {
    constructor(service) {
        this.service = service;
        this.device = null;
        this.characteristic = null;
    }

    connect() {
        try {

            /* DISPLAY LIST OF AVALIABLE DEVICES */
            navigator.bluetooth.requestDevice({
                optionalServices: [this.service],
                acceptAllDevices: true
            })
            .then(device => {
                this.device = device;
                /* CONNECT TO BROWSER */
                return this.device.gatt.connect();
            })
            .then(gattserver => {
                /* GET SERVICE FROM GATT SERVER */
                return gattserver.getPrimaryService(this.service);
            })
            .then(service => {
                /* GET CHARACTERISTICS FROM SERVICE */
                return service.getCharacteristics();
            })
            .then(characteristics => {
                this.characteristic = characteristics[0];
                /* CONNECT TO CHARACTERISTIC */
                return this.characteristic.startNotifications();
            })
        } catch (error) {
            alert('This browser or device does not support bluetooth connection');
        }
    }

    disconnect() {
        this.device.gatt.disconnect();
    }
}

const bluetooth = new Bluetooth(service);
    