module.exports = targets => {
    targets.of('@magento/pwa-buildpack').specialFeatures.tap((flags) => {
        flags[targets.name] = {
            esModules: true,
            cssModules: true,
            graphqlQueries: true
        };
    });

    targets.of('@magento/venia-ui').routes.tap((routes) => {
        routes.push({
            name: 'Blogs',
            pattern: '/blog',
            path: '@dankhrapiyush/blog/lib/components/Blogs'
        });
        routes.push({
            name: 'BlogCategory',
            pattern: '/blog/category/:id?',
            path: '@dankhrapiyush/blog/lib/components/Category'
        });
        routes.push({
            name: 'BlogTag',
            pattern: '/blog/tag/:id?',
            path: '@dankhrapiyush/blog/lib/components/Tag'
        });
        routes.push({
            name: 'Blog',
            pattern: '/blog/post/:id?',
            path: '@dankhrapiyush/blog/lib/components/Blog'
        });
        return routes;
    });
};
