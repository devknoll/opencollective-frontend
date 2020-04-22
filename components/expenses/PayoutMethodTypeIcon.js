import React from 'react';
import PropTypes from 'prop-types';
import { Paypal as PaypalIcon } from '@styled-icons/fa-brands/Paypal';
import { University as BankIcon } from '@styled-icons/fa-solid/University';
import { ExchangeAlt as OtherIcon } from '@styled-icons/fa-solid/ExchangeAlt';
import { PayoutMethodType } from '../../lib/constants/payout-method';

const PayoutMethodTypeIcon = ({ type, ...props }) => {
  switch (type) {
    case PayoutMethodType.PAYPAL:
      return <PaypalIcon {...props} />;
    case PayoutMethodType.BANK_ACCOUNT:
      return <BankIcon {...props} />;
    default:
      return <OtherIcon {...props} />;
  }
};

PayoutMethodTypeIcon.propTypes = {
  type: PropTypes.oneOf(Object.values(PayoutMethodType)),
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default PayoutMethodTypeIcon;
