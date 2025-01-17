import { CountableTimeInterval } from './interval';
import { durationHour } from './duration';
function encode(date) {
    return Math.floor(date.getTime() / durationHour);
}
function decode(encoded) {
    return new Date(encoded * durationHour);
}
export var utcHour = new CountableTimeInterval(encode, decode);
