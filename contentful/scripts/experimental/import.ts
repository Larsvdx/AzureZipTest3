import { OptionValues, program } from 'commander';
import { ContentfulNewAndUpdatedMapperService } from '../../services/contentfulNewAndUpdatedMapperService';
import { Queue } from '../../../util/queue.util';
import { writeJsonFile } from '../../../util/filesystem.util';
import * as contentfulManagement from 'contentful-management';

async function main(): Promise<void> {
    const options = parseOptions();
    const importService = new ContentfulNewAndUpdatedMapperService(options.spaceId, options.environment);
    const data = importService.map();
    writeJsonFile(options.filePath || '../imports', 'data.json', JSON.stringify(data));

    const client = contentfulManagement.createClient({
        accessToken: options.apiKey
    });
    const space = await client.getSpace(options.spaceId);
    const environment = await space.getEnvironment(options.environment);
    const entries: any[] = require('../imports/data.json').entries;
    const queue = new Queue(entries);
    await processEntries(queue, environment);
}

function parseOptions(): OptionValues {
    program
        .requiredOption('-s, --spaceId <spaceId>', 'Contentful space ID')
        .requiredOption('-e, --environment <config>', 'Environment')
        .requiredOption('-a, --apiKey <apiKey>', 'Contentful API key')
        .option('-f, --filePath <filePath>', 'File path to write imported data');

    program.parse(process.argv);
    const options = program.opts() as OptionValues;

    validateOptions(options);
    return options;
}

function validateOptions(options: OptionValues): void {
    if (!options.spaceId) throw new Error('A Contentful space ID is required');
    if (!options.environment) throw new Error('A Contentful environment is required');
}

async function processEntries(queue: Queue, environment: contentfulManagement.Environment): Promise<void> {
    const intervalId = setInterval(async () => {
        const item = queue.dequeue();
        if (!item) {
            clearInterval(intervalId);
            return;
        }

        if (item.sys.type.toLowerCase() !== 'entry') {
            return;
        }

        const existingEntries = await environment.getEntries({
            'sys.id': item.sys.id,
            'sys.contentType.sys.id': item.sys.contentType.sys.id,
        });

        if (existingEntries.items.length > 0) {
            await updateEntry(item, existingEntries.items[0]);
        } else {
            await createEntry(item, environment);
        }
    }, 800);
}

async function updateEntry(item: any, existingEntry: contentfulManagement.Entry): Promise<void> {
    const updatedFields = { ...existingEntry.fields, ...item.fields };
    existingEntry.fields = updatedFields;
    const updatedEntry = await existingEntry.update();
    await updatedEntry.publish();
    console.log(`Entry ${existingEntry.sys?.id} updated`);
}

async function createEntry(item: any, environment: contentfulManagement.Environment): Promise<void> {
    const createdEntry = await environment.createEntryWithId(
        item.sys.contentType.sys.id,
        item.sys.id,
        { fields: item.fields },
    );
    await createdEntry.publish();
    console.log(`Entry ${item.sys.id} created`);
}

main().then(() => console.log('All entries have been imported'));
