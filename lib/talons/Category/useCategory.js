import { useQuery } from '@apollo/client';

/**
 * Talon for Blog Category.
 *
 * @param {string} props.categoryId the blog category id
 * @param {string} props.query the blog data query
 */
export const useCategory = props => {
    const { categoryId, query } = props;

    const { error, data } = useQuery(query, {
        variables: {
            id: String(categoryId)
        },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const category_id = data ? data.blogCategory.category_id : null;
    const hasError = !!error;
    const identifier = data ? data.blogCategory.identifier : null;
    const title = data ? data.blogCategory.title : null;
    const meta_title =
        data && data.blogCategory.meta_title
            ? data.blogCategory.meta_title
            : title;
    const meta_description = data ? data.blogCategory.meta_description : null;
    const content = data ? data.blogCategory.content : null;

    return {
        category_id,
        hasError,
        identifier,
        title,
        meta_title,
        meta_description,
        content
    };
};
