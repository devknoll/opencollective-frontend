import React from 'react';
import PropTypes from 'prop-types';

import FormattedMoneyAmount from '../FormattedMoneyAmount';
import { Span } from '../Text';

/**
 * Displays the total amount for all the expense items.
 */
const ExpenseItemsTotalAmount = ({ items, currency }) => {
  const totalAmount = items.reduce((amount, attachment) => amount + (attachment.amount || 0), 0);
  return (
    <Span color="black.500" fontSize="LeadParagraph" letterSpacing={0} data-cy="expense-items-total-amount">
      <FormattedMoneyAmount amount={totalAmount} precision={2} currency={currency} />
    </Span>
  );
};

ExpenseItemsTotalAmount.propTypes = {
  /** The currency of the collective */
  currency: PropTypes.string.isRequired,
  /** Expense items */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number,
    }),
  ).isRequired,
};

export default ExpenseItemsTotalAmount;
