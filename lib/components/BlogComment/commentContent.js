import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { arrayOf, number, shape, string } from 'prop-types';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './comment.css';

const CommentContent = props => {
    const { data } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const listItems = data && data.items ? data.items.map(blog => {
        const { comment_id: id, text, author_nickname, creation_time } = blog;
        const formattedDate = new Date(creation_time).toLocaleDateString(
            undefined,
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }
        );

        return (
            <li key={id} className={classes.cComment}>
                <div className={classes.cPost}>
                    <div className={classes.pName}>
                        {author_nickname}
                    </div>
                    <div className={classes.pText}>
                        {text}
                    </div>
                    <div className={classes.cActions}>
                        <span className={classes.publishDate}>{formattedDate}</span>
                    </div>
                </div>
            </li>
        );
    }) : '';

    const loadMore = () => {
        props.loadComments(data.items.length);
    };

    const cnt = data && data.total_count ? data.total_count : 0;
    const len = data && data.items ? data.items.length : 0;

    return (
        <Fragment>
            {cnt > 0 &&
                <ul className={classes.cComments}>{listItems}</ul>
            }
            {cnt > len &&
                <button className={classes.cAction} onClick={loadMore}>
                    <FormattedMessage
                        id={'commentContent.loadMore'}
                        defaultMessage={'Load more'}
                    />
                </button>
            }
        </Fragment>
    );
};

CommentContent.prototype = {
    data: shape({
        items: arrayOf(
            shape({
                text: number.isRequired,
                author_nickname: string,
                creation_time: string
            })
        ),
        total_count: number
    }).isRequired
};

export default CommentContent;
