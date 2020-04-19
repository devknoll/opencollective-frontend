import React from 'react';
import PropTypes from 'prop-types';
import { Question } from '@styled-icons/fa-solid/Question';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import ApplyToHostBtnLoggedIn from './ApplyToHostBtnLoggedIn';
import Link from './Link';
import StyledButton from './StyledButton';
import StyledTooltip from './StyledTooltip';
import { withUser } from './UserProvider';

const IconQuestion = styled(Question).attrs({ size: 18 })`
  padding: 0.2em;
  vertical-align: middle;
  border: 1px solid;
  border-radius: 1em;
  border-color: #55a4fb;
  color: white;
`;

class ApplyToHostBtn extends React.Component {
  static propTypes = {
    host: PropTypes.shape({
      slug: PropTypes.string,
      hostFeePercent: PropTypes.number,
      settings: PropTypes.shape({
        tos: PropTypes.string,
      }),
    }).isRequired,
    LoggedInUser: PropTypes.object,
    showConditions: PropTypes.bool,
    buttonStyle: PropTypes.string,
    buttonSize: PropTypes.string,
    minWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    showConditions: true,
    buttonStyle: 'secondary',
    buttonSize: 'small',
  };

  render() {
    const { LoggedInUser, host, showConditions, buttonStyle, buttonSize, minWidth, disabled } = this.props;

    return (
      <div className="ApplyToHostBtn">
        <style jsx>
          {`
            .hostConditions {
              margin: 5px;
              font-size: 11pt;
            }
          `}
        </style>
        {!LoggedInUser && (
          <Link route={`/${host.slug}/apply`}>
            <StyledButton
              buttonStyle={buttonStyle}
              buttonSize={buttonSize}
              disabled={disabled}
              minWidth={minWidth}
              data-cy="host-apply-btn-logged-out"
            >
              <FormattedMessage id="host.apply.create.btn" defaultMessage="Apply" />
            </StyledButton>
          </Link>
        )}
        {LoggedInUser && (
          <ApplyToHostBtnLoggedIn
            LoggedInUser={LoggedInUser}
            host={host}
            disabled={disabled}
            buttonStyle={buttonStyle}
            buttonSize={buttonSize}
            minWidth={minWidth}
          />
        )}
        {showConditions && (
          <div className="hostConditions">
            <FormattedMessage
              id="transaction.hostFeeInHostCurrency"
              defaultMessage="{percentage} host fee"
              values={{ percentage: `${host.hostFeePercent || 0}%` }}
            />
            &nbsp;
            <StyledTooltip
              type="light"
              content={
                <FormattedMessage
                  id="host.hostFee.help"
                  defaultMessage="The host fee is the fee that the host charges your collective to take care of paying out the expenses that have been approved and to take care of recording all transactions in their books to comply with local fiscal authorities."
                />
              }
            >
              <IconQuestion />
            </StyledTooltip>
            {get(host, 'settings.tos') && (
              <span>
                &nbsp; - &nbsp;
                <a href={host.settings.tos}>
                  <FormattedMessage id="host.tos" defaultMessage="Terms of fiscal sponsorship" />
                </a>
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default withUser(ApplyToHostBtn);
