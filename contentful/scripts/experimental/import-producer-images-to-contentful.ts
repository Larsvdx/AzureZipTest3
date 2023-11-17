import {readJsonFile} from "../../../util/filesystem.util";
import {createClient} from "contentful-management";
import {Queue} from "../../../util/queue.util";

const fetchImage = require('node-fetch');
const client = createClient({
    accessToken: 'CFPAT-T1E7b1rmlbvJmEvn64ECOWtTOx-iTDI5Y4DSxsrFqaQ'
});

const producers = readJsonFile('../../teamdesk/exports/producer', 'data.json');

const queue = new Queue(producers);
const intervalId = setInterval(async () => {
    const producer = queue.dequeue();
        fetchImage(`https://www.teamdesk.net/secure/api/v2/81396/Producers/producer_logo/attachment?key=${producer.producer_id}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer D6C37959547F4F4ABB12A25D4BF09C9A'
            }
        })
            .then(response => response.buffer())
            .then(arrayBuffer => {
                client.getSpace('u962r8i34sue')
                    .then((space) => space.getEnvironment('develop'))
                    .then((environment) => environment.createAssetFromFiles({
                        fields: {
                            title: {
                                'en': `${producer.Producer}`
                            },
                            description: {
                                'en': `${producer.Producer}`
                            },
                            file: {
                                'en': {
                                    contentType: 'image/jpeg',
                                    fileName: `${producer.producer_image_meta}.jpg`,
                                    file: arrayBuffer
                                }
                            }
                        }
                    }))
                    .then((asset) => asset.processForAllLocales())
                    .then((asset) => asset.publish())
                    .catch(console.error)
            });


    if (queue.isEmpty()) {
        console.log('All entries have been imported');
        clearInterval(intervalId);
        return "Queue is empty. Interval cleared.";
    }
}, 1700);

