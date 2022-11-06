export const blue = '#016CBB';
export const purple = '#8D86CE';
export const green = '#04B250';
export const lightGreen = '#05E868';
export const red = '#A5041F';
export const lightRed = '#E3062B';
export const grey = '#465C58';
export const yellow = '#E3CE06';
export const darkYellow = '#DEB02E';
export const white = 'rgba(255,255,255,1)';

export enum ButtonTheme {
    promoted,
    danger
}


export const theme = {
    [ButtonTheme.promoted]: blue,
    [ButtonTheme.danger]: red
}