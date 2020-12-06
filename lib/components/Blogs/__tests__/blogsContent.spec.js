import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { default as createTestInstance } from '@magento/peregrine/lib/util/createTestInstance';
import BlogsContent from '../blogsContent';
import { IntlProvider } from 'react-intl';

jest.mock('@magento/venia-ui/lib/classify');
jest.mock('@magento/venia-drivers', () => ({
    Link: ({ children, ...rest }) => <div {...rest}>{children}</div>,
    resourceUrl: x => x,
    html: x => x
}));
jest.mock('@magento/venia-ui/lib/components/RichContent', () => 'RichContent');
jest.mock('@magento/venia-ui/lib/components/Pagination', () => 'Pagination');

const blogsContentProps = {
    pageSize: 1,
    data: {
        items: [
            {
                post_id: 1,
                identifier: 'foo',
                title: 'Foo',
                content: 'Foo Description',
                publish_time: '2020-07-05 00:00:00',
                short_content: 'Foo Short Description',
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
                    }
                ],
                categories: [
                    {
                        category_id: 1,
                        identifier: 'general',
                        title: 'General',
                        is_active: 1
                    }
                ]
            },
            {
                post_id: 2,
                identifier: 'bar',
                title: 'Bar',
                content: 'Bar Description',
                publish_time: '2020-07-10 00:00:00',
                short_content: 'Foo Short Description',
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
                        is_active: 0
                    }
                ]
            }
        ]
    }
};

test('renders blogs list', () => {
    const root = createTestInstance(
        <MemoryRouter>
            <IntlProvider locale="en-US">
                <BlogsContent {...blogsContentProps} />
            </IntlProvider>
        </MemoryRouter>
    );

    expect(root.toJSON()).toMatchSnapshot();
});
