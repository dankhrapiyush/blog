import { useQuery } from '@apollo/client';

/**
 * Talon for Blog Sidebar Tags.
 *
 * @param {*} props.query the blog data query
 */
export const useSidebarTags = props => {
    const { query } = props;

    const { error, loading, data } = useQuery(query, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    let items = [];
    if (!error && !loading) {
        items = data.blogTags.items;
    }

    const hasError = !!error;
    const total_count = data ? data.blogTags.total_count : 0;

    return {
        hasError,
        items,
        total_count
    };
};
