import {useCategoriesList} from "./Categories";
import {useAppContext} from "../components/useAppContext";
import {useNavigate} from "../components/useNavigate";
import {useGroupFromCategory} from "./ProductWithCategory";
import {motion} from "framer-motion";
import {Image} from "../components/page-components/Image";
import {HeaderNavigation} from "../components/page-components/HeaderNavigation";
import {FaShippingFast} from "react-icons/fa";
import {IoPricetagsOutline, IoRibbonOutline} from "react-icons/io5";
import {TbRefresh} from "react-icons/tb";
import {adjustColor} from "../components/page-components/adjustColor";

const colorSet = ['#04B250',
    '#0A8FA0',
    '#0A5CA0',
    '#0D0AA0',
    '#660AA0',
    '#A00A99',
    '#A00A56',
    '#A00A22',
    '#A0460A',
    '#A0750A',
    '#7EA00A',
    '#30A00A',
    '#0AA077',
    '#0A82A0',
    '#0A2BA0'];

const colorSetLowOpacity = colorSet.map(cs => adjustColor(cs,1,0.05));

function PromotionBanner() {
    return <div style={{position: 'relative',backgroundColor:'rgba(0,0,0,0.03)',borderTop:'1px solid rgba(0,0,0,0.1)',borderBottom:'1px solid rgba(0,0,0,0.1)'}}>
        <div style={{
            position: 'absolute',
            width: '100%',
            height: 45,
            bottom: 30,
            opacity: 0.5,
            borderTop: '1px solid rgba(0,0,0,0.05)',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            background: 'linear-gradient(to left, #8360c3, #2ebf91)'
        }}/>
        <div style={{display: 'flex', flexShrink: 0, marginBottom: 10, marginTop: 10, position: 'relative'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '33.33%'}}>
                <div style={{
                    width: 90,
                    height: 90,
                    background: '#0AA077',
                    borderRadius: 100,
                    boxShadow: '0 5px 5px 0px rgba(0,0,0,0.3),0 5px 10px 0px rgba(0,0,0,0.1) inset',
                    position:'relative',
                    overflow:'hidden'
                }}>
                    <motion.div style={{position: 'absolute',bottom:25,left:35,display:'flex',alignItems:'center',justifyContent:'center',width:20,height:20}} animate={{rotate:[360,0]}}
                                transition={{repeat: Infinity,bounce:0,ease:'linear',bounceStiffness:0,repeatType:'loop',bounceDamping:0,duration:3}}>
                        <TbRefresh style={{fontSize: 30, color: 'white'}}/>
                    </motion.div>
                </div>
                <div style={{
                    background: '#BD0303',
                    fontSize: 10,
                    padding: '3px 5px',
                    borderRadius: 10,
                    fontWeight: 'bold',
                    color: 'white',
                    position:'absolute',
                    bottom:0
                }}>SUBSCRIBE
                </div>

                <Image src={'/logo/member/regular-delivery.svg'} width={65} height={80}
                       style={{marginTop: -100}}/>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '33.33%'}}>
                <div style={{
                    width: 90,
                    height: 90,
                    background: '#004BAD',
                    borderRadius: 100,
                    boxShadow: '0 5px 5px 0px rgba(0,0,0,0.3),0 5px 10px 0px rgba(0,0,0,0.1) inset',
                    position:'relative',
                    overflow:'hidden'
                }}>
                    <motion.div style={{position: 'absolute',bottom:15,left:33}} animate={{scale:[0.8,1,0.8]}}
                                transition={{repeat: Infinity,bounce:0,ease:'linear',bounceStiffness:0,repeatType:'loop',bounceDamping:0,duration:1}}>
                        <IoRibbonOutline style={{fontSize: 28, color: 'white'}}/>
                    </motion.div>
                </div>
                <div style={{
                    background: '#F0B521',
                    fontSize: 10,
                    padding: '3px 5px',
                    borderRadius: 10,
                    fontWeight: 'bold',
                    color: 'white',
                    position:'absolute',
                    bottom:0
                }}>CLICK HERE
                </div>

                <Image src={'/logo/member/loyalty-program.svg'} width={65} height={80}
                       style={{marginTop: -100}}/>
            </div>


            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '33.33%'}}>
                <div style={{
                    width: 90,
                    height: 90,
                    background: '#AA00AD',
                    borderRadius: 100,
                    boxShadow: '0 5px 5px 0px rgba(0,0,0,0.3),0 5px 10px 0px rgba(0,0,0,0.1) inset',
                    position:'relative',
                    overflow:'hidden'
                }}>
                    <motion.div style={{position: 'absolute',bottom:15,left:33}} animate={{rotate:[10,0,10],scale:[1,0.9,1]}}
                                transition={{repeat: Infinity,bounce:0,ease:'linear',bounceStiffness:0,repeatType:'loop',bounceDamping:0,duration:0.2}}>
                        <IoPricetagsOutline style={{fontSize: 28, color: 'white'}}/>
                    </motion.div>
                </div>
                <div style={{
                    background: '#3696DD',
                    fontSize: 10,
                    padding: '3px 5px',
                    borderRadius: 10,
                    fontWeight: 'bold',
                    color: 'white',
                    position:'absolute',
                    bottom:0
                }}>CLICK HERE
                </div>

                <Image src={'/logo/member/promotion-products.svg'} width={65} height={80}
                       style={{marginTop: -100}}/>
            </div>


        </div>
    </div>;
}

export function Home() {

    const categories = useCategoriesList();
    const {appDimension} = useAppContext();
    return <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <HeaderNavigation/>
        <div style={{height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto', paddingTop: 10}}>
            <div style={{
                display: 'flex',
                flexDirection: "column",
                paddingBottom: 50,
                margin: '0px 0px'
            }}>
                <Image src={'/logo/top-banner-latest.png'} width={appDimension.width - 20}
                       height={(appDimension.width - 20) * 0.5} style={{margin: 10, marginTop: 0}}/>
                <PromotionBanner/>
                <div style={{marginBottom:30,position:'relative',overflow:'hidden',background:'#BD0303',color:'white'}}>
                    <motion.div style={{display:'flex',alignItems:'center',position:'relative'}}
                                animate={{left:['-40%','100%']}} transition={{repeatType:'loop',repeat:Infinity,ease:"linear",duration:5}}>
                        <div style={{marginRight:5,fontStyle:'italic',fontWeight:'bold'}}>NO DELIVERY FEE !</div>
                        <FaShippingFast style={{fontSize:26}}/>
                    </motion.div>

                </div>
                {categories.map((d, index) => {
                    const rowColor = colorSet[index];
                    const rowColorToBackground = `linear-gradient(${colorSetLowOpacity[index]},rgba(255,255,255,0.5) 20%,rgba(255,255,255,0) 30%)`
                    return <div key={d.label} style={{display: 'flex', flexDirection: 'column', width: '100%',position:'relative',marginBottom:20,borderTop:`1px solid ${rowColor}`}}>
                        <CategoryLineRenderer category={d.label} background={rowColorToBackground}/>
                        <div style={{display: 'flex',position:'absolute',top:-25}}>
                            <div style={{
                                marginLeft: 10,
                                padding: 5,
                                fontSize: 12,
                                borderTopRightRadius: 5,
                                borderTopLeftRadius: 5,
                                boxShadow: '0 -7px 10px -7px rgba(0,0,0,0.2)',
                                backgroundColor: rowColor,
                                color: 'white'
                            }}>
                                {d.label}
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </div>
}

function CategoryLineRenderer(props: { category: string,background?:string|number }) {
    const {category,background} = props;
    const groups = useGroupFromCategory(category);
    const {appDimension} = useAppContext();
    const imageDimension = Math.floor(appDimension.width / 3.3) - 10;
    const navigate = useNavigate();
    return <div style={{
        paddingTop: 5,
        overflowX: "auto",
        overflowY: 'hidden',
        display: 'flex',
        boxShadow: '0 -7px 10px -7px rgba(0,0,0,0.15)',
        position:'relative',
        marginBottom:5,
        paddingBottom:15,
        background
    }}>
        {groups.map(group => {
            return <div style={{display: 'flex', flexDirection: 'column', width: imageDimension, flexShrink: 0,alignItems:'center'}}
                        key={group.name} >
                <motion.div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width:90,
                    height:90,
                    borderRadius: 300,
                    background: 'radial-gradient(rgba(255,255,255,0.1) ,rgba(255,255,255,1) 80%)',
                    border:`1px solid rgba(0,0,0,0.05)`
                }} onTap={() => {
                    navigate(`product-with-category/${category}/${group.name}`);
                }} whileTap={{scale: 0.95}}
                            whileHover={{scale: 1.05}}>
                    <Image src={`/images/${group.barcode}/THUMB/default.png`}
                           style={{marginTop: 5, marginBottom: 5}}
                           height={70}
                           width={70}
                           alt={'Barcode ' + group.barcode}/>
                </motion.div>
                <div style={{
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    marginTop: 5
                }}>
                    {group.name}
                </div>
            </div>
        })}
    </div>
}