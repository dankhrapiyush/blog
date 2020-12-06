import { useQuery } from '@apollo/client';

/**
 * Talon for Blog Sidebar Categories.
 *
 * @param {*} props.query the blog data query
 */
export const useSidebarCategories = props => {
    const { query } = props;

    const { error, loading, data } = useQuery(query, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    let items = [];
    if (!error && !loading) {
        items = data.blogCategories.items;
    }

    const hasError = !!error;
    const total_count = data ? data.blogCategories.total_count : 0;

    return {
        hasError,
        items,
        total_count
    };
};
