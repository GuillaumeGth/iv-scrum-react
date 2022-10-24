import Api from "./Api";
import { setTeams } from "../redux/action";
export default class Common {     
    public static getRandomInt = (max: number) => {
        return Math.floor(Math.random() * max);
    }
    public static dateTostring = (distance: number) => {
        // Time calculations for days, hours, minutes and seconds        
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        // Display the result in the element with id="demo"
        return  minutes + "m" + seconds + "s ";
    }
    public static getTeams = (callback: Function) => {        
        Api.call('/team', { method: 'GET', callback: (data: any) => {            
            callback(data);
        }})
    }
}
