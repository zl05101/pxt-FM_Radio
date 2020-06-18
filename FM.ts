/**
* makecode I2C FM Package.
* From microbit/micropython Chinese community.
* http://www.micropython.org.cn
*/

//% weight=20 color=#0855AA icon="\uf108" block="收音机"
namespace RDA5807M{
    let RDA5807M_SLAVE_ADDRESS = 0x10;
    let reg_data = pins.createBuffer(8);
    let reg_read_data = pins.createBuffer(4);
    reg_data[0] = 0xd0;
    reg_data[1] = 0x0;
    reg_data[2] = 0x0;
    reg_data[3] = 0x0;
    reg_data[4] = 0x0;
    reg_data[5] = 0x40;
    reg_data[6] = 0x90;
    reg_data[7] = 0x8F;

    function write_register():void{
        pins.i2cWriteBuffer(RDA5807M_SLAVE_ADDRESS, reg_data);
    }

    function read_register():void{
        reg_read_data = pins.i2cReadBuffer(RDA5807M_SLAVE_ADDRESS, 4);
    }

    function seek():void{
        reg_data[3] &= ~(1 << 4);
        reg_data[0] |= 0x01;
        write_register();
        while(1){
            pause(100);
            read_register();
            if((reg_read_data[0] & 0x40) == 0x40){
                break;
            }
        }
        let chan = reg_read_data[0] & 0x03;
        chan = reg_read_data[1] | (chan << 8);
        chan = chan << 6;
        reg_data[2] = (chan >> 8) & 0xff;
        reg_data[3] = (chan & 0xff);
    }

    /**
     * FM向下搜台
     * @param none
     */
    //% blockId="RDA5807M_seekDown" block="向下搜台"
    //% weight=70 blockGap=8
    //% parts=RDA5807M trackArgs=0
    export function seekDown():void{
        reg_data[0] &= ~(1 << 1);
        seek();
    }

    /**
     * FM向上搜台
     * @param none
     */
    //% blockId="RDA5807M_seekUp" block="向上搜台"
    //% weight=70 blockGap=8
    //% parts=RDA5807M trackArgs=0
    export function seekUp():void{
        reg_data[0] |= 1 << 1;
        seek();
    }

    /**
     * FM获取频率
     * @param none
     */
    //% blockId="RDA5807M_getFreq" block="获取当前频道的频率"
    //% weight=70 blockGap=8
    //% parts=RDA5807M trackArgs=0
    export function getFreq():number{
        let temp = (reg_data[2] * 256) + (reg_data[3] & 0xC0);
        temp = temp >> 6;
        let freq = 10 * temp + 8700;
        return freq;
    }

    /**
     * FM音量加大
     * @param none
     */
    //% blockId="RDA5807M_volumeUp" block="音量增大"
    //% weight=70 blockGap=8
    //% parts=RDA5807M trackArgs=0
    export function volumeUp():void{
        if((reg_data[7] & 0x0F) < 0xF){
            reg_data[7]++;
        }
        reg_data[0] = 0xD0;
        write_register();
    }

    /**
     * FM音量减小
     * @param none
     */
    //% blockId="RDA5807M_volumeDown" block="音量减小"
    //% weight=70 blockGap=8
    //% parts=RDA5807M trackArgs=0
    export function volumeDown():void{
        if((reg_data[7] & 0x0F) > 0){
            reg_data[7]--;
        }
        reg_data[0] = 0xD0;
        write_register();
    }

    /**
     * FM收音机启动
     * @param none
     */
    //% blockId="RDA5807M_begin" block="收音机启动"
    //% weight=70 blockGap=8
    //% parts=RDA5807M trackArgs=0
    export function begin():void{
        pause(50)
        reg_data[0] = 0x00;
        reg_data[1] = 0x02;
        write_register();
        pause(50);
        reg_data[0] = 0xD0;
        reg_data[1] = 0x01;
        write_register();
    }
}
