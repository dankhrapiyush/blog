import React, { Fragment, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Title } from '@magento/venia-ui/lib/components/Head';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { usePagination } from '@magento/peregrine';
import { useLazyQuery, useQuery } from '@apollo/client';

import BlogsContent from './blogsContent';
import defaultClasses from './blogs.css';

import GET_BLOG_POSTS from './queries/blogPosts.graphql';

const Blogs = props => {
    const { pageSize } = props;
    const { formatMessage } = useIntl();
    const classes = mergeClasses(defaultClasses, props.classes);

    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;
    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    // Scroll to the top on component load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Fetch the data using apollo react hooks
    // https://www.apollographql.com/docs/react/api/react-apollo/
    // Search 'Valid fetchPolicy values are'
    // cache-first, cache-and-network, network-only, cache-only, no-cache
    // const { data, error, loading } = useQuery(getBlogQuery, { fetchPolicy: 'cache-and-network' });
    const [runQuery, queryResponse] = useLazyQuery(
        GET_BLOG_POSTS,
        {
            variables:
            {
                currentPage: Number(1),
                pageSize: Number(5)
            },
            fetchPolicy: 'cache-and-network'
        }
    );
    const { loading, error, data } = queryResponse;

    const totalPagesFromData = data
        ? data.blogPosts.total_pages
        : null;

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
                pageSize: Number(pageSize)
            },
            fetchPolicy: 'cache-and-network'
        });
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, [
        currentPage,
        pageSize,
        runQuery
    ]);

    // If we get an error after loading we should try to reset to page 1.
    // If we continue to have errors after that, render an error message.
    useEffect(() => {
        if (error && !loading && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [currentPage, error, loading, setCurrentPage]);

    // Display an error message.
    if (error && currentPage === 1 && !loading) return <div>Data Fetch Error</div>;

    // Show the loading indicator until data has been fetched.
    if (loading) return fullPageLoadingIndicator;
    const title = formatMessage(
        {
            id: 'blogs.title',
            defaultMessage: 'Blog'
        }
    );

    return (
        <Fragment>
            <Title>{title}</Title>
            <article className={classes.root}>
                <h1 className={classes.title}>
                    <div className={classes.blogTitle}>
                        <FormattedMessage
                            id={'blogs.title'}
                            defaultMessage={'Blog'}
                        />
                    </div>
                </h1>
            </article>
            <BlogsContent
                classes={classes}
                data={!loading && !data ? null : data.blogPosts}
                pageControl={pageControl}
            />
        </Fragment>
    );
};

export default Blogs;

Blogs.defaultProps = {
    pageSize: 5
};
