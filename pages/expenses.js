import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import hasFeature, { FEATURES } from '../lib/allowed-features';
import { generateNotFoundError } from '../lib/errors';
import { addCollectiveCoverData } from '../lib/graphql/queries';

import Body from '../components/Body';
import CollectiveNavbar from '../components/CollectiveNavbar';
import ErrorPage from '../components/ErrorPage';
import ExpensesStatsWithData from '../components/expenses/ExpensesStatsWithData';
import ExpensesWithData from '../components/expenses/ExpensesWithData';
import Footer from '../components/Footer';
import Header from '../components/Header';
import PageFeatureNotSupported from '../components/PageFeatureNotSupported';
import SectionTitle from '../components/SectionTitle';
import { withUser } from '../components/UserProvider';

class ExpensesPage extends React.Component {
  static getInitialProps({ query: { collectiveSlug, filter, value } }) {
    return { slug: collectiveSlug, filter, value };
  }

  static propTypes = {
    slug: PropTypes.string, // for addCollectiveCoverData
    filter: PropTypes.string,
    value: PropTypes.string,
    data: PropTypes.object.isRequired, // from withData
    LoggedInUser: PropTypes.object,
  };

  render() {
    const { data, slug } = this.props;
    const { LoggedInUser } = this.props;

    if (!data || data.error || data.loading) {
      return <ErrorPage data={data} />;
    } else if (!data.Collective) {
      return <ErrorPage error={generateNotFoundError(slug, true)} log={false} />;
    } else if (!hasFeature(data.Collective, FEATURES.RECEIVE_EXPENSES)) {
      return <PageFeatureNotSupported />;
    }

    const collective = data.Collective;
    const canEdit = LoggedInUser && LoggedInUser.canEditCollective(collective);

    let action, subtitle, filter;
    if (this.props.value) {
      action = {
        label: <FormattedMessage id="expenses.viewAll" defaultMessage="View All Expenses" />,
        href: `/${collective.slug}/expenses`,
      };

      if (this.props.filter === 'categories') {
        const category = decodeURIComponent(this.props.value);
        filter = { category };
        subtitle = (
          <FormattedMessage id="expenses.byCategory" defaultMessage="Expenses in {category}" values={{ category }} />
        );
      }
      if (this.props.filter === 'recipients') {
        const recipient = decodeURIComponent(this.props.value);
        filter = { fromCollectiveSlug: recipient };
        subtitle = (
          <FormattedMessage id="expenses.byRecipient" defaultMessage="Expenses by {recipient}" values={{ recipient }} />
        );
      }
    }

    return (
      <div className="ExpensesPage">
        <style jsx>
          {`
            .columns {
              display: flex;
            }

            .col.side {
              width: 100%;
              min-width: 20rem;
              max-width: 25%;
              margin-left: 5rem;
            }

            .col.large {
              width: 100%;
              min-width: 30rem;
              max-width: 75%;
            }

            @media (max-width: 600px) {
              .columns {
                flex-direction: column-reverse;
              }
              .columns .col {
                max-width: 100%;
              }
            }
          `}
        </style>

        <Header collective={collective} LoggedInUser={LoggedInUser} />

        <Body>
          <CollectiveNavbar
            collective={collective}
            isAdmin={canEdit}
            showEdit
            callsToAction={{ hasContact: collective.canContact, hasSubmitExpense: !collective.isArchived }}
          />

          <div className="content">
            <SectionTitle section="expenses" subtitle={subtitle} action={action} />

            <div className=" columns">
              <div className="col large">
                <ExpensesWithData
                  collective={collective}
                  host={collective.host}
                  LoggedInUser={LoggedInUser}
                  filters={filter}
                />
              </div>

              <div className="col side">
                <ExpensesStatsWithData slug={collective.slug} />
              </div>
            </div>
          </div>
        </Body>

        <Footer />
      </div>
    );
  }
}

export default withUser(
  addCollectiveCoverData(ExpensesPage, {
    options: props => ({
      variables: { slug: props.slug, throwIfMissing: false },
    }),
  }),
);
