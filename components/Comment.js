import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { pick } from 'lodash';
import { defineMessages, FormattedDate, FormattedMessage, injectIntl } from 'react-intl';

import Avatar from './Avatar';
import ConfirmationModal from './ConfirmationModal';
import HTMLContent from './HTMLContent';
import Link from './Link';
import RichTextEditor from './RichTextEditor';
import SmallButton from './SmallButton';

class Comment extends React.Component {
  static propTypes = {
    collective: PropTypes.object,
    comment: PropTypes.object,
    LoggedInUser: PropTypes.object,
    editComment: PropTypes.func,
    intl: PropTypes.object.isRequired,
    editable: PropTypes.bool,
    deleteComment: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      modified: false,
      comment: props.comment,
      mode: undefined,
      showDeleteModal: false,
    };

    this.save = this.save.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.messages = defineMessages({
      edit: { id: 'Edit', defaultMessage: 'Edit' },
      cancelEdit: { id: 'CancelEdit', defaultMessage: 'Cancel edit' },
      delete: { id: 'actions.delete', defaultMessage: 'Delete' },
      'delete.modal.cancel': { id: 'actions.cancel', defaultMessage: 'Cancel' },
      'delete.modal.header': {
        id: 'delete.modal.header',
        defaultMessage: 'Delete comment',
      },
      'delete.modal.body': {
        id: 'delete.modal.body',
        defaultMessage: 'Are you sure you want to delete this comment?',
      },
    });
    this.currencyStyle = {
      style: 'currency',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
  }

  cancelEdit() {
    this.setState({ modified: false, mode: 'details' });
  }

  edit() {
    this.setState({ modified: false, mode: 'edit' });
  }

  toggleEdit() {
    this.state.mode === 'edit' ? this.cancelEdit() : this.edit();
  }

  handleDelete = async () => {
    try {
      await this.props.deleteComment(this.state.comment.id);
      this.setState({ showDeleteModal: false });
    } catch (err) {
      // TODO: this should be reported to the user
      console.error(err);
      this.setState({ showDeleteModal: false });
    }
  };

  handleChange(attr, value) {
    this.setState({
      modified: true,
      comment: {
        ...this.state.comment,
        [attr]: value,
      },
    });
    window.state = {
      modified: true,
      comment: { ...this.state.comment, [attr]: value },
    };
  }

  async save() {
    const comment = pick(this.state.comment, ['id', 'html']);
    await this.props.editComment(comment);
    this.setState({ modified: false, mode: 'details' });
  }

  render() {
    const { intl, LoggedInUser, editable } = this.props;
    const { comment } = this.state;
    if (!comment) {
      return <div />;
    }

    return (
      <div className={`comment ${this.state.mode}View`}>
        <style jsx>
          {`
            .comment {
              width: 100%;
              margin: 0.5em 0;
              padding: 0.5em;
              transition: max-height 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
              overflow: hidden;
              position: relative;
              display: flex;
            }
            a {
              cursor: pointer;
            }
            .fromCollective {
              float: left;
              margin-right: 1rem;
            }
            .body {
              overflow: hidden;
              font-size: 1.5rem;
              width: 100%;
            }
            .description {
              text-overflow: ellipsis;
              overflow: hidden;
              display: block;
            }
            .meta {
              color: #919599;
              font-size: 1.2rem;
            }
            .meta .metaItem {
              margin: 0 0.2rem;
            }
            .meta .collective {
              margin-right: 0.2rem;
            }

            .actions > div {
              display: flex;
              margin: 0.5rem 0;
            }

            .actions .leftColumn {
              width: 72px;
              margin-right: 1rem;
              float: left;
            }

            .commentActions :global(> div) {
              margin-right: 0.5rem;
            }
          `}
        </style>
        <style jsx global>
          {`
            .comment .actions > div > div {
              margin-right: 0.5rem;
            }
            .comment p {
              margin: 0rem;
            }
          `}
        </style>
        <div className="fromCollective">
          <Link
            route="collective"
            params={{ slug: comment.fromCollective.slug }}
            title={comment.fromCollective.name}
            passHref
          >
            <Avatar collective={comment.fromCollective} key={comment.fromCollective.id} radius={40} />
          </Link>
        </div>
        <div className="body">
          <div className="header">
            <div className="meta">
              <span className="createdAt">
                <FormattedDate value={comment.createdAt} day="numeric" month="numeric" />
              </span>{' '}
              |&nbsp;
              <span className="metaItem">
                <Link route={`/${comment.fromCollective.slug}`}>{comment.fromCollective.name}</Link>
              </span>
              {editable && LoggedInUser && LoggedInUser.canEditComment(comment) && (
                <Fragment>
                  <span>
                    {' '}
                    |{' '}
                    <a className="toggleEditComment" onClick={this.toggleEdit} data-cy="ToggleEditComment">
                      {intl.formatMessage(this.messages[`${this.state.mode === 'edit' ? 'cancelEdit' : 'edit'}`])}
                    </a>
                  </span>
                  <span>
                    {' '}
                    |{' '}
                    <a
                      className="toggleEditComment"
                      onClick={() => this.setState({ showDeleteModal: true })}
                      data-cy="ToggleDeleteComment"
                    >
                      {intl.formatMessage(this.messages['delete'])}
                    </a>
                  </span>
                </Fragment>
              )}
            </div>
            <div className="description" data-cy="comment-body">
              {this.state.mode !== 'edit' && <HTMLContent content={comment.html} fontSize="13px" />}
              {this.state.mode === 'edit' && (
                <RichTextEditor
                  name={`comment-${comment.id}`}
                  defaultValue={comment.html}
                  onChange={e => this.handleChange('html', e.target.value)}
                  fontSize="13px"
                />
              )}
            </div>
          </div>

          {editable && (
            <div className="actions">
              {this.state.mode === 'edit' && (
                <div>
                  <SmallButton
                    className="primary save"
                    onClick={this.save}
                    disabled={!this.state.modified}
                    data-cy="SaveEditionCommentButton"
                  >
                    <FormattedMessage id="save" defaultMessage="Save" />
                  </SmallButton>
                </div>
              )}
            </div>
          )}
        </div>
        {this.state.showDeleteModal && (
          <ConfirmationModal
            show={this.state.showDeleteModal}
            onClose={() => this.setState({ showDeleteModal: false })}
            cancelLabel={intl.formatMessage(this.messages['delete.modal.cancel'])}
            header={intl.formatMessage(this.messages['delete.modal.header'])}
            body={intl.formatMessage(this.messages['delete.modal.body'])}
            cancelHandler={() => this.setState({ showDeleteModal: false })}
            continueLabel={intl.formatMessage(this.messages['delete'])}
            continueHandler={this.handleDelete}
          />
        )}
      </div>
    );
  }
}

export default injectIntl(Comment);
