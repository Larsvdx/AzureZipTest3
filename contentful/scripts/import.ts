import { ContentfulNewAndUpdatedMapperService } from '../services/contentfulNewAndUpdatedMapperService';
import { writeJsonFile } from '../../util/filesystem.util';
import { program } from 'commander';
import { DelayedQueue } from "../../util/delayed.queue.util";
const contentful = require('contentful-management');

main().catch(console.error);

async function main() {
    program
        .requiredOption('-s, --spaceId <spaceId>', 'Contentful spaceId')
        .requiredOption('-e, --environment <config>', 'Contentful Environment')
        .requiredOption('-a, --api-key <apiKey>', 'Contentful apiKey')
        .option('-f, --file-path <filePath>', 'File path to write imported data');

    program.parse(process.argv);
    const options = program.opts();
    validateOptions(options);

    const importService = new ContentfulNewAndUpdatedMapperService(options.spaceId, options.environment);
    const data = importService.map();
    const importFileName = 'data.json'
    const filePath = options.filePath || 'sync/imports';
    writeJsonFile(filePath, importFileName, JSON.stringify(data));

    const client = contentful.createClient({
        accessToken: options.apiKey,
        environment: options.environment,
    });

    const spaceId = options.spaceId;
    const environmentId = options.environment;
    const jsonFile = require(`../../${filePath}/${importFileName}`);

    client.getSpace(spaceId)
        .then((space: any) => {
            return space.getEnvironment(environmentId);
        })
        .then((environment: any) => {
            const delayedQueue = new DelayedQueue(jsonFile.entries, 850);
            delayedQueue.dequeue(async (item: any) => {
                processContentfulEntry(environment, item);
            });
        })
        .catch((error: any) => {
            console.log(error);
        });
}

function validateOptions(options: any) {
    if (!options.spaceId) throw new Error('A contentful space is required');
    if (!options.environment)  throw new Error('A contentful environment is required');
    if (!options.apiKey)  throw new Error('A contentful API key is required');
}

async function processContentfulEntry(environment: any, item: any) {
    if (item && item.sys.type.toLowerCase() === 'entry') {
        const entries = await environment.getEntries({
            'sys.id': item.sys.id,
            'sys.contentType.sys.id': item.sys.contentType.sys.id,
        });

        if (entries.items.length > 0) {
            const entry = entries.items[0];
            if (entry) {
                const updatedFields = Object.assign({}, entry.fields, item.fields);
                entry.fields = updatedFields;
                if(!entry.isArchived()) {
                    try {
                        const updatedEntry = await entry.update();
                        await updatedEntry.publish()
                            .then(() => {
                                console.log('Asset published');
                            })
                            .catch((error: any) => {
                                console.log('Error occurred while publishing asset:', error);
                            });
                        console.log(`entry ${entry.sys?.id} updated`);
                    } catch (e) {
                        console.log('Error occurred while publishing asset:', e);
                    }
                } else {
                    console.log(`entry ${entry.sys?.id} is not published`);
                }
            }
        } else {
            const createdEntry = await environment.createEntryWithId(item.sys.contentType.sys.id, item.sys.id, {fields: item.fields});
            await createdEntry.publish()
                .then(() => {
                    console.log('Asset published');
                })
                .catch((error: any) => {
                    console.log('Error occurred while publishing asset:', error);
                });
            console.log(`entry ${item.sys.id} created`);
        }
    }
}
