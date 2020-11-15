module.exports = targets => {
    targets.of('@magento/pwa-buildpack').specialFeatures.tap(flags => {
        flags[targets.name] = {esModules: true, cssModules: true, graphqlQueries: true};
    });

    targets.of('@magento/venia-ui').routes.tap(routes => {
        routes.push({
            name: 'Blog',
            pattern: '/blog/post/:id?',
            path: '@dankhrapiyush/blog/lib/components/Blog'
        });
        routes.push({
            name: 'Blogs',
            pattern: '/blog',
            path: '@dankhrapiyush/blog/lib/components/Blogs'
        });
        return routes;
    });
}
