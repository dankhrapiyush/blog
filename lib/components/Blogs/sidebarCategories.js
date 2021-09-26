import React, { Fragment } from 'react';
import { shape, arrayOf, number, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useSidebarCategories } from '../../talons/Blogs/useSidebarCategories';

import defaultClasses from './sidebar.css';
import { gql } from '@apollo/client';

const SidebarCategories = props => {
    const talonProps = useSidebarCategories({
        query: GET_BLOG_CATEGORIES
    });
    const { total_count, items } = talonProps;

    if (!total_count || !items.length) {
        return null;
    }

    const classes = useStyle(defaultClasses, props.classes);

    const categoryList = items.map((category) => {
        const categoryLink = resourceUrl(
            `/blog/category/${category.identifier}`
        );
        return (
            category.is_active === 1 && (
                <li key={category.category_id}>
                    <Link to={categoryLink}>
                        {category.title} {`(${category.posts_count})`}
                    </Link>
                </li>
            )
        );
    });

    return (
        <Fragment>
            <div className={classes.block}>
                <div className={classes.blockTitle}>
                    <FormattedMessage
                        id={'sidebarCategories.title'}
                        defaultMessage={'Categories'}
                    />
                </div>
                <ul className={classes.list}>{categoryList}</ul>
            </div>
        </Fragment>
    );
};

SidebarCategories.prototype = {
    data: shape({
        items: arrayOf(
            shape({
                category_id: number.isRequired,
                identifier: string.isRequired,
                title: string.isRequired,
                is_active: number,
                posts_count: number
            })
        )
    }).isRequired
};

export const GET_BLOG_CATEGORIES = gql`
    query blogCategories {
        blogCategories {
            total_count
            items {
                category_id
                identifier
                title
                is_active
                posts_count
            }
        }
    }
`;

export default SidebarCategories;
