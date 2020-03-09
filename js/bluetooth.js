const service = 0xFFE0;

class Bluetooth {
    constructor(service) {
        this.service = service;
        this.device = null;
    }

    async connect(){
        try {

            /* DISPLAY LIST OF AVALIABLE DEVICES */
            this.device = await navigator.bluetooth.requestDevice({
                optionalServices: [this.service],
                acceptAllDevices: true
            });

            /* CONNECT TO BROWSER */
            await this.device.gatt.connect();


        } catch (error) {
            alert('Conexión bluetooth no disponible en este dispositivo o navegador.');
        }
    }
}

const bluetooth = new Bluetooth(service);
    