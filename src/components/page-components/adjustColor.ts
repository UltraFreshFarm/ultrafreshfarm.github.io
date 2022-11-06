import { TinyColor } from '@ctrl/tinycolor';

export function adjustColor(color:string, brightness:number, alpha:number) {
    let tc = new TinyColor(color);
    const currentBrightnessPercentage = (tc.getBrightness() / 255) * 100;
    tc.lighten((100 - currentBrightnessPercentage) * brightness);
    tc.setAlpha(alpha);
    return tc;
}