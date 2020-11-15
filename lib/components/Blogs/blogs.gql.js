import gql from 'graphql-tag';

const GET_BLOG_QUERY = gql`
    query GetPosts($pageSize: Int, $currentPage: Int) {
        blogPosts(pageSize: $pageSize, currentPage: $currentPage) {
            total_count
            total_pages
            items {
                post_id
                identifier
                title
                content
                short_content
            }
        }
    }
`;

export default {
    queries: {
        getBlogQuery: GET_BLOG_QUERY
    },
    mutations: {}
};