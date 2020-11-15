import React, { Fragment } from 'react';
import { shape, arrayOf, number, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Pagination from '@magento/venia-ui/lib/components/Pagination';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import { Link } from '@magento/venia-drivers';
import path from 'path';

import defaultClasses from './blogs.css';

const BlogsContent = props => {
    const { data, pageControl } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const listItems = data && data.items ? data.items.map(blog => {
        const { post_id: id, identifier, title, content, short_content, publish_time } = blog;
        const linkTo = path.join('blog/post', String(identifier));
        const formattedDate = new Date(publish_time).toLocaleDateString(
            undefined,
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }
        );

        const blogDescription = short_content ? (
            <RichContent html={short_content} />
        ) : <RichContent html={content} />;

        return (
            <li key={id} className={classes.postHolder}>
                <div className={classes.postHeader}>
                    <div className={classes.postTitleHolder}>
                        <h2 className={classes.postTitle}>
                            <Link to={linkTo}>{title}</Link>
                        </h2>
                    </div>
                    <div className={classes.postInfo}>
                        <div className={classes.item}>
                            <span className={classes.label}>
                                <FormattedMessage
                                    id={'blogsContent.posted'}
                                    defaultMessage={'Posted: '}
                                />
                            </span>
                            <span className={classes.value}>{formattedDate}</span>
                        </div>
                    </div>
                </div>
                <div className={classes.postContent}>
                    <div className={classes.postDescription, classes.clearfix}>
                        <div className={classes.clearfix}>
                            {blogDescription}
                        </div>
                        <Link className={classes.postReadMore} to={linkTo}>
                            <FormattedMessage
                                id={'blogsContent.readMore'}
                                defaultMessage={'Read more'}
                            /> &#187;
                        </Link>
                    </div>
                </div>
            </li>
        );
    }) : '';

    const content =
        data && data.total_count === 0 ? (
                <p>
                    <FormattedMessage
                        id={'blogsContent.notFound'}
                        defaultMessage={'Sorry! We couldn\'t find any blogs.'}
                    />
                </p>
            ) : (
                <Fragment>
                    <ul className={classes.postList}>{listItems}</ul>
                    <div className={classes.pagination}>
                        <Pagination pageControl={pageControl} />
                    </div>
                </Fragment>
            );

    return (
        <Fragment>
            {content}
        </Fragment>
    );
};

BlogsContent.prototype = {
    data: shape ({
        items: arrayOf(
            shape({
                id: number.isRequired,
                identifier: string.isRequired,
                title: string.isRequired,
                content: string,
                short_content: string,
                publish_time: string
            })
        )
    }).isRequired
};

export default BlogsContent;
