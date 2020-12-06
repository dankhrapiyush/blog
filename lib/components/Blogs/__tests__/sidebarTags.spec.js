import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { default as createTestInstance } from '@magento/peregrine/lib/util/createTestInstance';
import { useSidebarTags } from '../../../talons/Blogs/useSidebarTags';
import SidebarTags from '../sidebarTags';
import { IntlProvider } from 'react-intl';

jest.mock('@magento/venia-ui/lib/classify');
jest.mock('@magento/venia-drivers', () => ({
    Link: ({ children, ...rest }) => <div {...rest}>{children}</div>,
    resourceUrl: x => x
}));
jest.mock('../../../talons/Blogs/useSidebarTags', () => ({
    useSidebarTags: jest.fn()
}));

const talonProps = {
    total_count: 2,
    items: [
        {
            tag_id: 1,
            identifier: 'apple',
            title: 'apple',
            is_active: 1
        },
        {
            tag_id: 2,
            identifier: 'ios',
            title: 'ios',
            is_active: 1
        },
        {
            tag_id: 3,
            identifier: 'ipad',
            title: 'ipad',
            is_active: 1
        },
        {
            tag_id: 4,
            identifier: 'news',
            title: 'news',
            is_active: 1
        }
    ]
};

test('renders sidebar tags list', () => {
    useSidebarTags.mockReturnValueOnce(talonProps);

    const root = createTestInstance(
        <MemoryRouter>
            <IntlProvider locale="en-US">
                <SidebarTags />
            </IntlProvider>
        </MemoryRouter>
    );

    expect(root.toJSON()).toMatchSnapshot();
});

test('renders sidebar tags list when count is zero', () => {
    useSidebarTags.mockReturnValueOnce({
        total_count: 0
    });

    const root = createTestInstance(
        <MemoryRouter>
            <IntlProvider locale="en-US">
                <SidebarTags />
            </IntlProvider>
        </MemoryRouter>
    );

    expect(root.toJSON()).toMatchSnapshot();
});

test('renders sidebar tags list when count is zero and data exist', () => {
    useSidebarTags.mockReturnValueOnce({
        ...talonProps,
        total_count: 0
    });

    const root = createTestInstance(
        <MemoryRouter>
            <IntlProvider locale="en-US">
                <SidebarTags />
            </IntlProvider>
        </MemoryRouter>
    );

    expect(root.toJSON()).toMatchSnapshot();
});

test('renders sidebar tags list when count is greater than zero and no data exist', () => {
    useSidebarTags.mockReturnValueOnce({
        ...talonProps,
        items: []
    });

    const root = createTestInstance(
        <MemoryRouter>
            <IntlProvider locale="en-US">
                <SidebarTags />
            </IntlProvider>
        </MemoryRouter>
    );

    expect(root.toJSON()).toMatchSnapshot();
});
