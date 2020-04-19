import React from 'react';
import PropTypes from 'prop-types';

import { addCollectiveData } from '../lib/graphql/queries';

import CreateEvent from '../components/CreateEvent';
import ErrorPage from '../components/ErrorPage';
import { withUser } from '../components/UserProvider';

class CreateEventPage extends React.Component {
  static getInitialProps({ query: { parentCollectiveSlug } }) {
    const scripts = { googleMaps: true }; // Used in <InputTypeLocation>

    return { slug: parentCollectiveSlug, scripts };
  }

  static propTypes = {
    slug: PropTypes.string, // for addCollectiveData
    data: PropTypes.object.isRequired, // from withData
    LoggedInUser: PropTypes.object,
    loadingLoggedInUser: PropTypes.bool,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { data, LoggedInUser, loadingLoggedInUser } = this.props;

    if (loadingLoggedInUser || !data.Collective) {
      return <ErrorPage loading={loadingLoggedInUser} data={data} />;
    }

    return <CreateEvent parentCollective={data.Collective} LoggedInUser={LoggedInUser} />;
  }
}

export default withUser(addCollectiveData(CreateEventPage));
