import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

import {Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button} from "@material-ui/core";
import {commerce} from "../../../lib/commerce";

import AddressForm from "../AddressForm";
import PaymentForm from "../PaymentForm";

import useStyles from "./styles";

const steps = ["Shipping address", "Payment details"];

const Checkout = ({cart, order, onCaptureCheckout, error}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    const classes = useStyles();

    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, {type: "cart"});
                setCheckoutToken(token);
            } catch(err) {
                console.log(err);
            }
        }

        if (cart.line_items.length > 0) {
            generateToken();
        }
    }, [cart]);

    const nextStep = () => setActiveStep(prevStep => prevStep + 1);
    const backStep = () => setActiveStep(prevStep => prevStep - 1);

    const next = (data) => {
        setShippingData(data);
        nextStep();
    }

    let Confirmation = () => order.customer ? (
        <>
            <div>
                <Typography variant="h5">Thank you for your purchase, firstName lastName</Typography>
                <Divider className={classes.Divider} />
                <Typography variant="subtitle2">Order ref: ref</Typography>
            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
        </>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    );

    if (error) {
        <>
            <Typography variant="h5">Error: {error}</Typography>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
        </>
    }

    const Form = () => activeStep === 0
        ? <AddressForm checkoutToken={checkoutToken} next={next} />
        : <PaymentForm 
            checkoutToken={checkoutToken} 
            shippingData={shippingData} 
            backStep={backStep} 
            onCaptureCheckout={onCaptureCheckout}
            nextStep={nextStep}
        />;

    return (
        <>
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map(step => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>
            </main>
        </>
    );
}

export default Checkout;