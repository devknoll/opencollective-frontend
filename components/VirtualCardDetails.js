import React from 'react';
import PropTypes from 'prop-types';
import { Box, Flex } from '@rebass/grid';
import themeGet from '@styled-system/theme-get';
import { get } from 'lodash';
import moment from 'moment';
import { FormattedDate, FormattedMessage } from 'react-intl';
import styled, { withTheme } from 'styled-components';

import { formatCurrency } from '../lib/utils';

import GiftCard from './icons/GiftCard';
import Avatar from './Avatar';
import Link from './Link';
import { Span } from './Text';

const DetailsColumnHeader = styled.span`
  text-transform: uppercase;
  color: ${themeGet('colors.black.500')};
  font-weight: 300;
  white-space: nowrap;
`;

/** Render a text status to indicate if virtual card is claimed, and by whom */
const VirtualCardStatus = ({ isConfirmed, collective, data }) => {
  if (isConfirmed) {
    return (
      <FormattedMessage
        id="virtualCards.claimedBy"
        defaultMessage="claimed by {user}"
        values={{
          user: (
            <Link route="collective" params={{ slug: collective.slug }}>
              {collective.name}
            </Link>
          ),
        }}
      />
    );
  } else if (get(data, 'email')) {
    return (
      <FormattedMessage
        id="virtualCards.sentTo"
        defaultMessage="sent to {email}"
        values={{ email: <a href={`mailto:${data.email}`}>{data.email}</a> }}
      />
    );
  } else {
    return <FormattedMessage id="virtualCards.notYetClaimed" defaultMessage="not yet claimed" />;
  }
};

/**
 * Render a VirtualCard details like its status (claimed or not), who claimed it,
 * when was it created... It is not meant to be show to all users, but just to
 * the organizations that create the virtual cards.
 */
class VirtualCardDetails extends React.Component {
  static propTypes = {
    /** The virtual card, which is actually a PaymentMethod */
    virtualCard: PropTypes.object.isRequired,
    /** Collective slug */
    collectiveSlug: PropTypes.string.isRequired,
    /** @ignore Provided by styled-component withTheme(...) */
    theme: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = { expended: false };
  }

  toggleExpended() {
    this.setState(state => ({ expended: !state.expended }));
  }

  getStatusColor(isConfirmed, balance) {
    const { colors } = this.props.theme;
    if (balance === 0) {
      return colors.black[200];
    }

    return isConfirmed ? colors.green[500] : colors.yellow[500];
  }

  renderDetails() {
    const { virtualCard, collectiveSlug } = this.props;
    const redeemCode = virtualCard.uuid.split('-')[0];
    const email = get(virtualCard, 'data.email');
    const linkParams = email ? { code: redeemCode, email, collectiveSlug } : { code: redeemCode, collectiveSlug };

    return (
      <Flex mt="0.75em" fontSize="0.8em">
        {!virtualCard.isConfirmed && (
          <Flex flexDirection="column" mr="2em">
            <DetailsColumnHeader>
              <FormattedMessage id="virtualCards.redeemCode" defaultMessage="REDEEM CODE" />
            </DetailsColumnHeader>
            <Link route="redeem" params={linkParams}>
              {redeemCode}
            </Link>
          </Flex>
        )}
        <Flex flexDirection="column" mr="2em">
          <DetailsColumnHeader>
            <FormattedMessage id="virtualCards.emmited" defaultMessage="Emitted" />
          </DetailsColumnHeader>
          <FormattedDate value={virtualCard.createdAt} />
        </Flex>
        <Flex flexDirection="column" mr="2em">
          <DetailsColumnHeader>
            <FormattedMessage id="virtualCards.expiryDate" defaultMessage="EXPIRY DATE" />
          </DetailsColumnHeader>
          <span>{moment(virtualCard.expiryDate).format('MM/Y')}</span>
        </Flex>
        <Flex flexDirection="column" mr="2em">
          <DetailsColumnHeader>
            <FormattedMessage id="virtualCards.batch" defaultMessage="Batch name" />
          </DetailsColumnHeader>
          <span>
            {virtualCard.batch || (
              <Span fontStyle="italic" color="black.500">
                <FormattedMessage id="virtualCards.notBatched" defaultMessage="Not batched" />
              </Span>
            )}
          </span>
        </Flex>
        <Flex flexDirection="column" mr="2em">
          <DetailsColumnHeader>
            <FormattedMessage id="virtualCards.description" defaultMessage="DESCRIPTION" />
          </DetailsColumnHeader>
          <span>{virtualCard.description}</span>
        </Flex>
      </Flex>
    );
  }

  renderValue() {
    const { initialBalance, currency, monthlyLimitPerMember } = this.props.virtualCard;

    return monthlyLimitPerMember ? (
      <FormattedMessage
        id="virtualCards.monthlyValue"
        defaultMessage="{value} monthly"
        values={{ value: formatCurrency(monthlyLimitPerMember, currency) }}
      />
    ) : (
      formatCurrency(initialBalance, currency)
    );
  }

  render() {
    const { isConfirmed, collective, balance, currency, data } = this.props.virtualCard;

    return (
      <Flex className="vc-details">
        {/* Avatar column */}
        <Box mr="20px">
          {isConfirmed ? (
            <Link route="collective" params={{ slug: collective.slug }} title={collective.name} passHref>
              <GiftCard alignSelf="center" size="2.5em" color={this.getStatusColor(isConfirmed, balance)} />
              <Avatar collective={collective} radius={24} mt="-1em" ml="1em" css={{ position: 'absolute' }} />
            </Link>
          ) : (
            <GiftCard alignSelf="center" size="2.5em" color={this.getStatusColor(isConfirmed, balance)} />
          )}
        </Box>
        {/* Infos + details column */}
        <Flex flexDirection="column" p="0.1em">
          <Box>
            <strong>{this.renderValue()}</strong>{' '}
            <VirtualCardStatus isConfirmed={isConfirmed} collective={collective} data={data} />
          </Box>
          <Box color={this.props.theme.colors.black[500]} fontSize="0.9em">
            <Flex>
              <FormattedMessage
                id="virtualCards.balance"
                defaultMessage="Balance: {balance}"
                values={{ balance: formatCurrency(balance, currency) }}
              />
              <Box mx={1}>|</Box>
              <a onClick={() => this.toggleExpended()}>
                {this.state.expended ? (
                  <FormattedMessage id="closeDetails" defaultMessage="Close Details" />
                ) : (
                  <FormattedMessage id="viewDetails" defaultMessage="View Details" />
                )}
              </a>
            </Flex>
          </Box>
          {this.state.expended && this.renderDetails()}
        </Flex>
      </Flex>
    );
  }
}

export default withTheme(VirtualCardDetails);
