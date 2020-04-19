import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@rebass/grid';
import { get, truncate } from 'lodash';
import { FormattedMessage } from 'react-intl';
import Markdown from 'react-markdown';

import HTMLContent from './HTMLContent';
import StyledCard from './StyledCard';
import StyledLink from './StyledLink';
import { Span } from './Text';

const TruncatedLength = 400;

const EventDetails = ({ event, tier }) => {
  const [isExpended, setExpended] = useState(false);
  const description = event.longDescription || event.description;
  const truncatedDescription =
    isExpended || !description ? description : truncate(description, { length: TruncatedLength });

  return !tier.maxQuantity && !description ? null : (
    <StyledCard p={3}>
      {tier.maxQuantity > 0 && (
        <Box mb={2}>
          <Span color="yellow.700">
            <FormattedMessage
              id="tier.limited"
              defaultMessage="LIMITED: {availableQuantity} LEFT OUT OF {maxQuantity}"
              values={{
                maxQuantity: tier.maxQuantity,
                availableQuantity: get(tier, 'stats.availableQuantity', tier.maxQuantity),
              }}
            />
          </Span>
        </Box>
      )}
      {description && (
        <Box>
          {/* Fallback for handling both markdown and html descriptions */}
          {description[0] !== '<' ? (
            <HTMLContent>
              <Markdown source={truncatedDescription} />
            </HTMLContent>
          ) : event.longDescription ? (
            <HTMLContent content={truncatedDescription} />
          ) : (
            <HTMLContent>{truncatedDescription}</HTMLContent>
          )}
          {(isExpended || truncatedDescription.length !== description.length) &&
            (isExpended ? (
              <StyledLink onClick={() => setExpended(false)}>
                <FormattedMessage id="EventDetails.showLess" defaultMessage="Show less" />
              </StyledLink>
            ) : (
              <StyledLink onClick={() => setExpended(true)}>
                <FormattedMessage id="EventDetails.showMore" defaultMessage="Show more" />
              </StyledLink>
            ))}
        </Box>
      )}
    </StyledCard>
  );
};

EventDetails.propTypes = {
  event: PropTypes.shape({
    description: PropTypes.string,
    longDescription: PropTypes.string,
  }).isRequired,
  tier: PropTypes.shape({
    maxQuantity: PropTypes.number,
    stats: PropTypes.shape({
      availableQuantity: PropTypes.number,
    }),
  }).isRequired,
};

export default EventDetails;
