import React from 'react';
import { FormattedMessage } from 'react-intl';

import ExternalLink from '../ExternalLink';
import Link from '../Link';

import FAQ, { Content, Entry, Title } from './FAQ';

/**
 * FAQ associated to the `GithubRepositories` component.
 */
const GithubRepositoriesFAQ = props => (
  <FAQ {...props}>
    <Entry>
      <Title>
        <FormattedMessage
          id="GithubRepositories.faq.host.title"
          defaultMessage="Where is my collective going to be hosted (fiscal sponsored)?"
        />
      </Title>
      <Content>
        <FormattedMessage
          id="GithubRepositories.faq.host.content"
          defaultMessage="We have created a non profit, the Open Source Collective 501c6 in the United States to act as a fiscal sponsor to host all open source projects. This makes it easy for companies to donate to your project since they can receive one consolidated invoice."
        />
      </Content>
    </Entry>
    <Entry>
      <Title>
        <FormattedMessage id="GithubRepositories.faq.cost.title" defaultMessage="What is the cost?" />
      </Title>
      <Content>
        <FormattedMessage
          id="GithubRepositories.faq.cost.content"
          defaultMessage="The Open Source Collective 501c6 is taking 5% of all donation received (on top of the 5% for the Open Collective platform). This is to cover the administrative overhead, accounting, legal. That way you never have to worry about all that boring stuff and you can focus on your project."
        />
      </Content>
    </Entry>
    <Entry>
      <Title>
        <FormattedMessage
          id="GithubRepositories.faq.repoStar.title"
          defaultMessage="Why only repos with at least 100 stars?"
        />
      </Title>
      <Content>
        <FormattedMessage
          id="GithubRepositories.faq.repoStar.content"
          defaultMessage="In order to provide fiscal sponsorship to a project, we need to ensure that there is a community around it. If you don’t fit 100 GitHub stars requirement, we will consider your application on a case by case basis, <criteria-link>using this criteria.</criteria-link> If you already have a legal entity (or know a legal entity that could host your collective), then you could directly host your collective independently. Please use the <for-any-community>For any Community</for-any-community> option when creating a collective. Note that in that case you will be responsible for doing the accounting as well as facilitating payments from sponsors. If you have a project with an existing community but don't use GitHub, apply via the <open-source>Open Source</open-source> option and select 'Request manual verification'."
          values={{
            'criteria-link': function CriteriaLink(msg) {
              return (
                <ExternalLink href="https://www.oscollective.org#criteria" openInNewTab>
                  {msg}
                </ExternalLink>
              );
            },
            'for-any-community': function CommunityLink(msg) {
              return (
                <Link route="create-collective" params={{ category: 'community', verb: 'create' }}>
                  {msg}
                </Link>
              );
            },
            'open-source': function OpenSourceLink(msg) {
              return (
                <Link route="create-collective" params={{ category: 'opensource', verb: 'create' }}>
                  {msg}
                </Link>
              );
            },
          }}
        />
      </Content>
    </Entry>
  </FAQ>
);

export default GithubRepositoriesFAQ;
