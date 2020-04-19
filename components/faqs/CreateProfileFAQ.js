import React from 'react';
import { FormattedMessage } from 'react-intl';

import FAQ, { Content, Entry, Title } from './FAQ';

/**
 * FAQ associated to the `CreateProfile` component. Explains differences between
 * account types (perso. vs org.) as well as incognito contributions.
 */
const CreateProfileFAQ = props => (
  <FAQ {...props}>
    <Entry>
      <Title>
        <FormattedMessage
          id="createProfile.faq.persoVSOrg.title"
          defaultMessage="What's the difference between a personal and an organization profile?"
        />
      </Title>
      <Content>
        <FormattedMessage
          id="createProfile.faq.persoVsOrg.content"
          defaultMessage="Create an organization profile if you want to make a financial contribution in the name of your company or organization. An organization profile allows you to enable other members of your organization to make financial contributions within certain limits that you can define. Organizations can also issue gift cards."
        />
      </Content>
    </Entry>

    <Entry>
      <Title>
        <FormattedMessage id="createProfile.faq.email.title" defaultMessage="With whom my email will be shared?" />
      </Title>
      <Content>
        <FormattedMessage
          id="createProfile.faq.email.content"
          defaultMessage="For legal reasons, your email is shared with the administrators of the collective and of its fiscal host. We don't share it with any other partner. We don't use it for any type of marketing. We hate spam as much as you do."
        />
      </Content>
    </Entry>

    <Entry>
      <Title>
        <FormattedMessage id="createProfile.faq.privacy.title" defaultMessage="What about privacy?" />
      </Title>
      <Content>
        <FormattedMessage
          id="createProfile.faq.privacy.content"
          defaultMessage="We care about privacy. We don't use cookies. No Google Analytics. No tracking. Then why are we asking you for your personal information? Because for legal reasons the host of the collective needs to know who is giving them money (KYC as in Know Your Customer). However, we give you full control on how your information is being shown publicly (yes you can make incognito contributions, see below)."
        />
      </Content>
    </Entry>

    <Entry>
      <Title>
        <FormattedMessage
          id="createProfile.faq.anonymous.title"
          defaultMessage="Can I make an anonymous contribution?"
        />
      </Title>
      <Content>
        <FormattedMessage
          id="createProfile.faq.anonymous.content"
          defaultMessage="Yes you can! However, in the effort of being transparent and compliant with KYC regulations (Know Your Customer), anonymous contributions still require you to create an Open Collective account with a valid email address. You will have the opportunity to make a donation anonymously after being logged in to make sure that your identity won't be shown publicly on the page of the collective."
        />
      </Content>
    </Entry>
  </FAQ>
);

export default CreateProfileFAQ;
