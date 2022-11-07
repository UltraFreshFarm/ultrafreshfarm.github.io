import {RouteProps} from "../components/useRoute";
import {Header} from "../components/page-components/Header";
import {Button} from "../components/page-components/Button";
import {MdOutlinePayments} from "react-icons/md";
import {ButtonTheme} from "./Theme";
import {Input} from "../components/page-components/Input";
import {StoreValueHOC, useCreateStore, useStoreValue} from "../components/store/useCreateStore";
import {produce} from "immer";
import {useCallback, useEffect, useRef} from "react";
import {useAppContext} from "../components/useAppContext";
import {useNavigate} from "../components/useNavigate";
import {useFocusListener} from "../components/RouterPageContainer";

export function Shipping(props: RouteProps) {
    const {store: appStore,user} = useAppContext();
    const userNotYetLoggedIn = user === null;
    const continueToPaymentIfUserJustReLoggedIn = useRef(false);
    const navigate = useNavigate();
    const isFocused = useFocusListener(props.path);
    useEffect(() => {
        const userIsLoggedIn = !userNotYetLoggedIn;
        if(isFocused && userIsLoggedIn && continueToPaymentIfUserJustReLoggedIn.current){
            continueToPaymentIfUserJustReLoggedIn.current = false;
            makePayment()
        }
    },[userNotYetLoggedIn,isFocused]);
    const shippingAddress = useStoreValue(appStore, s => s.shippingAddress);

    const store = useCreateStore({
        ...shippingAddress,
        errors: {
            firstName: '',
            lastName: '',
            addressLine1: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            email: '',
            phone: '',
            note: '',
        }
    }, (action) => produce(state => {
        if (action.type === 'update') {
            const stateAny = state as any;
            stateAny[action.payload.key] = action.payload.value;
            const errorsAny = state.errors as any;
            errorsAny[action.payload.key] = action.payload.value === '' ? 'Value is required' : '';
        }
    }));

    useEffect(() => {
        store.setState(old => ({...old, ...shippingAddress}))
    }, [shippingAddress, store])

    const validate = useCallback(() => {
        store.setState(produce(state => {
            state.errors.firstName = isNotEmptyText(state.firstName) ? '' : 'First name is required';
            state.errors.lastName = isNotEmptyText(state.lastName) ? '' : 'Last name is required';
            state.errors.addressLine1 = isNotEmptyText(state.addressLine1) ? '' : 'Address is required';
            state.errors.city = isNotEmptyText(state.city) ? '' : 'City is required';
            state.errors.country = isNotEmptyText(state.country) ? '' : 'Country is required';
            state.errors.state = isNotEmptyText(state.state) ? '' : 'State is required';
            state.errors.zipCode = isNotEmptyText(state.zipCode) ? '' : 'ZipCode is required';
            state.errors.email = isNotEmptyText(state.email) ? '' : 'Email is required';
            state.errors.phone = isNotEmptyText(state.phone) ? '' : 'Phone is required';
        }));
        const state = store.stateRef.current;
        const hasError = Object.keys(state.errors).reduce((hasError, key) => {
            return hasError || ((state.errors as any)[key]).toString().length > 0
        }, false);
        return !hasError;
    }, [store]);

    const makePayment = useCallback(() => {
        if(userNotYetLoggedIn){
            continueToPaymentIfUserJustReLoggedIn.current = true;
            navigate('sign-in');
            return;
        }

        if (validate()) {
            appStore.setState(produce(state => {
                state.shippingAddress = store.stateRef.current;
            }));
            navigate('payment')
        }
    },[appStore, navigate, store.stateRef, userNotYetLoggedIn, validate]);



    const update = useCallback((key: string, value: any) => store.dispatch({
        type: 'update',
        payload: {key, value}
    }), [store]);



    return <div
        style={{
            height: '100%',
            overflow: 'auto',
            background: 'radial-gradient(rgba(255,255,255,1),rgba(0,0,0,0.1))',
            display: 'flex',
            flexDirection: 'column'
        }}>
        <Header title={'Shipping Address'}>
            <div style={{flexGrow: 1, flexDirection: 'row-reverse', display: 'flex'}}>
                <Button title={'Proceed'} onTap={() => makePayment()} theme={ButtonTheme.promoted} icon={MdOutlinePayments}/>
            </div>
        </Header>
        <div style={{
            display: 'flex',
            background: 'white',
            flexDirection: 'column',
            margin: '0px 0px',
            flexGrow: 1,
            overflow: 'auto'
        }}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{fontSize:20,margin:20}}>Please provide the Recipient Information and Shipping Address.</div>
                <StoreValueHOC store={store} selector={[p => p.firstName, p => p.errors.firstName]}
                               property={['value', 'error']} component={Input} title={'First Name'}
                               placeholder={'Type receiver first name here'}
                               onChange={(event) => update('firstName', event.target.value)}/>

                <StoreValueHOC store={store} selector={[p => p.lastName, p => p.errors.lastName]}
                               property={['value', 'error']} component={Input} title={'Last Name'}
                               placeholder={'Type receiver last name here'}
                               onChange={e => update('lastName', e.target.value)}/>
                <StoreValueHOC store={store} selector={[p => p.addressLine1, p => p.errors.addressLine1]}
                               property={['value', 'error']} component={Input} title={'Address line 1'}
                               placeholder={'Type receiver address line 1'}
                               onChange={e => update('addressLine1', e.target.value)}/>

                <StoreValueHOC store={store} selector={p => p.addressLine2}
                               property={'value'} component={Input} title={'Address line 2 (optional)'}
                               placeholder={'Type receiver address line 2'}
                               onChange={e => update('addressLine2', e.target.value)}/>

                <div style={{display: 'flex'}}>
                    <div style={{width: '50%'}}>
                        <StoreValueHOC store={store} selector={[p => p.city, p => p.errors.city]}
                                       property={['value', 'error']} component={Input} title={'City'}
                                       placeholder={'Type city'}
                                       onChange={e => update('city', e.target.value)}/>
                    </div>
                    <div style={{width: '50%'}}>
                        <StoreValueHOC store={store} selector={[p => p.state, p => p.errors.state]}
                                       property={['value', 'error']} component={Input} title={'State'}
                                       placeholder={'Select state'}
                                       onChange={e => update('state', e.target.value)}/>
                    </div>
                </div>
                <div style={{display: 'flex'}}>
                    <div style={{width: '50%'}}>
                        <StoreValueHOC store={store} selector={[p => p.zipCode, p => p.errors.zipCode]}
                                       property={['value', 'error']} component={Input} title={'Zip/Postal Code'}
                                       placeholder={'Type Zip/Postal code'}
                                       onChange={e => update('zipCode', e.target.value)}/>

                    </div>
                    <div style={{width: '50%'}}>
                        <StoreValueHOC store={store} selector={[p => p.country, p => p.errors.country]}
                                       property={['value', 'error']} component={Input} title={'Country'}
                                       placeholder={'Select Country'}
                                       onChange={e => update('country', e.target.value)}/>
                    </div>
                </div>
                <StoreValueHOC store={store} selector={[p => p.email, p => p.errors.email]}
                               property={['value', 'error']}
                               component={Input} title={'Email'} placeholder={'Type receiver  email address here'}
                               onChange={e => update('email', e.target.value)}/>

                <StoreValueHOC store={store} selector={[p => p.phone, p => p.errors.phone]}
                               property={['value', 'error']}
                               component={Input} title={'Phone'} placeholder={'Type receiver  phone number here'}
                               onChange={e => update('phone', e.target.value)}/>

                <StoreValueHOC store={store} selector={[p => p.note, p => p.errors.note]} property={['value', 'error']}
                               component={Input} title={'Note (optional)'} placeholder={'eg : Doorbell number is 33'}
                               onChange={e => update('note', e.target.value)}/>


            </div>
            <div style={{display: 'flex', flexDirection: 'row-reverse', margin: 10}}>
                <Button title={'Proceed'} onTap={() => makePayment()} theme={ButtonTheme.promoted} icon={MdOutlinePayments}/>
            </div>
        </div>

    </div>
}

export function isNotEmptyText(text: string | undefined | null) {
    if (text === undefined) {
        return false;
    }
    if (text === null) {
        return false;
    }
    if (text === '') {
        return false;
    }
    return text.toString().trim() !== '';
}