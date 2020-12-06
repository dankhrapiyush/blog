import React, { Fragment } from 'react';
import { shape, arrayOf, number, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Link, resourceUrl } from '@magento/venia-drivers';
import { useSidebarTags } from '../../talons/Blogs/useSidebarTags';

import defaultClasses from './sidebar.css';
import { gql } from '@apollo/client';

const SidebarTags = props => {
    const talonProps = useSidebarTags({
        query: GET_BLOG_TAGS
    });
    const { total_count, items } = talonProps;

    if (!total_count || !items.length) {
        return null;
    }

    const classes = mergeClasses(defaultClasses, props.classes);

    const tagList = items.map((tag) => {
        const tagLink = resourceUrl(`/blog/tag/${tag.identifier}`);
        return (
            tag.is_active === 1 && (
                <li key={tag.tag_id}>
                    <Link to={tagLink}>{tag.title}</Link>
                </li>
            )
        );
    });

    return (
        <Fragment>
            <div className={classes.block}>
                <div className={classes.blockTitle}>
                    <FormattedMessage
                        id={'sidebarTags.title'}
                        defaultMessage={'Tags'}
                    />
                </div>
                <ul className={classes.list}>{tagList}</ul>
            </div>
        </Fragment>
    );
};

SidebarTags.prototype = {
    data: shape({
        items: arrayOf(
            shape({
                tag_id: number.isRequired,
                identifier: string.isRequired,
                title: string.isRequired,
                is_active: number
            })
        )
    }).isRequired
};

export const GET_BLOG_TAGS = gql`
    query blogTags {
        blogTags {
            total_count
            items {
                tag_id
                identifier
                title
                is_active
            }
        }
    }
`;

export default SidebarTags;
