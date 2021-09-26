import React, { Fragment, useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useQuery } from '@apollo/client';
import { array, shape, string } from 'prop-types';
import { useStyle } from '@magento/venia-ui/lib/classify';
import GalleryItem from './item';

import GET_PRODUCTS from './queries/getProducts.graphql';

import blogsClasses from '../Blogs/blogs.css';
import defaultClasses from './blog.css';
import itemClasses from './item.css';

// map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
const mapGalleryItem = item => {
    const { small_image } = item;
    return {
        ...item,
        small_image:
            typeof small_image === 'object' ? small_image.url : small_image
    };
};

const RelatedProducts = props => {
    const classes = useStyle(
        blogsClasses,
        defaultClasses,
        itemClasses,
        props.classes
    );
    const products = props.data;
    const limit = props.mfblog_post_view_related_products_number_of_products;

    // Fetch the data using apollo react hooks
    const { data, error } = useQuery(GET_PRODUCTS, {
        variables: {
            filters: {
                sku: {
                    in: products
                }
            }
        },
        fetchPolicy: 'cache-and-network'
    });

    useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);

    const items = data ? data.products.items : '';

    // Thanks to https://stackoverflow.com/a/42374933 for adding a limit
    const galleryItems = useMemo(
        () =>
            items &&
            items.slice(0, limit).map((item, index) => {
                if (item === null) {
                    return <GalleryItem key={index} classes={classes} />;
                }
                return (
                    <GalleryItem
                        key={index}
                        item={mapGalleryItem(item)}
                        classes={classes}
                    />
                );
            }),
        [items]
    );

    return (
        <Fragment>
            {items.length > 0 &&
                <div className={classes.postHolder}>
                    <h1 className={classes.title}>
                        <div className={classes.blogTitle}>
                            <FormattedMessage
                                id={'relatedProducts.title'}
                                defaultMessage={'Related Products'}
                            />
                        </div>
                    </h1>
                    <div className={classes.items}>{galleryItems}</div>
                </div>
            }
        </Fragment>
    );
};

RelatedProducts.prototype = {
    data: string
};

RelatedProducts.defaultProps = {
    mfblog_post_view_related_products_number_of_products: 5
};

export default RelatedProducts;
