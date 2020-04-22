import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import StyledButton from '../StyledButton';
import { Span } from '../Text';
import { PayoutMethodType } from '../../lib/constants/payout-method';
import PayoutMethodTypeIcon from './PayoutMethodTypeIcon';
import Link from '../Link';
import StyledTooltip from '../StyledTooltip';

const getDisabledMessage = (expense, collective, payoutMethod) => {
  const host = collective.host;
  if (!host) {
    return <FormattedMessage id="expense.pay.error.noHost" defaultMessage="Expenses cannot be payed without a host" />;
  } else if (collective.balance < expense.amount) {
    return <FormattedMessage id="expense.pay.error.insufficientBalance" defaultMessage="Insufficient balance" />;
  } else if (!payoutMethod) {
    return null;
  } else if (payoutMethod.type === PayoutMethodType.BANK_ACCOUNT) {
    const { transferwisePayouts, transferwisePayoutsLimit } = host.plan;
    if (transferwisePayoutsLimit !== null && transferwisePayouts >= transferwisePayoutsLimit) {
      return (
        <FormattedMessage
          id="expense.pay.transferwise.planlimit"
          defaultMessage="You reached your plan's limit, <Link>upgrade your plan</Link> to continue paying expense with TransferWise"
          values={{
            Link(message) {
              return <Link route={`/${host.slug}/edit/host-plan`}>{message}</Link>;
            },
          }}
        />
      );
    }
  }
};

const PayExpenseButton = ({ expense, collective, disabled, ...props }) => {
  const disabledMessage = getDisabledMessage(expense, collective, expense.payoutMethod);

  const button = (
    <StyledButton buttonStyle="successSecondary" {...props} disabled={Boolean(disabled || disabledMessage)}>
      <PayoutMethodTypeIcon type={expense.payoutMethod?.type} size={12} />
      <Span ml="6px">
        <FormattedMessage id="actions.pay" defaultMessage="Pay" />
      </Span>
    </StyledButton>
  );

  if (!disabledMessage) {
    return button;
  } else {
    return <StyledTooltip content={disabledMessage}>{button}</StyledTooltip>;
  }
};

PayExpenseButton.propTypes = {
  expense: PropTypes.shape({
    id: PropTypes.string,
    legacyId: PropTypes.number,
    amount: PropTypes.number,
    payoutMethod: PropTypes.shape({
      type: PropTypes.oneOf(Object.values(PayoutMethodType)),
    }),
  }).isRequired,
  collective: PropTypes.shape({
    balance: PropTypes.number,
    host: PropTypes.shape({
      plan: PropTypes.object,
    }),
  }).isRequired,
  /** To disable the button */
  disabled: PropTypes.bool,
};

export default PayExpenseButton;
