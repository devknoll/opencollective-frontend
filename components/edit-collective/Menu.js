import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Flex } from '@rebass/grid';
import { defineMessages, useIntl } from 'react-intl';
import styled, { css } from 'styled-components';

import { FEATURES, isFeatureAllowedForCollectiveType } from '../../lib/allowed-features';
import { CollectiveType } from '../../lib/constants/collectives';

import Link from '../Link';

const MenuDivider = styled.div`
  margin-top: 34px;
`;

export const EDIT_COLLECTIVE_SECTIONS = {
  INFO: 'info', // First on purpose
  COLLECTIVE_GOALS: 'goals',
  CONNECTED_ACCOUNTS: 'connected-accounts',
  UPDATES: 'updates',
  CONVERSATIONS: 'conversations',
  EXPENSES: 'expenses',
  EXPORT: 'export',
  HOST: 'host',
  MEMBERS: 'members',
  PAYMENT_METHODS: 'payment-methods',
  TICKETS: 'tickets',
  TIERS: 'tiers',
  VIRTUAL_CARDS: 'gift-cards',
  WEBHOOKS: 'webhooks',
  ADVANCED: 'advanced', // Last on purpose
  // Host Specific
  FISCAL_HOSTING: 'fiscal-hosting',
  HOST_PLAN: 'host-plan',
  EXPENSES_PAYOUTS: 'expenses-payouts',
  INVOICES_RECEIPTS: 'invoices-receipts',
  RECEIVING_MONEY: 'receiving-money',
  SENDING_MONEY: 'sending-money',
};

const SECTION_LABELS = defineMessages({
  [EDIT_COLLECTIVE_SECTIONS.ADVANCED]: {
    id: 'editCollective.menu.advanced',
    defaultMessage: 'Advanced',
  },
  [EDIT_COLLECTIVE_SECTIONS.COLLECTIVE_GOALS]: {
    id: 'editCollective.menu.goals',
    defaultMessage: 'Collective Goals',
  },
  [EDIT_COLLECTIVE_SECTIONS.CONNECTED_ACCOUNTS]: {
    id: 'editCollective.menu.connectedAccounts',
    defaultMessage: 'Connected Accounts',
  },
  [EDIT_COLLECTIVE_SECTIONS.UPDATES]: {
    id: 'updates',
    defaultMessage: 'Updates',
  },
  [EDIT_COLLECTIVE_SECTIONS.CONVERSATIONS]: {
    id: 'conversations',
    defaultMessage: 'Conversations',
  },
  [EDIT_COLLECTIVE_SECTIONS.EXPORT]: {
    id: 'editCollective.menu.export',
    defaultMessage: 'Export',
  },
  [EDIT_COLLECTIVE_SECTIONS.EXPENSES]: {
    id: 'editCollective.menu.expenses',
    defaultMessage: 'Expenses Policy',
  },
  [EDIT_COLLECTIVE_SECTIONS.EXPENSES_PAYOUTS]: {
    id: 'editCollective.expensesPayouts',
    defaultMessage: 'Expenses & Payouts',
  },
  [EDIT_COLLECTIVE_SECTIONS.HOST]: {
    id: 'Fiscalhost',
    defaultMessage: 'Fiscal Host',
  },
  [EDIT_COLLECTIVE_SECTIONS.HOST_PLAN]: {
    id: 'Host.Plan',
    defaultMessage: 'Host Plan',
  },
  [EDIT_COLLECTIVE_SECTIONS.INFO]: {
    id: 'editCollective.menu.info',
    defaultMessage: 'Info',
  },
  [EDIT_COLLECTIVE_SECTIONS.INVOICES_RECEIPTS]: {
    id: 'editCollective.invoicesAndReceipts',
    defaultMessage: 'Invoices & Receipts',
  },
  [EDIT_COLLECTIVE_SECTIONS.RECEIVING_MONEY]: {
    id: 'editCollective.receivingMoney',
    defaultMessage: 'Receiving Money',
  },
  [EDIT_COLLECTIVE_SECTIONS.SENDING_MONEY]: {
    id: 'editCollective.sendingMoney',
    defaultMessage: 'Sending Money',
  },
  [EDIT_COLLECTIVE_SECTIONS.FISCAL_HOSTING]: {
    id: 'editCollective.fiscalHosting',
    defaultMessage: 'Fiscal Hosting',
  },
  [EDIT_COLLECTIVE_SECTIONS.MEMBERS]: {
    id: 'editCollective.menu.members',
    defaultMessage: 'Core Contributors',
  },
  [EDIT_COLLECTIVE_SECTIONS.PAYMENT_METHODS]: {
    id: 'editCollective.menu.paymentMethods',
    defaultMessage: 'Payment Methods',
  },
  [EDIT_COLLECTIVE_SECTIONS.TIERS]: {
    id: 'editCollective.menu.tiers',
    defaultMessage: 'Tiers',
  },
  [EDIT_COLLECTIVE_SECTIONS.VIRTUAL_CARDS]: {
    id: 'editCollective.menu.virtualCards',
    defaultMessage: 'Gift Cards',
  },
  [EDIT_COLLECTIVE_SECTIONS.WEBHOOKS]: {
    id: 'editCollective.menu.webhooks',
    defaultMessage: 'Webhooks',
  },
  [EDIT_COLLECTIVE_SECTIONS.TICKETS]: {
    id: 'editCollective.menu.tickets',
    defaultMessage: 'Tickets',
  },
});

const MenuItem = styled(Link)`
  display: block;
  border-radius: 5px;
  padding: 5px 10px;
  color: #888;
  cursor: pointer;
  &:hover,
  a:hover {
    color: black;
  }
  ${({ selected }) =>
    selected &&
    css`
      background-color: #eee;
      color: black;
    `};
`;

// Some condition helpers
const isType = collectiveType => ({ type }) => type === collectiveType;
const isOneOfTypes = (...collectiveTypes) => ({ type }) => collectiveTypes.includes(type);
const isFeatureAllowed = feature => ({ type }) => isFeatureAllowedForCollectiveType(type, feature);
const sectionsDisplayConditions = {
  [EDIT_COLLECTIVE_SECTIONS.INFO]: () => true,
  [EDIT_COLLECTIVE_SECTIONS.COLLECTIVE_GOALS]: isType(CollectiveType.COLLECTIVE),
  [EDIT_COLLECTIVE_SECTIONS.CONNECTED_ACCOUNTS]: collective =>
    collective.isHost || collective.type == CollectiveType.COLLECTIVE,
  [EDIT_COLLECTIVE_SECTIONS.UPDATES]: isFeatureAllowed(FEATURES.UPDATES),
  [EDIT_COLLECTIVE_SECTIONS.CONVERSATIONS]: isFeatureAllowed(FEATURES.CONVERSATIONS),
  [EDIT_COLLECTIVE_SECTIONS.EXPENSES]: isType(CollectiveType.COLLECTIVE),
  [EDIT_COLLECTIVE_SECTIONS.EXPORT]: isType(CollectiveType.COLLECTIVE),
  [EDIT_COLLECTIVE_SECTIONS.HOST]: isType(CollectiveType.COLLECTIVE),
  [EDIT_COLLECTIVE_SECTIONS.MEMBERS]: isOneOfTypes(CollectiveType.COLLECTIVE, CollectiveType.ORGANIZATION),
  [EDIT_COLLECTIVE_SECTIONS.PAYMENT_METHODS]: isOneOfTypes(CollectiveType.USER, CollectiveType.ORGANIZATION),
  [EDIT_COLLECTIVE_SECTIONS.TICKETS]: isType(CollectiveType.EVENT),
  [EDIT_COLLECTIVE_SECTIONS.TIERS]: isOneOfTypes(CollectiveType.COLLECTIVE, CollectiveType.EVENT),
  [EDIT_COLLECTIVE_SECTIONS.VIRTUAL_CARDS]: isType(CollectiveType.ORGANIZATION),
  [EDIT_COLLECTIVE_SECTIONS.WEBHOOKS]: isOneOfTypes(
    CollectiveType.COLLECTIVE,
    CollectiveType.ORGANIZATION,
    CollectiveType.USER,
  ),
  [EDIT_COLLECTIVE_SECTIONS.ADVANCED]: () => true,
  // Fiscal Host
  [EDIT_COLLECTIVE_SECTIONS.FISCAL_HOSTING]: () => false,
  [EDIT_COLLECTIVE_SECTIONS.HOST_PLAN]: () => false,
  [EDIT_COLLECTIVE_SECTIONS.EXPENSES_PAYOUTS]: () => false,
  [EDIT_COLLECTIVE_SECTIONS.INVOICES_RECEIPTS]: () => false,
  [EDIT_COLLECTIVE_SECTIONS.RECEIVING_MONEY]: () => false,
  [EDIT_COLLECTIVE_SECTIONS.SENDING_MONEY]: () => false,
};

const shouldDisplaySection = (collective, section) => {
  return sectionsDisplayConditions[section] ? sectionsDisplayConditions[section](collective) : true;
};

/**
 * Displays the menu for the edit collective page
 */
const EditCollectiveMenu = ({ collective, selectedSection }) => {
  const { formatMessage } = useIntl();
  const allSections = Object.values(EDIT_COLLECTIVE_SECTIONS);
  const displayedSections = allSections.filter(section => shouldDisplaySection(collective, section));
  const getSectionInfo = section => ({
    label: SECTION_LABELS[section] ? formatMessage(SECTION_LABELS[section]) : section,
    isSelected: section === selectedSection,
    section,
  });
  const displayedSectionsInfos = displayedSections.map(getSectionInfo);
  const isEvent = collective.type === CollectiveType.EVENT;

  // eslint-disable-next-line react/prop-types
  const renderMenuItem = ({ section, label, isSelected }) => (
    <MenuItem
      key={section}
      selected={isSelected}
      route={isEvent ? 'editEvent' : 'editCollective'}
      params={
        isEvent
          ? { parentCollectiveSlug: collective.parentCollective.slug, eventSlug: collective.slug, section }
          : { slug: collective.slug, section }
      }
      data-cy={`menu-item-${section}`}
    >
      {label}
    </MenuItem>
  );

  return (
    <Flex width={0.2} flexDirection="column" mr={4} mb={3} flexWrap="wrap" css={{ flexGrow: 1, minWidth: 175 }}>
      {displayedSectionsInfos.map(renderMenuItem)}
      {['USER', 'ORGANIZATION'].includes(collective.type) && (
        <Fragment>
          <MenuDivider />
          {renderMenuItem(getSectionInfo(EDIT_COLLECTIVE_SECTIONS.FISCAL_HOSTING))}
        </Fragment>
      )}
      {collective.isHost && (
        <Fragment>
          {renderMenuItem(getSectionInfo(EDIT_COLLECTIVE_SECTIONS.HOST_PLAN))}
          {renderMenuItem(getSectionInfo(EDIT_COLLECTIVE_SECTIONS.EXPENSES_PAYOUTS))}
          {renderMenuItem(getSectionInfo(EDIT_COLLECTIVE_SECTIONS.INVOICES_RECEIPTS))}
          {renderMenuItem(getSectionInfo(EDIT_COLLECTIVE_SECTIONS.RECEIVING_MONEY))}
          {renderMenuItem(getSectionInfo(EDIT_COLLECTIVE_SECTIONS.SENDING_MONEY))}
        </Fragment>
      )}
    </Flex>
  );
};

EditCollectiveMenu.propTypes = {
  selectedSection: PropTypes.oneOf(Object.values(EDIT_COLLECTIVE_SECTIONS)),
  collective: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.values(CollectiveType)).isRequired,
    isHost: PropTypes.bool,
    parentCollective: PropTypes.shape({
      slug: PropTypes.string,
    }),
  }).isRequired,
};

export default React.memo(EditCollectiveMenu);
