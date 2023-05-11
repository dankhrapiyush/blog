import React, { Fragment } from 'react';
import { shape, arrayOf, number, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Pagination from '@magento/venia-ui/lib/components/Pagination';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { Link } from 'react-router-dom';
import { intersperse } from '../../util/intersperse';
import { formatDate } from '../../util/formatDate';

import defaultClasses from './blogs.css';

const BlogsContent = props => {
    const { data, pageControl } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const listItems = data && data.items ? data.items.map(blog => {
        const { post_id: id, identifier, title, content, short_content, publish_time, author, categories, tags } = blog;
        const linkTo = resourceUrl(`/blog/post/${String(identifier)}`);

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
                                    id={'blogsContent.author'}
                                    defaultMessage={'Author: '}
                                />
                            </span>
                            <span className={classes.value}>{author.name}</span>
                        </div>
                    </div>
                </div>
                <div className={classes.postContent}>
                    <div className={classes.clearfix}>
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

    return <Fragment>{content}</Fragment>;
};

BlogsContent.prototype = {
    data: shape({
        items: arrayOf(
            shape({
                id: number.isRequired,
                identifier: string.isRequired,
                title: string.isRequired,
                content: string,
                short_content: string,
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
            })
        )
    }).isRequired
};

export default BlogsContent;
