import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import {shape, number, string, arrayOf} from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import { Link, resourceUrl } from '@magento/venia-drivers';
import { intersperse } from '../../util/intersperse';
import { formatDate } from '../../util/formatDate';

import blogsClasses from '../Blogs/blogs.css';
import defaultClasses from './blog.css';

const BlogContent = props => {
    const {
        post_id,
        title,
        content,
        publish_time,
        author,
        categories,
        tags
    } = props.data;
    const classes = mergeClasses(blogsClasses, defaultClasses, props.classes);

    const categoryList = categories.map((category) => {
            const categoryLink = resourceUrl(`/blog/category/${category.identifier}`);
            return category.is_active === 1 &&
                <Link to={categoryLink} key={category.category_id}>{category.title}</Link>
        }
    );

    const tagList = tags.map((tag) => {
            const tagLink = resourceUrl(`/blog/tag/${tag.identifier}`);
            return tag.is_active === 1 &&
                <Link to={tagLink} key={tag.tag_id}>{tag.title}</Link>
        }
    );

    const blogDescription = content ? <RichContent html={content} /> : null;

    return (
        <Fragment>
            <h1 className={classes.title}>
                <div className={classes.blogTitle}>{title}</div>
            </h1>
            <div className={classes.postHolder}>
                <div className={classes.postHeader}>
                    <div className={classes.postInfo}>
                        <div className={classes.item}>
                            <span className={classes.label}>
                                <FormattedMessage
                                    id={'blogContent.posted'}
                                    defaultMessage={'Posted: '}
                                />
                            </span>
                            <span className={classes.value}>
                                {formatDate(publish_time)}
                            </span>
                        </div>
                        {categoryList.length > 0 &&
                            <div className={classes.item}>
                                <span className={classes.label}>
                                    <FormattedMessage
                                        id={'blogsContent.categories'}
                                        defaultMessage={'Categories: '}
                                    />
                                </span>
                                <span className={classes.value}>
                                    {intersperse(categoryList, ', ')}
                                </span>
                            </div>
                        }
                        {tagList.length > 0 &&
                            <div className={classes.item}>
                                <span className={classes.label}>
                                    <FormattedMessage
                                        id={'blogsContent.tags'}
                                        defaultMessage={'Tags: '}
                                    />
                                </span>
                                <span className={classes.value}>
                                    {intersperse(tagList, ', ')}
                                </span>
                            </div>
                        }
                        <div className={classes.item}>
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
                    <div className={classes.postTextHld}>{blogDescription}</div>
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
        publish_time: string,
        author: shape({
            name: string.isRequired
        }),
        categories: arrayOf(
            shape({
                category_id: number.isRequired,
                identifier: string.isRequired,
                title: string.isRequired,
                is_active: number.isRequired
            })
        ),
        tags: arrayOf(
            shape({
                tag_id: number.isRequired,
                identifier: string.isRequired,
                title: string.isRequired,
                is_active: number.isRequired
            })
        )
    }).isRequired
};

export default BlogContent;
