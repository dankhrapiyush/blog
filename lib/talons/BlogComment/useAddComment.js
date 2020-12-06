import { useCallback, useMemo, useState, useEffect } from 'react';
import { useApolloClient, useMutation } from '@apollo/client';
import { useUserContext } from '@magento/peregrine/lib/context/user';

export const useAddComment = props => {
    const {
        queries: { addCommentQuery },
        initialValues = {},
        onSubmit
    } = props;
    const { post_id } = initialValues;

    const apolloClient = useApolloClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [
        { isGettingDetails, isSignedIn, currentUser },
        { getUserDetails }
    ] = useUserContext();
    const { email: author_email, firstname, lastname } = currentUser;
    const author_nickname = [firstname, lastname].join(' ');

    // For add a comment, we don't want to cache any
    // So we set fetchPolicy to 'no-cache'.
    const [addComment, { data, error: addCommentError }] = useMutation(
        addCommentQuery,
        {
            fetchPolicy: 'no-cache'
        }
    );

    const response = { errors: [], data: '' };
    if (addCommentError) {
        response.errors.push(addCommentError.graphQLErrors[0]);
    } else {
        response.data = data;
    }

    const handleSubmit = useCallback(
        async (formValues) => {
            setIsSubmitting(true);
            try {
                // Try to add a comment with the mutation.
                await addComment({
                    variables: {
                        post_id: Number(post_id),
                        author_email: isSignedIn
                            ? author_email
                            : formValues.author_email,
                        author_nickname: isSignedIn
                            ? author_nickname
                            : formValues.author_nickname,
                        text: formValues.text,
                        parent_id: 0
                    }
                });

                // Finally, invoke the post-submission callback.
                if (onSubmit) {
                    onSubmit();
                }
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.error(error);
                }
                setIsSubmitting(false);
            }
        },
        [
            apolloClient,
            addComment,
            getUserDetails,
            isSignedIn,
            author_email,
            author_nickname,
            onSubmit
        ]
    );

    const sanitizedInitialValues = useMemo(() => {
        const { post_id, ...rest } = initialValues;

        return {
            post_id,
            ...rest
        };
    }, [initialValues]);

    return {
        response,
        handleSubmit,
        isDisabled: isSubmitting || isGettingDetails,
        initialValues: sanitizedInitialValues
    };
};
