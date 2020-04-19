import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { background, border, color, layout, position, space, typography, variant } from 'styled-system';

import { textTransform } from '../lib/styled-system-custom-properties';

import { Span } from './Text';

import { Times } from '@styled-icons/fa-solid/Times';

const StyledTagBase = styled.div`
  border-radius: 4px;
  padding: 8px;
  font-size: 8px;
  line-height: 12px;
  background: #F0F2F5;
  color: #71757A;
  text-align: center;

  & > * {
    vertical-align: middle;
  }

  ${background}
  ${border}
  ${color}
  ${space}
  ${border}
  ${typography}
  ${layout}
  ${position}
  ${textTransform}

  ${variant({
    prop: 'type',
    variants: {
      white: {
        backgroundColor: 'white.full',
        borderColor: 'black.200',
      },
      dark: {
        backgroundColor: 'black.800',
        borderColor: 'black.900',
        color: 'white.full',
      },
      info: {
        backgroundColor: 'blue.100',
        borderColor: 'blue.400',
        color: 'blue.600',
      },
      success: {
        backgroundColor: 'green.100',
        borderColor: 'green.500',
        color: 'green.700',
      },
      warning: {
        backgroundColor: 'yellow.200',
        borderColor: 'yellow.500',
        color: 'yellow.800',
      },
      error: {
        backgroundColor: 'red.100',
        borderColor: 'red.500',
        color: 'red.500',
      },
    },
  })}
`;

const CloseButton = styled.button`
  border-radius: 50%;
  background: ${closeButtonProps => closeButtonProps.iconBackgroundColor};
  color: ${closeButtonProps => closeButtonProps.iconColor};
  mix-blend-mode: color-burn;
  cursor: pointer;
  margin: 0px;
  text-align: center;
  line-height: 1;
  padding: 4px;
  width: ${closeButtonProps => closeButtonProps.iconWidth};
  height: ${closeButtonProps => closeButtonProps.iconHeight};
  display: ${closeButtonProps => closeButtonProps.iconDisplay};
  align-items: ${closeButtonProps => closeButtonProps.iconAlign};
  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

/** Simple tag to display a short string */
const StyledTag = ({ closeButtonProps, children, ...props }) => {
  return !closeButtonProps ? (
    <StyledTagBase {...props}>{children}</StyledTagBase>
  ) : (
    <StyledTagBase py={1} {...props}>
      <Span mr={2} letterSpacing="inherit">
        {children}
      </Span>
      <CloseButton {...closeButtonProps}>
        <Times size="1em" />
      </CloseButton>
    </StyledTagBase>
  );
};

StyledTag.propTypes = {
  closeButtonProps: PropTypes.object,
  /** If defined, a close button will be displayed on the tag */
  onClose: PropTypes.func,
  iconWidth: PropTypes.string,
  iconHeight: PropTypes.string,
  backgroundColor: PropTypes.string,
  iconColor: PropTypes.string,
  iconDisplay: PropTypes.string,
  iconAlign: PropTypes.string,
  children: PropTypes.node,
};

StyledTag.defaultProps = {
  textTransform: 'uppercase',
  iconHeight: '2.5em',
  iconWidth: '2.5em',
  iconBackgroundColor: 'rgba(33, 33, 33, 1)',
  iconColor: 'white',
};

export default StyledTag;
