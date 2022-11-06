import {blue} from "../../Theme";
import {TitleIcon} from "../../../components/page-components/TitleIcon";
import {IoBasket, IoBasketOutline, IoHome, IoHomeOutline} from "react-icons/io5";
import {BsPatchCheck, BsPatchCheckFill, BsTruck} from "react-icons/bs";
import {FaTruck} from "react-icons/fa";

export function OrderDetailFooter(props: { value: string, onChange: (value: string) => void }) {
    const {value, onChange} = props;
    const style = {width: '25%'};
    const selectedStyle = {width: '25%', color: blue};
    return <div style={{
        backgroundColor: 'rgba(255,255,255,0.9)',
        display: 'flex',
        flexDirection: 'column',
        borderTop: '1px solid rgba(0,0,0,0.1)'
    }}>
        <div style={{display: 'flex'}}>
            <TitleIcon title={'Order'} icon={value === 'order' ? IoBasket : IoBasketOutline} iconSize={27}
                       style={value === 'order' ? selectedStyle : style} onTap={() => onChange('order')}/>
            <TitleIcon title={'Confirm'} icon={value === 'confirm' ? BsPatchCheckFill : BsPatchCheck} iconSize={27}
                       style={value === 'confirm' ? selectedStyle : style} onTap={() => onChange('confirm')}/>
            <TitleIcon title={'Dispatch'} icon={value === 'dispatch' ? FaTruck : BsTruck} iconSize={27}
                       style={value === 'dispatch' ? selectedStyle : style} onTap={() => onChange('dispatch')}/>
            <TitleIcon title={'Received'} icon={value === 'received' ? IoHome : IoHomeOutline} iconSize={27}
                       style={value === 'received' ? selectedStyle : style} onTap={() => onChange('received')}/>
        </div>
    </div>
}
