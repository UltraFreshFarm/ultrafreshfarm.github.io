import {Categories} from "./Categories";
import {ProductDetail} from "./ProductDetail";
import {Routes} from "../components/useRoute";
import Cart from "./Cart";
import {Shipping} from "./Shipping";
import ProductWithCategory from "./ProductWithCategory";
import Payment from "./Payment";
import History from "./History";
import OrderDetail from "./OrderDetail";
import {Home} from "./Home";
import {FooterNavigation} from "../components/page-components/FooterNavigation";
import {UserAccount} from "./UserAccount";
import {SignIn} from "./SignIn";
import {LandingScreen} from "./LandingScreen";
import {HeaderNavigation} from "../components/page-components/HeaderNavigation";


export const routes: Routes = {
    '': {
        component: LandingScreen,
        animateIn: {
            scale: 1,
            opacity: 1,
        },
        animateOut: {
            scale: 0.1,
            opacity: 0.1,
            transition: {
                bounce: 0
            }
        },
        initial: {
            scale: 0.1,
            opacity: 0.1
        }
    },
    'categories': {
        component: Categories,
        footerComponent: FooterNavigation,
        headerComponent :HeaderNavigation,
        animateIn: {
            left: 0,
            transition: {
                bounce: 0
            }
        },
        animateOut: {
            left: '-100%',
            transition: {
                bounce: 0
            }
        },
        initial: {
            left: '-100%'
        }
    },
    'home': {
        component: Home,
        footerComponent: FooterNavigation,
        headerComponent :HeaderNavigation,
        animateIn: {
            left: 0,
            transition: {
                bounce: 0
            }
        },
        animateOut: {
            left: '-100%',
            transition: {
                bounce: 0
            }
        },
        initial: {
            left: '-100%'
        }
    },
    'product-detail/$productId': {
        component: ProductDetail,
        animateIn: {
            right: 0,
            transition: {
                bounce: 0
            }
        },
        animateOut: {
            right: '-100%',
            transition: {
                bounce: 0
            }
        },
        initial: {
            right: '-100%'
        }
    },
    'cart': {
        component: Cart,
        footerComponent: FooterNavigation,
        headerComponent :HeaderNavigation,
        animateOut: {
            bottom: '-100%',
            transition: {
                bounce: 0
            }
        },
        animateIn: {
            bottom: 0,
            transition: {
                bounce: 0
            }
        },
        initial: {
            bottom: '-100%'
        }
    },
    'shipping': {
        component: Shipping,
        animateIn: {
            right: 0,
            transition: {
                bounce: 0
            }
        },
        animateOut: {
            right: '-100%',
            transition: {
                bounce: 0
            }
        },
        initial: {
            right: '-100%'
        }
    },
    'product-with-category/$category/$group': {
        component: ProductWithCategory,
        animateIn: {
            right: 0,
            transition: {
                bounce: 0
            }
        },
        animateOut: {
            right: '-100%',
            transition: {
                bounce: 0
            }
        },
        initial: {
            right: '-100%'
        }
    },
    'payment': {
        component: Payment,
        animateIn: {
            right: 0,
            transition: {
                bounce: 0
            }
        },
        animateOut: {
            right: '-100%',
            transition: {
                bounce: 0
            }
        },
        initial: {
            right: '-100%'
        }
    },
    'history': {
        component: History,
        footerComponent: FooterNavigation,
        headerComponent :HeaderNavigation,
        animateIn: {
            right: 0,
            transition: {
                bounce: 0
            }
        },
        animateOut: {
            right: '-100%',
            transition: {
                bounce: 0
            }
        },
        initial: {
            right: '-100%'
        }
    },
    'order-detail/$id': {
        component: OrderDetail,
        animateIn: {
            right: 0,
            transition: {
                bounce: 0
            }
        },
        animateOut: {
            right: '-100%',
            transition: {
                bounce: 0
            }
        },
        initial: {
            right: '-100%'
        }
    },
    'user-account': {
        component: UserAccount,
        footerComponent: FooterNavigation,
        headerComponent :HeaderNavigation,
        animateIn: {
            right: 0,
            transition: {
                bounce: 0
            }
        },
        animateOut: {
            right: '-100%',
            transition: {
                bounce: 0
            }
        },
        initial: {
            right: '-100%'
        }
    },
    'sign-in': {
        component: SignIn,
        initial: {
            top: '-100%'
        },
        animateIn: {
            top: 0,
            transition: {
                bounce: 0
            }
        },
        animateOut: {
            top: '-100%',
            transition: {
                bounce: 0
            }
        }
    }


}