import React, { Fragment, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Title, Meta } from '@magento/venia-ui/lib/components/Head';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useQuery } from '@apollo/client';
import { useParams } from '@magento/venia-ui/lib/drivers';
// import { useBlog } from '../../talons/Blog/useBlog';

import BlogContent from './blogContent';
import RelatedProducts from './relatedProducts';
import BlogComment from '../BlogComment';
import defaultClasses from './blog.css';

import GET_BLOG_POST from './queries/blogPost.graphql';
// import GET_STORE_CONFIG_DATA from './queries/getBlogConfigData.graphql';

const Blog = props => {
    // Scroll to the top on component load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    /*
    const talonProps = useBlog({
        query: GET_STORE_CONFIG_DATA
    });

    const config = talonProps.data;
    const { mfblog_post_view_comments_type, mfblog_post_view_related_products_enabled, mfblog_post_view_related_products_number_of_products } = config;
    */
    const mfblog_post_view_related_products_number_of_products = 5;
    const mfblog_post_view_comments_type = 'magefan';
    const mfblog_post_view_related_products_enabled = 1;

    const classes = mergeClasses(defaultClasses, props.classes);

    // Fetch identifier from the URL
    const { id } = useParams();

    // Fetch the data using apollo react hooks
    const { data, error, loading } = useQuery(GET_BLOG_POST, {
        variables: { id: id }
    });

    // Show the loading indicator until data has been fetched.
    if (loading) return fullPageLoadingIndicator;

    // Display an error message.
    if (error && !loading) {
        return (
            <div>
                <FormattedMessage
                    id={'blog.fetchError'}
                    defaultMessage={'Data Fetch Error'}
                />
            </div>
        );
    }

    const metaDescription =
        data && data.blogPost && data.blogPost.meta_description
            ? data.blogPost.meta_description
            : '';

    return (
        <Fragment>
            <Title>{data.blogPost.meta_title}</Title>
            <Meta name="description" content={metaDescription} />
            <article className={classes.root}>
                <BlogContent
                    classes={classes}
                    data={!loading && !data ? null : data.blogPost}
                />
                {mfblog_post_view_comments_type === 'magefan' &&
                    <BlogComment
                        classes={classes}
                        post_id={data.blogPost.post_id}
                    />
                }
                {Number(mfblog_post_view_related_products_enabled) === 1 &&
                    <RelatedProducts
                        classes={classes}
                        data={
                            !loading && !data
                                ? null
                                : data.blogPost.related_products
                        }
                        limit={mfblog_post_view_related_products_number_of_products}
                    />
                }
            </article>
        </Fragment>
    );
};

export default Blog;
