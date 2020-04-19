import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@rebass/grid';
import { FormattedMessage } from 'react-intl';

import LocationComponent from '../../Location';
import ContainerSectionContent from '../ContainerSectionContent';
import SectionTitle from '../SectionTitle';

const Location = ({ collective: event }) => (
  <Box pt={[4, 5]}>
    <ContainerSectionContent pt={[4, 5]}>
      <SectionTitle textAlign="center">
        <FormattedMessage id="SectionLocation.Title" defaultMessage="Location" />
      </SectionTitle>
      <LocationComponent location={event.location} showTitle={false} />
    </ContainerSectionContent>
  </Box>
);

Location.propTypes = {
  collective: PropTypes.shape({
    location: PropTypes.object,
  }).isRequired,
};

export default Location;
