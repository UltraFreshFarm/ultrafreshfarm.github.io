import {DbOrder} from "../../components/model/DbOrder";
import {DbOrderLineItems} from "../../components/model/DbOrderLineItems";
import {SkeletonBox} from "../../components/page-components/SkeletonBox";

export function OrderPanel(props: { order: DbOrder | null, orderLineItems: DbOrderLineItems[],refresh:() => void }) {
    const {order, orderLineItems,refresh} = props;
    return <div style={{
        padding: '0 20px 20px 20px',
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
    }}>

        <div style={{marginTop: 10, paddingBottom: 30}}>
            {orderLineItems.map((item, index) => {
                return <div key={item.barcode}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '10px 0px',
                                borderBottom: '1px solid rgba(0,0,0,0.1)'
                            }}>
                    <div style={{display: 'flex'}}>
                        <div style={{
                            marginRight: 10,
                            fontSize: 12,
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            marginTop: 2,
                            whiteSpace: 'nowrap',
                            textAlign: 'right',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            color: 'white',
                        }}>{index + 1}</div>
                        <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                            <SkeletonBox skeletonVisible={order === null} style={{height:16,marginBottom:5}}>
                            <div style={{
                                fontSize: 18,
                                marginBottom: 5
                            }}>{item.category} {item.name} {item.unit} {item.unit_type}</div>
                            </SkeletonBox>
                            <SkeletonBox skeletonVisible={order === null} style={{height:16}}>
                            <div style={{display: "flex"}}>
                                <div style={{flexGrow: 1}}>{item.requested_amount} x AED {item.price}</div>
                                <div
                                    style={{fontWeight: 'bold'}}>AED {(item.requested_amount * item.price).toFixed(2)}</div>
                            </div>
                            </SkeletonBox>
                        </div>
                    </div>
                </div>
            })}
        </div>

    </div>;
}