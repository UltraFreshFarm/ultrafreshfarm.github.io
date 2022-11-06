import {useAppContext} from "../components/useAppContext";
import {data} from "../data";
import React, {useMemo} from "react";
import {useNavigate} from "../components/useNavigate";
import {RouteProps} from "../components/useRoute";
import {ItemIcon} from "../components/page-components/ItemIcon";
import {Product} from "../components/AppState";



export function useCategoriesList() {
    const categories = useMemo(() => {
        const categories = data.reduce((categories: { id: string, label: string, barcode: string }[], product: Product, index: number, source: Product[]) => {
            if (categories.findIndex(c => c.id === product.category) < 0) {
                categories.push({id: product.category, label: product.category, barcode: product.barcode});
            }
            return categories;
        }, []);
        return Array.from(categories);
    }, []);
    return categories;
}


export function Categories(props: RouteProps) {
    const {appDimension} = useAppContext();
    const navigate = useNavigate();
    const imageDimension = Math.floor(appDimension.width / 3) - 10;
    const categories = useCategoriesList();
    return <div style={{display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto'}}>
            <div style={{
                display: 'flex',
                flexWrap: "wrap",
                alignContent: "space-between",
                margin: 'auto',
                paddingBottom: 52,
                paddingTop:50,
            }}>
                {categories.map(d => {
                    return <ItemIcon imageDimension={imageDimension}
                                     item={{name: d.label, barcode: d.barcode}} key={d.barcode}
                                     onTap={(item) => navigate('product-with-category/' + item.name)}/>
                })}
            </div>
        </div>

}