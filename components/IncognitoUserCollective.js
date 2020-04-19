import React from 'react';
import PropTypes from 'prop-types';
import { Flex } from '@rebass/grid';
import classNames from 'classnames';
import { defineMessages, injectIntl } from 'react-intl';

import { IncognitoAvatar } from './Avatar';
import Body from './Body';
import Footer from './Footer';
import Header from './Header';

class IncognitoUserCollective extends React.Component {
  static propTypes = {
    collective: PropTypes.object,
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.classNames = ['UserCollectivePage'];
    this.messages = defineMessages({
      'incognito.title': { id: 'UserCollective.incognito.title', defaultMessage: 'Incognito user' },
      'incognito.description': {
        id: 'UserCollective.incognito.description',
        defaultMessage: 'This user decided to remain incognito',
      },
    });
  }

  render() {
    const { intl, collective } = this.props;

    return (
      <div className={classNames('UserCollectivePage')}>
        <style jsx>
          {`
            h1 {
              font-size: 2rem;
            }
          `}
        </style>

        <Header
          title={intl.formatMessage(this.messages['incognito.title'])}
          description={intl.formatMessage(this.messages['incognito.description'])}
          collective={{ collective }}
        />

        <Body>
          <Flex justifyContent="center" alignItems="center" flexDirection="column" my={4}>
            <IncognitoAvatar />
            <h1>{intl.formatMessage(this.messages['incognito.title'])}</h1>
            <p>{intl.formatMessage(this.messages['incognito.description'])}</p>
            <p>¯\_(ツ)_/¯</p>
          </Flex>
        </Body>
        <Footer />
      </div>
    );
  }
}

export default injectIntl(IncognitoUserCollective);
