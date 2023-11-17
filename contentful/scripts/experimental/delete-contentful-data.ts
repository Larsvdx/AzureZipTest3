import { createClient } from 'contentful-management';
import { program } from 'commander';

const fs = require('fs-extra');

main();

export async function main() {
    program
        .option('-s, --space <spaceId>', 'contentful spaceId')
        .option('-e, --environment <environmentId>', 'contentful environment')
        .option('-a, --api-key <apiKey>', 'contentful apiKey')
        .option('-f, --file-path <filePath>', 'file path with items to delete');

    program.parse(process.argv);
    const options = program.opts();

    await archiveEntries(options.space, options.environment, options.apiKey, options.filePath);
}

async function archiveEntries(
    space: string,
    environment: string,
    apiKey: string,
    filePath: string
) {
    const client = createClient({
        accessToken: apiKey,
    });

    const deleted = fs.readJsonSync(filePath);

    deleted.forEach((item) => {
        client.getSpace(space)
            .then((space) => space.getEnvironment(environment))
            .then((environment) => environment.getEntry(deleted.id))
            .then((entry) => {
                return entry.unpublish();
            })
            .then((entry) => {
                console.log(`entry ${entry.sys.id} archived.`);
            })
            .catch(console.error);
    });

}
