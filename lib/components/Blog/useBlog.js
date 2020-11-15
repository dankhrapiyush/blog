import { useEffect } from 'react';
import { useQuery } from '@apollo/client';

/**
 *
 * @param {*} props.query the blog data query
 */
export const useBlog = props => {
    const { query } = props;
    const { error, data } = useQuery(query);

    useEffect(() => {
        if (error) {
            console.log('Error fetching blog config data.');
        }
    }, [error]);

    return {
        data: data ? data.storeConfig : null
    };
};
