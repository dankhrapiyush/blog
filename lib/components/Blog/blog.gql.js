import gql from 'graphql-tag';

const GET_BLOG_QUERY = gql`
    query GetPost ($id: String) {
        blogPost (
            id: $id
        ) {
            post_id
            title
            content
        }
    }
`;

export default {
    queries: {
        getBlogQuery: GET_BLOG_QUERY
    },
    mutations: {}
};