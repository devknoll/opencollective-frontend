import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from '@apollo/react-hoc';
import { Flex } from '@rebass/grid';
import { defineMessages, injectIntl } from 'react-intl';
import styled from 'styled-components';

import { API_V2_CONTEXT, gqlV2 } from '../../lib/graphql/helpers';

import Hide from '../Hide';
import HorizontalScroller from '../HorizontalScroller';
import Link from '../Link';
import Loading from '../Loading';
import StyledButton from '../StyledButton';

import HostCollectiveCard from './HostCollectiveCard';

const Limit = 12; // nice round number to make even rows of 2, 3, 4

const AllCardsContainer = styled(Flex).attrs({
  flexWrap: 'wrap',
  width: '90%',
  justifyContent: 'space-evenly',
})``;

const AllCardsContainerMobile = styled(Flex)`
  overflow-x: auto;
  scroll-behavior: smooth;
  width: 95vw;
  padding: 16px;
`;

const CollectiveCardContainer = styled.div`
  width: 280px;
  padding: 20px 15px;
`;

class HostsContainer extends React.Component {
  static propTypes = {
    collective: PropTypes.object,
    onChange: PropTypes.func,
    data: PropTypes.object.isRequired,
    viewport: PropTypes.string,
    tags: PropTypes.string,
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.messages = defineMessages({
      seeMoreHosts: {
        id: 'fiscalHost.seeMoreHosts',
        defaultMessage: 'See more hosts',
      },
    });
  }

  render() {
    const { onChange, data, intl } = this.props;

    if (!data.hosts || !data.hosts.nodes) {
      return <Loading />;
    }

    const hosts = [...data.hosts.nodes];

    return (
      <Flex flexDirection="column">
        <Hide md lg>
          <HorizontalScroller>
            {ref => (
              <AllCardsContainerMobile ref={ref}>
                {hosts.map(host => (
                  <HostCollectiveCard
                    key={host.legacyId}
                    host={host}
                    collective={this.props.collective}
                    onChange={onChange}
                    style={{
                      flexBasis: 250,
                      height: 360,
                      marginRight: 20,
                      flexShrink: 0,
                    }}
                  />
                ))}
              </AllCardsContainerMobile>
            )}
          </HorizontalScroller>
        </Hide>
        <Hide xs sm>
          <AllCardsContainer>
            {hosts.map(host => (
              <CollectiveCardContainer key={`${host.legacyId}-container`}>
                <HostCollectiveCard
                  key={host.legacyId}
                  host={host}
                  collective={this.props.collective}
                  onChange={onChange}
                />
              </CollectiveCardContainer>
            ))}
          </AllCardsContainer>
        </Hide>
        <Flex justifyContent="center" mt={[2, 0]} width={['100%', null, '90%']}>
          <Link route="hosts">
            <StyledButton fontSize="13px" buttonStyle="dark" minHeight="36px" mt={[2, 3]} mb={3} px={4}>
              {intl.formatMessage(this.messages.seeMoreHosts)}
            </StyledButton>
          </Link>
        </Flex>
      </Flex>
    );
  }
}

const getHostsQuery = gqlV2`
query getHosts($tags: [String], $limit: Int) {
  hosts(tags: $tags, limit: $limit) {
    totalCount
    nodes {
      id
      legacyId
      createdAt
      settings
      type
      name
      slug
      description
      currency
      totalHostedCollectives
      hostFeePercent
      stats {
        yearlyBudget {
          value
        }
      }
    }
  }
}
`;

export const addHostsData = graphql(getHostsQuery, {
  options(props) {
    return {
      variables: {
        tags: props.tags,
        limit: Limit,
      },
      context: API_V2_CONTEXT,
    };
  },
});

export default injectIntl(addHostsData(HostsContainer));
