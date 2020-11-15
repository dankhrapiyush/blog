import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { shape, number, string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Title } from '@magento/venia-ui/lib/components/Head';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

import blogsClasses from '../Blogs/blogs.css';
import defaultClasses from './blog.css';

const BlogContent = props => {
    const { post_id, title, content, author, publish_time } = props.data;
    const classes = mergeClasses(blogsClasses, defaultClasses, props.classes);
    const formattedDate = new Date(publish_time).toLocaleDateString(
        undefined,
        {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }
    );

    const blogDescription = content ? (
        <RichContent html={content} />
    ) : null;

    return (
        <Fragment>
            <Title>{title}</Title>
            <h1 className={classes.title}>
                <div className={classes.blogTitle}>{title}</div>
            </h1>
            <div className={classes.postHolder}>
                <div className={classes.postHeader}>
                    <div className={classes.postInfo}>
                        <div className={classes.postPostedDate, classes.item}>
                            <span className={classes.label}>
                                <FormattedMessage
                                    id={'blogContent.posted'}
                                    defaultMessage={'Posted: '}
                                />
                            </span>
                            <span className={classes.value}>{formattedDate}</span>
                        </div>
                        <div className={classes.postAuthor, classes.item}>
                            <span className={classes.label}>
                                <FormattedMessage
                                    id={'blogContent.author'}
                                    defaultMessage={'Author: '}
                                />
                                </span>
                            <span className={classes.value}>{author.name}</span>
                        </div>
                    </div>
                </div>
                <div className={classes.postContent}>
                    <div className={classes.postDescription}>
                        <div className={classes.postTextHld}>
                            {blogDescription}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

BlogContent.prototype = {
    data: shape({
        post_id: number.isRequired,
        title: string,
        content: string,
        author: string,
        publish_time: string
    }).isRequired
};

export default BlogContent;
