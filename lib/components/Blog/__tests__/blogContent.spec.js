import React from 'react';
import TestRenderer from 'react-test-renderer';
import BlogContent from '../blogContent';
import { IntlProvider } from 'react-intl';

jest.mock('@magento/venia-ui/lib/classify');
jest.mock('react-router-dom', () => ({
    Link: ({ children, ...rest }) => <div {...rest}>{children}</div>,
    html: x => x
}));
jest.mock('@magento/peregrine/lib/util/makeUrl');
jest.mock('@magento/venia-ui/lib/components/RichContent', () => 'RichContent');

const blogContentProps = {
    data: {
        post_id: 1,
        title: 'Foo Bar',
        content: 'Foo Bar Description',
        publish_time: '2020-07-10 00:00:00',
        author: {
            title: 'web dev',
            name: 'web dev',
            url: null,
            author_url: 'https://magento.local/blog/author/web-dev'
        },
        tags: [
            {
                tag_id: 1,
                identifier: 'tag1',
                title: 'tag1',
                is_active: 1
            },
            {
                tag_id: 2,
                identifier: 'tag2',
                title: 'tag2',
                is_active: 1
            }
        ],
        categories: [
            {
                category_id: 1,
                identifier: 'general',
                title: 'General',
                is_active: 1
            },
            {
                category_id: 2,
                identifier: 'new',
                title: 'New',
                is_active: 1
            }
        ]
    }
};

test('renders blog content', () => {
    const root = TestRenderer.create(
        <IntlProvider locale="en-US">
            <BlogContent {...blogContentProps} />
        </IntlProvider>
    );

    expect(root.toJSON()).toMatchSnapshot();
});
