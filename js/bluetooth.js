class Bluetooth {
    constructor(config, receiveData) {
        this.service = config.service;
        this.uuid = config.uuid;
        this.device = null;
        this.characteristic = null;
        this.receiveData = receiveData;
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
                /* CONNECT TO CHARACTERISTIC USING UUID IN THE CONFIG */
                for(let item in characteristics) {
                    if(characteristics[item].uuid === this.uuid) {
                        this.characteristic = characteristics[item];
                    }
                }
                
                return this.characteristic.startNotifications();
            })
            .then(() => {
                /* START HANDLING DATA COMING TO THE BROWSER FROM BLUETOOTH */
                this.receive();
            })
        } catch (error) {
            alert('This browser or device does not support bluetooth connection.');
        }
    }

    disconnect() {
        this.device.gatt.disconnect();
    }

    send(data) {
        /* HANDLE SEND DATA THROUGH BLUETOOTH */
        this.characteristic.writeValue(new TextEncoder().encode(data));
    }

    receive(handleIncomingData = this.receiveData) {
        /* DEFINE ANOTHER FUNCTION TO HANDLE DATA COMING TO THE BROWSER FROM BLUETOOTH */
        this.characteristic.oncharacteristicvaluechanged = handleIncomingData;
    }
}

let sensorData = [];
const config = {
    "service": 0xFFE0,
    "uuid": "0000ffe1-0000-1000-8000-00805f9b34fb"
}

function handleIncomingData(event) {
    const response = new TextDecoder().decode(event.target.value);
    
    let dataArray = response.split("\n");
    dataArray.pop();

    let values = dataArray.map(num => {
        let value = parseFloat(num);
        if(value !== NaN) {
            return value;
        }
    });

    sensorData.push(...values);
}

const bluetooth = new Bluetooth(config, handleIncomingData);
    