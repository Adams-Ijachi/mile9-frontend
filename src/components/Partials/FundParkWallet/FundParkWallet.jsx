import { Fragment } from 'react';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
import './FundParkWallet.css';

const FundParkWallet = ({ classes }) => {

  const raveConfig = (data) => {
    return {
      public_key: process.env.REACT_WAVE_PUB_KEY,
      tx_ref: Date.now(),
      amount: data?.amount,
      currency: 'NGN',
      payment_options: 'card,mobilemoney,ussd',
      customer: {
        email: data?.email,
        phonenumber: data?.phone_no,
        name: data?.name,
        amount: 50,
      },
      customizations: {
        title: 'Fund Your Park Wallet',
        description: 'Deposit into park wallet',
        logo: '/images/logo.png',
      },
    }
  }

  const fwConfig = {
    ...raveConfig({
      email: 'votata2788@tst999.com',
      name: 'Vivian Snow',
      phone_no: '09027661919'
    }),
    text: 'Fund Wallet',
    callback: (response) => {
      console.log(response);
      closePaymentModal();
    }
  }

  return (
    <Fragment>
      <FlutterWaveButton className={classes} {...fwConfig} />
    </Fragment>
  );
}

export default FundParkWallet;
