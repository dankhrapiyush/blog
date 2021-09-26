import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { number } from 'prop-types';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { Form, useFormState } from 'informed';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import { useAddComment } from '../../talons/BlogComment/useAddComment';
import { useStyle } from '@magento/venia-ui/lib/classify';
import ADD_COMMENT_MUTATION from './queries/addComment.graphql';
import Button from '@magento/venia-ui/lib/components/Button';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

import defaultClasses from './comment.css';

// to debug form input states
/*
const CommentFormState = () => {
    const formState = useFormState();
    return (
      <pre>
        <code>{JSON.stringify(formState, null, 2)}</code>
      </pre>
    );
  };
*/

const CommentForm = props => {
    const { post_id } = props;
    const { formatMessage } = useIntl();
    const [{ isSignedIn }] = useUserContext();

    const talonProps = useAddComment({
        queries: {
            addCommentQuery: ADD_COMMENT_MUTATION
        },
        initialValues: { post_id },
        onSubmit: props.onSubmit
    });

    const { response, handleSubmit, isDisabled, initialValues } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    // Map over any errors we get and display an appropriate error.
    const errorMessage =
        response.errors && response.errors.length
            ? response.errors
                  .map(({ message }) => message)
                  .reduce((acc, msg) => msg + '\n' + acc, '')
            : null;

    const responseMessage = formatMessage({
        id: 'commentForm.response',
        defaultMessage: 'Thank you for your comment.'
    });
    const successMessage =
        response.data && response.data.addCommentToPost
            ? responseMessage
            : null;

    // hide user fields if user is signed in
    const userFields = !isSignedIn ? (
        <Fragment>
            <div className={classes.author_nickname}>
                <Field id={classes.author_nickname} label="Full Name">
                    <TextInput
                        id={classes.author_nickname}
                        field="author_nickname"
                        validate={isRequired}
                        disabled={isSignedIn}
                    />
                </Field>
            </div>
            <div className={classes.author_email}>
                <Field id={classes.author_email} label="Email">
                    <TextInput
                        id={classes.author_email}
                        field="author_email"
                        validate={isRequired}
                        disabled={isSignedIn}
                    />
                </Field>
            </div>
        </Fragment>
    ) : null;

    const label = formatMessage({
        id: 'commentForm.label',
        defaultMessage: 'Add a comment...'
    });

    return (
        <Form
            initialValues={initialValues}
            onSubmit={handleSubmit}
            className={classes.cForm}
        >
            <div className={classes.success}>{successMessage}</div>
            {userFields}
            <div className={classes.text}>
                <Field id={classes.text} label={label}>
                    <TextInput
                        id={classes.text}
                        field="text"
                        validate={isRequired}
                    />
                </Field>
            </div>
            <div className={classes.error}>{errorMessage}</div>
            <div className={classes.footer}>
                <Button type="submit" priority="high" disabled={isDisabled}>
                    <FormattedMessage
                        id={'commentForm.submit'}
                        defaultMessage={'Submit'}
                    />
                </Button>
            </div>
            {/* <CommentFormState /> */}
        </Form>
    );
};

CommentForm.prototype = {
    post_id: number.isRequired
};

export default CommentForm;
