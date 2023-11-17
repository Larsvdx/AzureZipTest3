import { readJsonFile } from "../../../util/filesystem.util";
import { createClient, Entry, Asset } from "contentful-management";
import { Queue } from "../../../util/queue.util";
import fetch from 'node-fetch';

interface Producer {
    producer_id: string;
    Producer: string;
    producer_image_meta: string;
}

const client = createClient({
    accessToken: 'CFPAT-itlHJqIJT2WzBrQO4FdUwuOT6ShCg562nv_D0XX_HKI'
});

const producers: Producer[] = readJsonFile('../../teamdesk/exports/producer', 'data.json');

const queue = new Queue<Producer>(producers);
const intervalId = setInterval(async () => {
    const producer = queue.dequeue();
    if (!producer) {
        console.log('All entries have been imported');
        clearInterval(intervalId);
        return "Queue is empty. Interval cleared.";
    }

    const response = await fetch(`https://www.teamdesk.net/secure/api/v2/81396/Producers/producer_logo/attachment?key=${producer.producer_id}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer D6C37959547F4F4ABB12A25D4BF09C9A'
        }
    });
    const arrayBuffer = await response.buffer();

    try {
        const space = await client.getSpace('u962r8i34sue');
        const environment = await space.getEnvironment('master');
        const asset = await environment.createAssetFromFiles({
            fields: {
                title: {
                    'en-US': producer.Producer
                },
                description: {
                    'en-US': producer.Producer
                },
                file: {
                    'en-US': {
                        contentType: 'image/jpeg',
                        fileName: `${producer.producer_image_meta}.jpg`,
                        file: {
                            fileName: `${producer.producer_image_meta}.jpg`,
                            contentType: 'image/jpeg',
                            file: arrayBuffer
                        }
                    }
                }
            }
        }) as Asset;

        await asset.processForAllLocales();
        await asset.publish();

        console.log(`Asset ${asset.sys.id} created and published.`);
    } catch (error) {
        console.error(error);
    }

}, 1700);
