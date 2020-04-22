import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from '../Grid';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { graphql } from '@apollo/react-hoc';
import { get } from 'lodash';
import { withRouter } from 'next/router';

import { H1, P } from '../Text';
import CreateCollectiveForm from './CreateCollectiveForm';
import CollectiveCategoryPicker from './CollectiveCategoryPicker';
import ConnectGithub from './ConnectGithub';
import SignInOrJoinFree from '../SignInOrJoinFree';
import MessageBox from '../MessageBox';
import { withUser } from '../UserProvider';

import { API_V2_CONTEXT, gqlV2 } from '../../lib/graphql/helpers';
import { getErrorFromGraphqlException } from '../../lib/errors';
import { parseToBoolean } from '../../lib/utils';
import { Router } from '../../server/pages';

class CreateCollective extends Component {
  static propTypes = {
    host: PropTypes.object,
    LoggedInUser: PropTypes.object, // from withUser
    refetchLoggedInUser: PropTypes.func.isRequired, // from withUser
    intl: PropTypes.object.isRequired,
    createCollective: PropTypes.func,
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      collective: {},
      result: {},
      github: null,
      form: false,
      error: null,
      status: null,
      creating: false,
    };

    this.createCollective = this.createCollective.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.messages = defineMessages({
      joinOC: {
        id: 'collective.create.join',
        defaultMessage: 'Join Open Collective',
      },
      createOrSignIn: {
        id: 'collective.create.createOrSignIn',
        defaultMessage: 'Create an account (or sign in) to start a collective.',
      },
    });
  }

  handleChange(key, value) {
    this.setState({ [key]: value });
  }

  async createCollective(collective) {
    // check we have agreed to TOS
    if (!collective.tos) {
      this.setState({
        error: 'Please accept the terms of service',
      });
      return;
    }
    if (this.props.host && this.props.host.termsUrl && !collective.hostTos) {
      this.setState({
        error: 'Please accept the terms of fiscal sponsorship',
      });
      return;
    }

    // set state to loading
    this.setState({ creating: true });

    // prepare object

    collective.tags = [this.props.router.query.category];
    if (this.state.github) {
      collective.githubHandle = this.state.github.handle;
    }
    delete collective.tos;
    delete collective.hostTos;

    // try mutation
    try {
      const res = await this.props.createCollective({
        variables: {
          collective,
          host: this.props.host ? { slug: this.props.host.slug } : null,
          automateApprovalWithGithub: this.state.github ? true : false,
        },
      });
      const newCollective = res.data.createCollective;
      this.setState({
        status: 'idle',
        result: { success: 'Collective created successfully' },
      });
      await this.props.refetchLoggedInUser();
      // don't show banner if we show the modal and vice versa
      if (parseToBoolean(process.env.ONBOARDING_MODAL) === true) {
        Router.pushRoute('collective-with-onboarding', {
          slug: newCollective.slug,
          mode: 'onboarding',
          CollectiveId: newCollective.legacyId,
          CollectiveSlug: newCollective.slug,
        }).then(() => window.scrollTo(0, 0));
      } else {
        Router.pushRoute('collective', {
          slug: newCollective.slug,
          status: 'collectiveCreated',
          CollectiveId: newCollective.legacyId,
          CollectiveSlug: newCollective.slug,
        }).then(() => window.scrollTo(0, 0));
      }
    } catch (err) {
      const errorMsg = getErrorFromGraphqlException(err).message;
      this.setState({ status: 'idle', error: errorMsg, creating: false });
    }
  }

  render() {
    const { LoggedInUser, intl, host, router } = this.props;
    const { error } = this.state;
    const { category, step, token } = router.query;

    if (host && !host.isOpenToApplications) {
      return (
        <Flex flexDirection="column" alignItems="center" mb={5} p={2}>
          <Flex flexDirection="column" p={4} mt={3}>
            <Box mb={3}>
              <H1 fontSize="H3" lineHeight="H3" fontWeight="bold" textAlign="center">
                <FormattedMessage id="home.create" defaultMessage="Create a Collective" />
              </H1>
            </Box>
          </Flex>
          <Flex alignItems="center" justifyContent="center">
            <MessageBox type="warning" withIcon mb={[1, 3]}>
              <FormattedMessage
                id="collectives.create.error.HostNotOpenToApplications"
                defaultMessage="This host is not open to applications"
              />
            </MessageBox>
          </Flex>
        </Flex>
      );
    }

    if (!LoggedInUser) {
      return (
        <Flex flexDirection="column" alignItems="center" mb={5} p={2}>
          <Flex flexDirection="column" p={4} mt={2}>
            <Box mb={3}>
              <H1 fontSize="H3" lineHeight="H3" fontWeight="bold" textAlign="center">
                {intl.formatMessage(this.messages.joinOC)}
              </H1>
            </Box>
            <Box textAlign="center">
              <P fontSize="Paragraph" color="black.600" mb={1}>
                {intl.formatMessage(this.messages.createOrSignIn)}
              </P>
            </Box>
          </Flex>
          <SignInOrJoinFree />
        </Flex>
      );
    }

    if (!host && !category) {
      return <CollectiveCategoryPicker onChange={this.handleChange} />;
    }

    if ((category === 'opensource' || get(host, 'slug') === 'opensource') && step !== 'form') {
      return <ConnectGithub token={token} onChange={this.handleChange} />;
    }

    return (
      <CreateCollectiveForm
        host={host}
        collective={this.state.collective}
        github={this.state.github}
        onSubmit={this.createCollective}
        onChange={this.handleChange}
        loading={this.state.creating}
        error={error}
      />
    );
  }
}

const CREATE_COLLECTIVE = gqlV2`
  mutation createCollective(
    $collective: CollectiveCreateInput!
    $host: AccountReferenceInput
    $automateApprovalWithGithub: Boolean
  ) {
    createCollective(collective: $collective, host: $host, automateApprovalWithGithub: $automateApprovalWithGithub) {
      name
      slug
      tags
      description
      githubHandle
      legacyId
    }
  }
`;

const addCreateCollectiveMutation = graphql(CREATE_COLLECTIVE, {
  name: 'createCollective',
  options: { context: API_V2_CONTEXT },
});

export default injectIntl(withRouter(withUser(addCreateCollectiveMutation(CreateCollective))));
