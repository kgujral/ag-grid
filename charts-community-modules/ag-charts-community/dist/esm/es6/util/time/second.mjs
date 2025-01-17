import { CountableTimeInterval } from './interval.mjs';
import { durationSecond, durationMinute } from './duration.mjs';
const offset = new Date().getTimezoneOffset() * durationMinute;
function encode(date) {
    return Math.floor((date.getTime() - offset) / durationSecond);
}
function decode(encoded) {
    return new Date(offset + encoded * durationSecond);
}
export const second = new CountableTimeInterval(encode, decode);
export default second;
