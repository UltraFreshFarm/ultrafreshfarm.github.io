import {Header} from "../components/page-components/Header";
import {motion} from "framer-motion";
import {IoLogInOutline, IoLogOutOutline} from "react-icons/io5";
import {HiOutlineUserCircle} from "react-icons/hi";
import {blue, ButtonTheme, white} from "./Theme";
import {useNavigate} from "../components/useNavigate";
import {useAppContext, User} from "../components/useAppContext";
import invariant from "tiny-invariant";
import {Button} from "../components/page-components/Button";
import {supabase} from "../components/supabase";

function AnonymousPage() {
    const navigate = useNavigate();
    return <div style={{display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto', marginBottom: 52}}>

        <div style={{margin: 20}}>
            <div style={{fontSize: 26, marginBottom: 10}}>
                You are anonymous.
            </div>
            You have been logged in as a guess at this time. Logging in or registering for an account with the
            system
            is necessary in order to be able to execute checkout, or remember your previous transactions.
        </div>


        <div style={{display: 'flex', justifyContent: 'center'}}>
            <motion.div style={{
                margin: 20,
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 0 5px -3px rgba(0,0,0,0.1)',
                padding: 20,
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                borderRadius: 10,
                flexDirection: 'column',
                background: 'rgba(255,255,255,0.4)'
            }} whileTap={{scale: 0.95}} onTap={() => navigate('sign-in')}>
                <div style={{
                    fontSize: 30,
                    backgroundColor: blue,
                    color: white,
                    padding: '5px 8px 5px 2px',
                    width: 30,
                    height: 30,
                    borderRadius: 50
                }}>
                    <IoLogInOutline/>
                </div>
                <div>Sign In</div>
            </motion.div>
        </div>

    </div>;
}

function AccountInfo(props: { user?: User }) {
    const {user} = props;
    invariant(user);
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        margin: 20,
        padding: 20,
        background: 'rgba(255,255,255,0.4)',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: 10
    }}>
        <div style={{
            fontSize: 200,
            display: 'flex',
            justifyContent: 'center',
            margin: 0,
            padding: 20,
            background: 'radial-gradient(rgba(255,255,255,0.6),rgba(0,0,0,0.09))'
        }}>
            <HiOutlineUserCircle/>
        </div>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            paddingBottom: 10,
            marginBottom: 10
        }}>
            <div style={{fontSize: 36, marginBottom: 10}}>{user.firstName} {user.lastName}</div>
            <div style={{fontSize: 18, marginBottom: 5}}>{user.phone}</div>
            <div>{user.email}</div>
        </div>
        <Button title={'Sign-Out'} onTap={async () => {
            await supabase.auth.signOut();
        }} icon={IoLogOutOutline} theme={ButtonTheme.promoted}/>
    </div>
}

export function UserAccount() {
    const {user} = useAppContext();

    const isAnonymous = user === null;

    return <div style={{display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden',paddingTop:50,boxSizing:'border-box'}}>
        {isAnonymous &&
            <AnonymousPage/>}
        {!isAnonymous && <AccountInfo user={user}/>}
    </div>
}