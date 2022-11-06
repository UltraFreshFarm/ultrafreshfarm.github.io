import {RouteProps} from "../components/useRoute";
import {Input} from "../components/page-components/Input";
import {Button} from "../components/page-components/Button";
import {MdSms} from "react-icons/md";
import {blue, ButtonTheme, white} from "./Theme";
import {useCallback, useEffect, useState} from "react";
import {motion} from "framer-motion";
import {IoClose, IoLogInOutline} from "react-icons/io5";
import {StoreValue, useCreateStore} from "../components/store/useCreateStore";
import {produce} from "immer";
import {isNotEmptyText} from "./Shipping";
import {supabase} from "../components/supabase";
import {useAppContext} from "../components/useAppContext";
import {OtpInput} from "../components/page-components/OtpInput";

const initialState = {phone: '', password: '', errors: {phone: '', password: ''}};

export function SignIn(props: RouteProps) {
    const [loginWithOtp, setLoginWithOtp] = useState(true);
    const localStore = useCreateStore(initialState);
    const {showModal} = useAppContext();
    return <div style={{
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255,255,255,0.4)'
    }}>
        <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
            <motion.div style={{fontSize: 36, margin: 20}} whileTap={{scale: 0.95}}
                        onTap={() => window.history.back()}>
                <IoClose/>
            </motion.div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 30}}>
            <motion.div style={{
                background: 'rgba(0,0,0,0.03)',
                margin: 10,
                padding: 10,
                borderRadius: 5,
                textDecoration: !loginWithOtp ? 'underline' : 'unset'
            }}
                        animate={{
                            background: loginWithOtp ? blue : white,
                            color: loginWithOtp ? white : 'rgba(0,0,0,0.7)'
                        }}
                        whileTap={{scale: 0.95}}
                        onTap={() => setLoginWithOtp(true)}>
                OTP Login
            </motion.div>
            <motion.div style={{
                background: 'rgba(0,0,0,0.03)',
                margin: 10,
                padding: 10,
                borderRadius: 5,
                textDecoration: loginWithOtp ? 'underline' : 'unset'
            }}
                        whileTap={{scale: 0.95}}
                        animate={{
                            background: !loginWithOtp ? blue : white,
                            color: !loginWithOtp ? white : 'rgba(0,0,0,0.7)'
                        }}
                        onTap={() => setLoginWithOtp(false)}>
                Password Login
            </motion.div>
        </div>
        <motion.div layout style={{display: 'flex', flexDirection: 'column', margin: 30}}>

            <motion.div layout style={{display: 'flex', alignItems: 'flex-end'}}>
                <div style={{marginBottom: 22, fontWeight: 'bold', marginLeft: 10}}>+971</div>
                <StoreValue store={localStore} selector={[s => s.phone, s => s.errors.phone]}
                            property={['value', 'error']}>
                    <Input title={'Enter Mobile number'} placeholder={'501234567'}
                           style={{containerStyle: {borderBottom: 'none', flexGrow: 1}}} type={"number"}
                           inputMode={"tel"}
                           onChange={(e) => {
                               localStore.setState(produce(state => {
                                   state.phone = e.target.value;
                                   state.errors.phone = isNotEmptyText(e.target.value) ? '' : 'Phone is required';
                               }))
                           }}
                    />
                </StoreValue>
            </motion.div>
            {!loginWithOtp &&
                <motion.div layout>
                    <StoreValue store={localStore} selector={[s => s.password, s => s.errors.password]}
                                property={['value', 'error']}>
                        <Input title={'Password'} type={'password'} placeholder={'Please enter password'}
                               style={{containerStyle: {borderBottom: 'none'}}}
                               onChange={(e) => {
                                   localStore.setState(produce(state => {
                                       state.password = e.target.value;
                                       state.errors.password = isNotEmptyText(e.target.value) ? '' : 'Password is required';
                                   }))
                               }}
                        />
                    </StoreValue>
                </motion.div>
            }
            <Button onTap={async () => {
                const state = localStore.stateRef.current;
                let phone = '+971' + state.phone;
                if (loginWithOtp) {
                    const result = await supabase.auth.signInWithOtp({phone, options: {shouldCreateUser: true}});
                    if (result.error) {
                        localStore.setState(produce(state => {
                            state.errors.phone = 'We do not have any records for this number.';
                        }));
                        return;
                    }

                    const otp = await showModal(closePanel => {
                        return <ValidatingOtp closePanel={closePanel} phone={phone}/>
                    });

                    if (otp === false) {
                        return;
                    }
                    if (otp === 'new-user') {
                        await showModal(closePanel => {
                            return <UpdateUserProfile closePanel={closePanel}/>
                        });
                    }
                    localStore.setState(initialState);
                    window.history.back();
                } else {
                    const result = await supabase.auth.signInWithPassword({phone, password: state.password});
                    if (result.error) {
                        localStore.setState(produce(state => {
                            state.errors.phone = result.error.message;
                        }));
                        return;
                    }
                    localStore.setState(initialState);
                    window.history.back();
                }
            }} title={loginWithOtp ? 'Send OTP' : 'Sign In'} icon={loginWithOtp ? MdSms : IoLogInOutline}
                    theme={ButtonTheme.promoted} style={{marginTop: 30}}/>
        </motion.div>

    </div>
}

function UpdateUserProfile(props: { closePanel: (param: any) => void }) {
    const localStore = useCreateStore({
        firstName: '',
        lastName: '',
        pinNo: '',
        errors: {firstName: '', lastName: '', pinNo: ''}
    });
    const validate = useCallback(() => {
        localStore.setState(produce(draft => {
            draft.errors.firstName = isNotEmptyText(draft.firstName) ? '' : 'First Name is required';
            draft.errors.lastName = isNotEmptyText(draft.lastName) ? '' : 'Last Name is required';
            draft.errors.pinNo = isNotEmptyText(draft.pinNo) ? '' : 'PIN No is required';
            if (draft.pinNo.length !== 6) {
                draft.errors.pinNo = 'PIN No must be 6 numeric character';
            }
        }));
        const state = localStore.stateRef.current;
        const hasError = Object.keys(state.errors).reduce((hasError, key) => {
            return hasError || ((state.errors as any)[key]).toString().length > 0
        }, false);
        return !hasError;
    }, [localStore]);
    return <div style={{
        margin: 30,
        backgroundColor: white,
        padding: 20,
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 5px 5px -3px rgba(0,0,0,0.5)'
    }}>
        <div style={{margin: 10, marginBottom: 20, fontSize: 14}}>We are delighted to have you with us! In order to
            better serve you, we would appreciate it if you could fill out the following information.
        </div>
        <StoreValue store={localStore} selector={[s => s.firstName, s => s.errors.firstName]}
                    property={['value', 'error']}>
            <Input title={'First Name'} placeholder={'Please enter your first name'} onChange={(e) => {
                localStore.setState(produce(draft => {
                    draft.firstName = e.target.value;
                    draft.errors.firstName = isNotEmptyText(e.target.value) ? '' : 'First name is required';
                }))
            }}/>
        </StoreValue>
        <StoreValue store={localStore} selector={[s => s.lastName, s => s.errors.lastName]}
                    property={['value', 'error']}>
            <Input title={'Last Name'} placeholder={'Please enter your last name'} onChange={(e) => {
                localStore.setState(produce(draft => {
                    draft.lastName = e.target.value;
                    draft.errors.lastName = isNotEmptyText(e.target.value) ? '' : 'Last name is required';
                }))
            }}/>
        </StoreValue>
        <div style={{margin: 10, marginBottom: 20, fontSize: 14}}>
            The PIN is a six-digit number that can be entered instead of the OTP in order to log in. This will provide
            you with the benefit of being able to log into the app without waiting for the OTP to be delivered.
        </div>
        <StoreValue store={localStore} selector={[s => s.pinNo, s => s.errors.pinNo]} property={['value', 'error']}>
            <Input title={'PIN No'} placeholder={'Please enter your pin'} type={'number'} inputMode={"numeric"}
                   onChange={(e) => {
                       localStore.setState(produce(draft => {
                           draft.pinNo = e.target.value;
                           draft.errors.pinNo = isNotEmptyText(e.target.value) ? '' : 'PIN no is required';
                       }))
                   }}/>
        </StoreValue>
        <div style={{margin: 10, display: 'flex', flexDirection: 'column'}}>
            <Button onTap={async () => {
                if (validate()) {
                    const {firstName, lastName, pinNo} = localStore.stateRef.current;
                    await supabase.auth.updateUser({data: {firstName, lastName}, password: pinNo});
                    props.closePanel(true);
                }
            }} title={'Save my information'} icon={IoLogInOutline} theme={ButtonTheme.promoted}/>
        </div>
    </div>
}

export function ValidatingOtp(props: { closePanel: (result: any) => void, phone: string }) {
    const [value, setValue] = useState('');
    const {phone, closePanel} = props;
    const [disabled, setDisabled] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    useEffect(() => {
        (async () => {
            if (value.length === 6) {
                setDisabled(true);
                const result = await supabase.auth.verifyOtp({
                    type: 'sms',
                    phone,
                    token: value
                });

                if (result.error) {
                    setErrMessage(result.error.message);
                    setDisabled(false);
                    setValue('');
                    return;
                }
                const userMeta = result?.data?.user?.user_metadata;
                const userAlreadyRegistered = userMeta && 'firstName' in userMeta;
                if (!userAlreadyRegistered) {
                    closePanel('new-user');
                    return;
                }
                closePanel(true);
            }
        })();
    }, [value, closePanel, phone])
    return <div style={{
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        padding: 20,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        boxShadow: '0 5px 10px -7px rgba(0,0,0,1)',
        border: '1px solid rgba(0,0,0,0.1)'
    }}>
        <div style={{display: 'flex'}}>
            <div style={{display: 'flex', flexDirection: 'column', marginBottom: 10, flexGrow: 1}}>
                <div style={{fontSize: 16, marginBottom: 5}}>
                    OTP has been sent to :
                </div>
                <div style={{display: 'flex'}}>
                    <div style={{flexGrow: 1}}>{phone}</div>
                    <div style={{color: 'red'}}>{errMessage}</div>
                </div>
            </div>
        </div>
        <motion.div onTap={() => {
            closePanel(false)
        }} style={{position: 'absolute', top: 10, right: 10}}>
            <IoClose/>
        </motion.div>
        <OtpInput onChange={setValue} value={value} valueLength={6} disabled={disabled}/>

    </div>
}
