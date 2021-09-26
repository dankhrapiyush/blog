import React from 'react';
import TestRenderer from 'react-test-renderer';
import { useSidebarCategories } from '../../../talons/Blogs/useSidebarCategories';
import SidebarCategories from '../sidebarCategories';
import { IntlProvider } from 'react-intl';

jest.mock('@magento/venia-ui/lib/classify');
jest.mock('react-router-dom', () => ({
    Link: ({ children, ...rest }) => <div {...rest}>{children}</div>,
    resourceUrl: x => x
}));
jest.mock('../../../talons/Blogs/useSidebarCategories', () => ({
    useSidebarCategories: jest.fn()
}));

const talonProps = {
    total_count: 2,
    items: [
        {
            category_id: 1,
            identifier: 'general',
            title: 'General',
            is_active: 1,
            meta_title: 'General',
            posts_count: 12
        },
        {
            category_id: 2,
            identifier: 'tech',
            title: 'Tech',
            is_active: 1,
            meta_title: 'Tech',
            posts_count: 10
        }
    ]
};

test('renders sidebar categories list', () => {
    useSidebarCategories.mockReturnValueOnce(talonProps);

    const root = TestRenderer.create(
        <IntlProvider locale="en-US">
            <SidebarCategories />
        </IntlProvider>
    );

    expect(root.toJSON()).toMatchSnapshot();
});

test('renders sidebar categories list when count is zero', () => {
    useSidebarCategories.mockReturnValueOnce({
        total_count: 0
    });

    const root = TestRenderer.create(
        <IntlProvider locale="en-US">
            <SidebarCategories />
        </IntlProvider>
    );

    expect(root.toJSON()).toMatchSnapshot();
});

test('renders sidebar categories list when count is zero and data exist', () => {
    useSidebarCategories.mockReturnValueOnce({
        ...talonProps,
        total_count: 0
    });

    const root = TestRenderer.create(
        <IntlProvider locale="en-US">
            <SidebarCategories />
        </IntlProvider>
    );

    expect(root.toJSON()).toMatchSnapshot();
});

test('renders sidebar categories list when count is greater than zero and no data exist', () => {
    useSidebarCategories.mockReturnValueOnce({
        ...talonProps,
        items: []
    });

    const root = TestRenderer.create(
        <IntlProvider locale="en-US">
            <SidebarCategories />
        </IntlProvider>
    );

    expect(root.toJSON()).toMatchSnapshot();
});
