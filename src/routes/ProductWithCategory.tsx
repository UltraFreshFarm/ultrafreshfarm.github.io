import {RouteProps} from "../components/useRoute";
import {CSSProperties, useEffect, useMemo} from "react";
import {data} from "../data";
import {useAppContext} from "../components/useAppContext";
import {Header} from "../components/page-components/Header";
import {Store, useCreateStore, useStoreValue} from "../components/store/useCreateStore";
import {AnimatePresence, motion} from "framer-motion";
import {blue, red, white, yellow} from "./Theme";
import {MdAddCircle, MdCancel} from "react-icons/md";
import {IoCheckmarkCircle} from "react-icons/io5";
import {Product} from "../components/AppState";
import {Image} from "../components/page-components/Image";

function UnitSelector(props: { unit: { unitType: string; unit: string, barcode: string }, selectedStore: Store<any>, selected?: boolean }) {
    const {selectedStore, unit, selected} = props;
    const {store: globalStore} = useAppContext();
    const hasValue = useStoreValue(globalStore, p => {
        return (p.shoppingCart.find(c => c.barcode === unit.barcode)?.total ?? 0) > 0
    });
    return <motion.div layout whileTap={{scale: 0.95}}
                       initial={{opacity: 0, top: -10}}
                       animate={{
                           opacity: 1,
                           top: 0,
                       }}
                       exit={{opacity: 0, top: -10}}
                       key={unit.unit + unit.unitType} style={{
        background: selected ? 'url("/logo/banner-bg.png")' : 'unset',
        color: selected ? white : 'unset',
        marginTop: 10,
        padding: 5,
        borderRadius: 5,
        fontSize: 12,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        border: '1px dashed rgba(0,0,0,0.1)',
        display: 'flex'
    }} onTap={() => {
        selectedStore.dispatch({payload: unit, type: 'UNIT_SELECTED'})
    }}>
        <div style={{flexGrow: 1}}>
            {unit.unit} {unit.unitType}
        </div>

        {hasValue &&
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginLeft: 2,
                    fontSize: 16,
                    marginTop: -2
                }}>
                <IoCheckmarkCircle/>
            </div>
        }
    </motion.div>;
}

export function AddRemoveButton(props: { barcode?: string, size?: 'small' | 'normal' }) {
    const {barcode, size} = props;
    const {store} = useAppContext();

    const totalInCart = useStoreValue(store, (value) => {
        const total = value.shoppingCart.find(s => s.barcode === barcode)?.total;
        return total;
    }, [barcode]) ?? 0;
    const fontSize = size === 'small' ? 26 : 36;
    const labelFontSize = size === 'small' ? 9 : 18;
    const totalInCartFont = size === 'small' ? 20 : 30;
    const textMinWidth = size === 'small' ? 25 : 45;
    return <AnimatePresence>
        <motion.div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 50,
            background: 'rgba(255,255,255,0.8)',
            position: 'relative'
        }} layoutId={`container-${barcode}-${size}`}>
            {totalInCart > 0 &&
                <motion.div style={{
                    color: red,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize
                }} layoutId={`cancel-${barcode}-${size}`} whileTap={{scale: 0.95}} onTap={() => {
                    store.dispatch({type: 'remove_from_cart', payload: {barcode}})
                }} initial={{opacity: 0}} animate={{opacity: 1}}>
                    <MdCancel/>
                </motion.div>
            }
            {totalInCart > 0 &&
                <motion.div layoutId={`label-${barcode}-${size}`} style={{
                    width: '100%',
                    marginLeft: 10,
                    marginRight: 10,
                    textAlign: 'center',
                    minWidth: textMinWidth,
                    fontWeight: 'bold',
                    fontSize: totalInCartFont
                }} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                    {totalInCart}
                </motion.div>
            }
            <motion.div layoutId={`add-${barcode}-${size}`} style={{
                background: size === 'small' ? white : blue,
                color: size === 'small' ? blue : white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize,
                borderRadius: 60,
                border: '1px solid rgba(0,0,0,0.1)'
            }} whileTap={{scale: 0.95}} onTap={() => {
                store.dispatch({type: 'add_to_cart', payload: {barcode}})
            }}>
                <MdAddCircle/>
                {size !== 'small' &&
                    <div style={{fontSize: labelFontSize, whiteSpace: 'nowrap', margin: '5px 10px 5px 5px'}}>
                        Add To Cart
                    </div>}
            </motion.div>
        </motion.div>
    </AnimatePresence>
}

function ImageSlider(props: { selectedProduct?: Product }) {
    const {appDimension} = useAppContext();
    const {selectedProduct} = props;

    return <div style={{
        display: 'flex',
        position: 'relative',
        overflowX: 'scroll',
        overflowY: 'hidden',
        scrollSnapType: 'x mandatory'
    }}>

        {['default', '1', '2', '3', '4'].map((value) => {
            return <div style={{
                width: appDimension.width,
                display: 'flex',
                justifyContent: 'center',
                flexShrink: 0,
                scrollSnapAlign: 'start'
            }}
                        key={value} onScroll={(event) => {

            }}>
                <Image src={`/images/${selectedProduct?.barcode}/400/${value}.png`}
                       style={{position: 'relative', margin: 10}}
                       height={appDimension.width} width={appDimension.width}
                       alt={'Barcode ' + selectedProduct?.barcode}
                       key={selectedProduct?.barcode}
                />
            </div>
        })}

    </div>;
}

export function useGroupFromCategory(category: string) {
    const groups = useMemo(() => {
        return data.filter(p => p.category === category).reduce((result: { name: string, category: string, barcode: string }[], product: Product, index: number) => {
            if (result.findIndex(r => r.name === product.name && r.category === product.category) < 0) {
                result.push({
                    category: product.category,
                    name: product.name,
                    barcode: product.barcode
                });
            }
            return result;
        }, [])
    }, [category]);
    return groups;
}

export default function ProductWithCategory(props: RouteProps) {
    const category = props.params.get('category');
    const group = props.params.get('group');
    const groups = useGroupFromCategory(category ?? '');
    const {appDimension} = useAppContext();
    let totalBox = groups.length < 6 ? 6 : groups.length;
    const imageDimension = Math.floor((appDimension.width - (10 * totalBox)) / totalBox);
    console.log('We have imageDimension', imageDimension, totalBox);

    const initialSelectedGroup = groups.find(g => g.name === group) ?? groups[0];
    const selectedStore = useCreateStore({
        selectedGroup: initialSelectedGroup,
        selectedUnit: {unit: '', unitType: '', barcode: '', image: 1}
    }, (action) => state => {
        if (action.type === 'GROUP_SELECTED') {
            if (JSON.stringify(state.selectedGroup) !== JSON.stringify(action.payload)) {
                return {...state, selectedGroup: action.payload}
            }
        }
        if (action.type === 'UNIT_SELECTED') {
            if (JSON.stringify(state.selectedUnit) !== JSON.stringify(action.payload)) {
                return {...state, selectedUnit: action.payload}
            }
        }
        return state;
    });
    const {selectedGroup, selectedUnit} = useStoreValue(selectedStore, p => p);
    useEffect(() => {
        if (groups.length > 0) {
            const selectedGroup = groups.find(g => g.name === group) ?? groups[0];
            selectedStore.dispatch({type: 'GROUP_SELECTED', payload: selectedGroup})
        }
    }, [groups, group, selectedStore])

    const units = useMemo(() => {
        return data.filter(d => d.category === selectedGroup.category && d.name === selectedGroup.name).map(p => ({
            unit: p.unit,
            unitType: p.unitType,
            barcode: p.barcode
        }));
    }, [selectedGroup]);

    useEffect(() => {
        if (units.length > 0) {
            const unit = units[0];
            selectedStore.dispatch({type: 'UNIT_SELECTED', payload: unit});
        }
    }, [units, selectedStore])
    const selectedProduct = data.find(d => d.barcode === selectedUnit.barcode);

    return <div style={{display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden'}}>
        <Header title={category ?? ''}/>
        <div style={{
            height: '100%',
            padding: '10px 0px 10px 0px',
        }}>
            <ImageSlider selectedProduct={selectedProduct}/>
        </div>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '100%',
            position: 'absolute',
            overflow: 'hidden',
            bottom: 0
        }}>
            <div style={{display: "flex", alignItems: 'flex-end', marginLeft: 10, marginRight: 10, marginBottom: 10}}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,

                }}>
                    <div style={{
                        fontSize: 26,
                        textShadow: '2px 0px 2px #ffffff,-2px 0px 2px #ffffff,0px 2px 2px #ffffff,0px -2px 2px #ffffff'
                    }}>{selectedProduct?.unit} {selectedProduct?.unitType}</div>
                    <div style={{
                        fontSize: 26,
                        marginBottom: 10,
                        textShadow: '2px 0px 2px #ffffff,-2px 0px 2px #ffffff,0px 2px 2px #ffffff,0px -2px 2px #ffffff'
                    }}>{selectedProduct?.category} {selectedProduct?.name}</div>
                    <div style={{
                        fontSize: 18,
                        marginBottom: 10,
                        textShadow: '2px 0px 2px #ffffff,-2px 0px 2px #ffffff,0px 2px 2px #ffffff,0px -2px 2px #ffffff'
                    }}>AED {selectedProduct?.price}</div>
                    <div style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        background: yellow,
                        padding: 10,
                        marginBottom: 10,
                        borderRadius: 10
                    }}>{selectedProduct?.shelfLife} {selectedProduct?.shelfLifeType} Shelf Life
                    </div>
                    <div style={{display: 'flex'}}>
                        <AddRemoveButton barcode={selectedProduct?.barcode}/>
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', flexShrink: 0, marginLeft: 10}}>
                    {units.map(unit => {
                        return <UnitSelector unit={unit} selectedStore={selectedStore} key={unit.unit + unit.unitType}
                                             selected={selectedUnit.unit === unit.unit && selectedUnit.unitType === unit.unitType}/>
                    })}

                </div>
            </div>
            <div style={{
                display: 'flex',
                overflow: 'hidden',
                flexWrap: 'wrap',
                justifyContent: 'center',
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                borderTop: '1px solid rgba(0,0,0,0.2)',
                background: 'url("/logo/banner-bg.png")',
                flexShrink: 0,
                height: 5
            }}>
            </div>
            <div style={{
                display: 'flex',
                flexWrap: "wrap",
                alignContent: "space-between",
                justifyContent: 'center'
            }}>
                {groups.map(group => {
                    return <CategoryIconSelector imageDimension={imageDimension}
                                                 item={{name: group.name, barcode: group.barcode}}
                                                 key={group.barcode} selected={selectedGroup.name === group.name}
                                                 onTap={() => {
                                                     selectedStore.dispatch({type: 'GROUP_SELECTED', payload: group})
                                                 }}/>
                })}
            </div>

        </div>
    </div>
}


const itemStyleSheet: CSSProperties = {
    background: white,
    borderRadius: 10,
    margin: 5,
    marginTop: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    flexGrow: 1,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    border: '1px solid rgba(0,0,0,0.1)',
    boxSizing: 'border-box'
}

//backgroundImage: 'url("/logo/banner-bg.png")',
function CategoryIconSelector<T extends { barcode: string, name: string }>(props: { imageDimension: number, item: T, onTap: (item: T) => void, selected?: boolean }) {
    const {imageDimension, item, selected} = props;
    return <motion.div style={{...itemStyleSheet, height: imageDimension + 30, width: imageDimension,

        background: selected ? 'url("/logo/banner-bg.png")' : 'rgba(255,255,255,0.5)',
        color: selected ? white : 'unset'

    }}
                       key={item.barcode}
                       onTap={() => props.onTap(item)}>
        <Image src={`/images/${item.barcode}/THUMB/default.png`}
               style={{marginTop: 5}}
               width={imageDimension} height={imageDimension} alt={'Barcode ' + item.barcode} whileTap={{scale: 0.95}}
               whileHover={{scale: 1.05}}/>
        <div style={{
            fontSize: 10,
            textAlign: 'center',
            textOverflow: 'ellipsis',
            position: 'absolute',
            bottom: 0,
            height: 25,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {item.name}
        </div>

        {selected &&
            <div style={{background: 'url("/logo/banner-bg.png")', position: 'absolute', top: -2, width: '100%', height: 3}}/>
        }
    </motion.div>;
}