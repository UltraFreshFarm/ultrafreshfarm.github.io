import {useNavigate} from "../useNavigate";
import {useAppContext} from "../useAppContext";
import {useStoreValue} from "../store/useCreateStore";
import {motion} from "framer-motion";
import {ButtonTheme, theme, white, yellow} from "../../routes/Theme";
import {
    IoCart,
    IoCartOutline,
    IoHome,
    IoHomeOutline,
    IoListCircle,
    IoListCircleOutline,
    IoPerson,
    IoPersonOutline
} from "react-icons/io5";
import {AiOutlineOrderedList} from "react-icons/ai";
import {RouteProps} from "../useRoute";

export function FooterNavigation(props: RouteProps) {
    const navigate = useNavigate();
    const path = props.path;
    const {store, appDimension} = useAppContext();
    const itemsInCart = useStoreValue(store, state => {
        return state.shoppingCart.reduce((acc, item) => {
            return acc + item.total
        }, 0);
    });
    return <div style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        position: 'absolute',
        bottom: 0,
        width: appDimension.width,
        boxSizing: 'border-box',
        padding: 5,
        background: 'url("/logo/banner-bg.png")',
        boxShadow:'0px 5px 20px -5px rgba(0,0,0,0.2) inset',
        color:white,
        borderTop: '1px solid rgba(0,0,0,0.05)',
    }}>
        <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}

                    style={{
                        position: 'relative',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: 28,
                        color: path === 'home' ? yellow : 'unset'
                    }}
                    onTap={() => navigate('home')}>
            {path === 'home' ? <IoHome/> : <IoHomeOutline/>}
            <div style={{fontSize: 12}}>Home</div>
        </motion.div>
        <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}

                    style={{
                        position: 'relative',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: 28,
                        color: path === 'categories' ? yellow : 'unset'
                    }}
                    onTap={() => navigate('categories')}>
            {path === 'categories' ? <IoListCircle/> : <IoListCircleOutline/>}
            <div style={{fontSize: 12}}>Categories</div>
        </motion.div>

        <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}

                    style={{
                        position: 'relative',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: 28,
                        color: path === 'cart' ? yellow : 'unset'
                    }}
                    onTap={() => {
                        navigate('cart');
                    }}>
            {path === 'cart' ? <IoCart/> : <IoCartOutline/>}
            <div style={{fontSize: 12}}>Cart</div>
            {itemsInCart > 0 &&
                <div style={{
                    position: 'absolute',
                    top: -3,
                    right: -3,
                    backgroundColor: theme[ButtonTheme.danger],
                    color: white,
                    borderRadius: 25,
                    fontSize: 12,
                    width: 16,
                    height: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {itemsInCart}
                </div>
            }
        </motion.div>

        <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}

                    style={{
                        position: 'relative',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: 28,
                        color: path === 'history' ? yellow : 'unset'
                    }}
                    onTap={() => {
                        navigate('history');
                    }}>
            {path === 'history' ? <AiOutlineOrderedList/> : <AiOutlineOrderedList/>}
            <div style={{fontSize: 12}}>Order</div>
        </motion.div>

        <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}

                    style={{
                        position: 'relative',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: 28,
                        color: path === 'user-account' ? yellow : 'unset'
                    }}
                    onTap={() => navigate('user-account')}>
            {path === 'user-account' ? <IoPerson/> : <IoPersonOutline/>}
            <div style={{fontSize: 12}}>Account</div>
        </motion.div>
    </div>
}