const contentful = require('contentful-management');
main();

async function main() {
    const client = contentful.createClient({
        accessToken: 'CFPAT-QjQ8IidOhMRwF7pt-ecXRZz8Cd79bteRW5GEFroKPrI',
    });

    client.getSpace('u962r8i34sue')
        .then(space => space.getEnvironment('empty'))
        .then(environment => environment.getEntries({content_type: 'specification', limit: 1000}))
        .then(async response => {
            for (const entry of response.items) {
                if (!entry.sys.publishedVersion) {  // <= check if entry in Draft mode, we can immediately delete
                    await entry.delete();
                } else {
                    await entry.unpublish().then(e => e.delete());  // <= otherwise, we need to unpublish first
                }
            }
        });
}
