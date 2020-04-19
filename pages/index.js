import React from 'react';
import dynamic from 'next/dynamic';
import { defineMessages, useIntl } from 'react-intl';

import FeaturesSection from '../components/home/sections/Features';
import FiscalHostSection from '../components/home/sections/FiscalHost';
import JoinUsSection from '../components/home/sections/JoinUs';
import LearnMoreSection from '../components/home/sections/LearnMore';
import MakeCommunitySection from '../components/home/sections/MakeCommunity';
import OCUsersSection from '../components/home/sections/OCUsers';
import WeAreOpenSection from '../components/home/sections/WeAreOpen';
import WhatCanYouDoSection from '../components/home/sections/WhatCanYouDo';
import Page from '../components/Page';

const CovidBanner = dynamic(() => import(/* webpackChunkName: 'CovidBanner' */ '../components/banners/CovidBanner'), {
  ssr: false,
});

const menuItems = { pricing: true, howItWorks: true };

const messages = defineMessages({
  defaultTitle: {
    id: 'OC.tagline',
    defaultMessage: 'Make your community sustainable. Collect and spend money transparently.',
  },
});

const HomePage = () => {
  const { formatMessage } = useIntl();
  return (
    <Page menuItems={menuItems} description={formatMessage(messages.defaultTitle)}>
      <MakeCommunitySection />
      <WhatCanYouDoSection />
      <FeaturesSection />
      <OCUsersSection />
      <FiscalHostSection />
      <WeAreOpenSection />
      <LearnMoreSection />
      <JoinUsSection />
      <CovidBanner showLink />
    </Page>
  );
};

export default HomePage;
