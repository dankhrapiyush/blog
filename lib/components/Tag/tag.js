import React, { Fragment, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { number } from 'prop-types';
import { useLazyQuery } from '@apollo/client';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Title, Meta } from '@magento/venia-ui/lib/components/Head';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useParams } from '@magento/venia-ui/lib/drivers';
import { usePagination } from '@magento/peregrine';
import { useTag } from '../../talons/Tag/useTag';

import GET_TAG from './queries/tag.graphql';
import GET_TAG_POSTS from './queries/tagPosts.graphql';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

import blogsClasses from '../Blogs/blogs.css';
import BlogsContent from '../Blogs/blogsContent';

const Tag = props => {
    const { pageSize } = props;
    const classes = mergeClasses(blogsClasses, props.classes);

    // Scroll to the top on component load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Fetch identifier from the URL
    const { id: tagId } = useParams();

    const talonProps = useTag({
        tagId,
        query: GET_TAG
    });

    const { hasError, tag_id, title, meta_title, meta_description, content } = talonProps;

    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;
    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [runQuery, queryResponse] = useLazyQuery(GET_TAG_POSTS, {
        variables: {
            currentPage: Number(currentPage),
            pageSize: Number(pageSize),
            filter: {
                tag_id: {
                    eq: Number(tag_id)
                }
            }
        },
        fetchPolicy: 'cache-and-network'
    });
    const { loading, error, data } = queryResponse;

    const totalPagesFromData = data ? data.blogPosts.total_pages : null;

    useEffect(() => {
        setTotalPages(totalPagesFromData);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, totalPagesFromData]);

    // Run the posts query immediately and whenever its variable values change.
    useEffect(() => {
        runQuery({
            variables: {
                currentPage: Number(currentPage),
                pageSize: Number(pageSize),
                filters: {
                    tag_id: {
                        eq: Number(tag_id)
                    }
                }
            },
            fetchPolicy: 'cache-and-network'
        });
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, [currentPage, pageSize, runQuery]);

    // Display an error message.
    if (hasError || error) {
        return (
            <div className={classes.root}>
                <span className={classes.errorText}>
                    <FormattedMessage
                        id={'tag.fetchError'}
                        defaultMessage={
                            'Something went wrong. Please refresh and try again.'
                        }
                    />
                </span>
            </div>
        );
    } else if (!tag_id) {
        return null;
    }

    if (process.env.NODE_ENV === 'development') {
        if (!tag_id) {
            console.error('Tag id not found.');
        }
    }

    // Show the loading indicator until data has been fetched.
    if (loading) return fullPageLoadingIndicator;

    const tagContentElement = content ? <RichContent html={content} /> : null;

    return (
        <Fragment>
            <Title>{meta_title}</Title>
            <Meta name="description" content={meta_description} />
            <article className={classes.root}>
                <h1 className={classes.title}>
                    <div className={classes.blogTitle}>{title}</div>
                </h1>
                {tagContentElement}
                <BlogsContent
                    classes={classes}
                    data={!loading && !data ? null : data.blogPosts}
                    pageControl={pageControl}
                />
            </article>
        </Fragment>
    );
};

Tag.propTypes = {
    pageSize: number
};

Tag.defaultProps = {
    pageSize: 5
};

export default Tag;
