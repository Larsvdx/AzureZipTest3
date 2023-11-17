import { createClient, Entry } from 'contentful-management';
import { Command } from 'commander';
import {writeJsonFile} from "../../util/filesystem.util";
import {ContentfulDeletedMapperService} from "../services/contentfulDeletedMapperService";

const fs = require('fs-extra');

main().catch(console.error);

async function main(): Promise<void> {
    const program = new Command();

    program
        .option('-s, --space <spaceId>', 'Contentful spaceId')
        .option('-e, --environment <environmentId>', 'Contentful environment')
        .option('-a, --api-key <apiKey>', 'Contentful apiKey')
        .option('-f, --file-path <filePath>', 'File path with items to delete');

    program.parse(process.argv);
    const { space, environment, apiKey, filePath } = program.opts();

    const importService = new ContentfulDeletedMapperService(space, environment);
    const data = importService.map();
    const importFileName = 'data.json'
    writeJsonFile(filePath || 'sync/archive', importFileName, JSON.stringify(data));

    await archiveEntries(space, environment, apiKey, filePath || 'sync/archive', importFileName);
}

async function archiveEntries(spaceId: string, environmentId: string, apiKey: string, filePath: string, importFileName: string): Promise<void> {
    const jsonFile = require(`../../${filePath || 'sync/archive'}/${importFileName}`);
    const client = createClient({
        accessToken: apiKey,
    });

    for (const item of jsonFile.entries) {
        try {
            const space = await client.getSpace(spaceId);
            const environment = await space.getEnvironment(environmentId);
            const entry = await environment.getEntry(item.sys.id);

            const unpublished = await entry.unpublish();
            unpublished.archive();
            console.log(`Entry ${entry.sys.id} archived.`);
        } catch (error) {
            console.error(error);
        }
    }
}
