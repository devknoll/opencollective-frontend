import React from 'react';
import { Box, Flex } from '@rebass/grid';
import { FormattedMessage } from 'react-intl';

import Container from '../Container';
import StyledButton from '../StyledButton';
import StyledInput from '../StyledInput';
import { Span } from '../Text';

import { Envelope } from '@styled-icons/fa-solid/Envelope';

class Newsletter extends React.Component {
  render() {
    return (
      <Container>
        <Flex>
          <Box
            as="form"
            action="https://opencollective.us12.list-manage.com/subscribe/post?u=88fc8f0f3b646152f1cfe447a&amp;id=475db6d2d7"
            method="post"
            name="mc-embedded-subscribe-form"
            target="_blank"
          >
            <Container
              borderRadius={10}
              bg="white.full"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              overflow="hidden"
              width={[1, null, '400px']}
              pl={3}
            >
              <Span color="#5F617D">
                <Envelope size="16" />
              </Span>
              <StyledInput
                bare
                fontSize="Paragraph"
                name="EMAIL"
                px={3}
                py={2}
                minWidth={[121, null, 230]}
                placeholder="Enter your email address"
                type="email"
                width={1}
                color="black.800"
              />
              <StyledButton
                py="10px"
                px="14px"
                fontSize="13px"
                lineHeight="16px"
                name="subscribe"
                type="submit"
                borderRadius="0"
                border="none"
                borderLeft="1px solid"
                borderColor="black.700"
                outline="none"
              >
                <FormattedMessage id="newsletter.subscribe" defaultMessage="Subscribe" />
              </StyledButton>
            </Container>
          </Box>
        </Flex>
      </Container>
    );
  }
}

export default Newsletter;
