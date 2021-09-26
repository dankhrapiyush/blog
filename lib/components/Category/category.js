import React, { Fragment, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { number } from 'prop-types';
import { useLazyQuery } from '@apollo/client';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Meta, Title } from '@magento/venia-ui/lib/components/Head';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useParams } from 'react-router-dom';
import { usePagination } from '@magento/peregrine';
import { useCategory } from '../../talons/Category/useCategory';

import GET_CATEGORY from './queries/category.graphql';
import GET_CATEGORY_POSTS from './queries/categoryPosts.graphql';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

import blogsClasses from '../Blogs/blogs.css';
import BlogsContent from '../Blogs/blogsContent';

const Category = props => {
    const { pageSize } = props;
    const classes = useStyle(blogsClasses, props.classes);

    // Scroll to the top on component load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Fetch identifier from the URL
    const { id: categoryId } = useParams();

    const talonProps = useCategory({
        categoryId,
        query: GET_CATEGORY
    });

    const { hasError, category_id, title, meta_title, meta_description, content } = talonProps;

    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;
    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [runQuery, queryResponse] = useLazyQuery(GET_CATEGORY_POSTS, {
        variables: {
            currentPage: Number(currentPage),
            pageSize: Number(pageSize),
            filter: {
                category_id: {
                    eq: Number(category_id)
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
                    category_id: {
                        eq: Number(category_id)
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
                        id={'category.fetchError'}
                        defaultMessage={
                            'Something went wrong. Please refresh and try again.'
                        }
                    />
                </span>
            </div>
        );
    } else if (!category_id) {
        return null;
    }

    if (process.env.NODE_ENV === 'development') {
        if (!category_id) {
            console.error('Category id not found.');
        }
    }

    // Show the loading indicator until data has been fetched.
    if (loading) return fullPageLoadingIndicator;

    const categoryContentElement = content ? (
        <RichContent html={content} />
    ) : null;

    return (
        <Fragment>
            <Title>{meta_title}</Title>
            <Meta name="description" content={meta_description} />
            <article className={classes.root}>
                <h1 className={classes.title}>
                    <div className={classes.blogTitle}>{title}</div>
                </h1>
                {categoryContentElement}
                <BlogsContent
                    classes={classes}
                    data={!loading && !data ? null : data.blogPosts}
                    pageControl={pageControl}
                />
            </article>
        </Fragment>
    );
};

Category.propTypes = {
    pageSize: number
};

Category.defaultProps = {
    pageSize: 5
};

export default Category;
