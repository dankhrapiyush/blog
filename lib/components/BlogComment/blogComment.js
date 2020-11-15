import React, { useState, Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { array, shape, string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { useQuery } from '@apollo/client';

import CommentContent from './commentContent';
import CommentForm from './commentForm';
import defaultClasses from './comment.css';

import GET_BLOG_COMMENT from './queries/blogComment.graphql';
import GET_STORE_CONFIG_DATA from './queries/getBlogConfigData.graphql';

const BlogComment = props => {
    const { formatMessage } = useIntl();
    const classes = mergeClasses(defaultClasses, props.classes);

    const { error: err, data: config } = useQuery(GET_STORE_CONFIG_DATA);
    const defaultLimit = !err && config ? config.storeConfig.mfblog_post_view_comments_number_of_comments : 5;

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(defaultLimit);

    // Construct the filter arg object.
    const newFilters = {};
    newFilters['post_id'] = { eq: String(props.post_id) };

    // Fetch the data using apollo react hooks
    const { data, error } = useQuery(GET_BLOG_COMMENT, {
        variables: {
            currentPage: Number(currentPage),
            pageSize: Number(pageSize),
            filter: newFilters
        },
        fetchPolicy: 'cache-and-network'
    });

    // Display an error message.
    if (error) {
        return (
            <div>
                <FormattedMessage
                    id={'blogComment.fetchError'}
                    defaultMessage={'Data Fetch Error'}
                />
            </div>
        );
    }

    const comments = data && data.blogComments ? data.blogComments : null;
    const cnt = comments && comments.total_count ? comments.total_count : 0;

    const title = formatMessage(
        {
            id: 'blogComment.title',
            defaultMessage: 'Comment(s)'
        }
    );

    return (
        <Fragment>
            <div className={classes.cCount}>
                {cnt > 0 && cnt} {title}
            </div>
            <CommentForm
                classes={classes}
                post_id={props.post_id}
            />
            <CommentContent
                classes={classes}
                data={comments}
                loadComments={(limit) => {
                    setPageSize(limit+defaultLimit);
                } }
            />
        </Fragment>
    );
};

export default BlogComment;
