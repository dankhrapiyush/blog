import { useQuery } from '@apollo/client';

/**
 * Talon for Blog Tag.
 *
 * @param {*} props.query the blog data query
 */
export const useTag = props => {
    const { tagId, query } = props;

    const { error, data } = useQuery(query, {
        variables: {
            id: String(tagId)
        },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const tag_id = data ? data.blogTag.tag_id : null;
    const hasError = !!error;
    const identifier = data ? data.blogTag.identifier : null;
    const title = data ? data.blogTag.title : null;
    const meta_title =
        data && data.blogTag.meta_title
            ? data.blogTag.meta_title
            : title;
    const meta_description = data ? data.blogTag.meta_description : null;
    const content = data ? data.blogTag.content : null;

    return {
        tag_id,
        hasError,
        identifier,
        title,
        meta_title,
        meta_description,
        content
    };
};
