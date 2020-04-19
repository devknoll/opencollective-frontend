import React from 'react';
import { Flex } from '@rebass/grid';

import LoadingGrid from '../components/LoadingGrid';

const Loading = props => {
  return (
    <div className="Loading">
      <Flex justifyContent={['center', 'center', 'flex-start']} flexWrap="wrap" {...props}>
        <Flex py={3} width={1} justifyContent="center">
          <LoadingGrid />
        </Flex>
      </Flex>
    </div>
  );
};

export default Loading;
