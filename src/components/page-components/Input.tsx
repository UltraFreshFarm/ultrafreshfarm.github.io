import {ChangeEventHandler, CSSProperties, HTMLInputTypeAttribute} from "react";
import {ButtonTheme,  theme} from "../../routes/Theme";

interface InputStyle {
    containerStyle?: CSSProperties,
    titleStyle?: CSSProperties,
    inputStyle?: CSSProperties,
    errorStyle?: CSSProperties
}

export function Input(props: {
    title: string,
    placeholder: string,
    value?: string,
    defaultValue?: string,
    onChange?: ChangeEventHandler<HTMLInputElement> | undefined,
    error?: string,
    style?: InputStyle,
    type?: HTMLInputTypeAttribute,
    disabled?: boolean,
    inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search"
}) {

    const {error, value, defaultValue, style, type, inputMode} = props;
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '5px 10px',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        position: 'relative',
        ...style?.containerStyle
    }}>
        <div style={{
            paddingLeft: 5,
            fontWeight: 'bold',
            fontSize: 13, ...style?.titleStyle
        }}>{props.title}</div>
        <input style={{
            backgroundColor: 'rgba(0,0,0,0.03)',
            border: `1px solid ${error ? theme[ButtonTheme.danger] : 'rgba(0,0,0,0.01)'}`,
            padding: '5px 10px',
            borderRadius: 5,
            fontSize: 16,
            minWidth: 0,
            ...style?.inputStyle
        }} placeholder={props.placeholder} value={value} defaultValue={defaultValue} onChange={props.onChange}
               title={error} type={type} inputMode={inputMode} onFocus={e => e.target.select()}
               disabled={props.disabled}/>
        <div style={{
            paddingRight: 5,
            fontSize: 12,
            textAlign: 'right',
            color: theme[ButtonTheme.danger],
            height: 10,
            ...style?.errorStyle
        }}>{props.error}</div>
    </div>;
}