/**
* makecode I2C FM Package.
* From microbit/micropython Chinese community.
* http://www.micropython.org.cn
*/

//% weight=20 color=#0855AA icon="\uf040" block="心点FM收音机"
namespace RDA5807M{
    let RDA5807M_SLAVE_ADDRESS = 0x10;
    let reg_data:number[] = [0xD0, 0x00, 0x00, 0x00, 0x00, 0x40, 0x90, 0x8F];

    function write_register():void{
        pins.i2cWriteBuffer(RDA5807M_SLAVE_ADDRESS, reg_data);
    }

    function read_register():void{
        let buf:number[] = pins.i2cReadBuffer(RDA5807M_SLAVE_ADDRESS, 4);
        return buf;
    }

    function seek():void{
        let reg_temp:number[] = [0,0,0,0]
        reg_data[3] &= ~(1 << 4);
        reg_data[0] |= 0x01;
        write_register();
        while(1){
            pause(100);
            reg_temp = read_register();
            if((reg_temp[0] & 0x40) == 0x40){
                break;
            }
        }
        let chan = reg_temp[0] & 0x03
        chan = reg_temp[1] | (chan << 8)
        chan = chan << 6
        reg_data[2] = (chan >> 8) & 0xff
        reg_data[3] = (chan & 0xff)
    }


    /**
     * FM收音机启动
     * @param none
     */
    //% blockId="RDA5807M_begin" block="FM收音机启动"
    //% weight=70 blockGap=8
    //% parts=RDA5807M trackArgs=0
    export function begin():void{
        sleep_ms(50)
        reg_data[0] = 0x00;
        reg_data[1] = 0x02;
        write_register();
        sleep_ms(50);
        reg_data[0] = 0xD0;
        reg_data[1] = 0x01;
        write_register();
    }

    /**
     * FM向下搜台
     * @param none
     */
    //% blockId="RDA5807M_seekDown" block="FM向下搜台"
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
    //% blockId="RDA5807M_seekUp" block="FM向上搜台"
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
    //% blockId="RDA5807M_getFreq" block="FM获取频率"
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
    //% blockId="RDA5807M_volumeUp" block="FM音量加大"
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
    //% blockId="RDA5807M_volumeDown" block="FM音量减小"
    //% weight=70 blockGap=8
    //% parts=RDA5807M trackArgs=0
    export function volumeDown():void{
        if((reg_data[7] & 0x0F) > 0){
            reg_data[7]--;
        }
        reg_data[0] = 0xD0;
        write_register();
    }
}
