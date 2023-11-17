import {readJsonFile} from "../../../util/filesystem.util";
import {createClient} from "contentful-management";
import {DelayedQueue} from "../../../util/delayed.queue.util";

const fetchImage = require('node-fetch');
const fileType = require('file-type');

const client = createClient({
    accessToken: 'CFPAT-ci7TOv_dv4oXzI86EIBYYfs12dxGSRGilBoTYD6KzAY'
});
const caseStudies = readJsonFile('../../../sync/exports/casestudy', 'data.json');
const queueInterval = 1500;
const numberOfCaseStudyImages = 4;


main().catch(console.error);

async function main() {
    const delayedQueue = new DelayedQueue(caseStudies, 4000);
    delayedQueue.dequeue(async (caseStudy: any) => {
        processCaseStudies(caseStudy);
    });
}

function processCaseStudies(caseStudy: any) {
    const queueData = [];

    for(let index = 1; index <= numberOfCaseStudyImages; index++) {
        queueData.push({ imageNumber: index, caseStudy: caseStudy });
    }

    const delayedQueue = new DelayedQueue(queueData, queueInterval);

    delayedQueue.dequeue(async (item: any) => {
        processCaseStudyByImageId(item.caseStudy, item.imageNumber);
    });

}

function processCaseStudyByImageId(caseStudy: any, imageNumber: number) {
    fetchImage(`https://www.teamdesk.net/secure/api/v2/81396/Case Study/image${imageNumber}/attachment?key=${caseStudy.case_study_id}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer D6C37959547F4F4ABB12A25D4BF09C9A'
        }
    })
        .then(response => response.buffer())
        .then(arrayBuffer => {
            if(arrayBuffer.includes(0)) {
                client.getSpace('u962r8i34sue')
                    .then((space) => space.getEnvironment('master_0910'))
                    .then(async (environment) => {
                        const query = { 'fields.title': `${caseStudy.Application}-image-${imageNumber}` };
                        const assets = await environment.getAssets(query);

                        if(assets.items.length > 0) await Promise.reject('Asset with this name already exists');

                        return environment;
                    })
                    .then((environment) => environment.createAssetFromFiles({
                        fields: {
                            title: {
                                'en': `${caseStudy.Application}-image-${imageNumber}`
                            },
                            description: {
                                'en': '-'
                            },
                            file: {
                                'en': {
                                    contentType: 'image/jpeg',
                                    fileName: `image-${imageNumber}-${caseStudy.case_study_id}.jpg`,
                                    file: arrayBuffer
                                }
                            }
                        }
                    }))
                    .then((asset) => asset.processForAllLocales())
                    .then((asset) => asset.publish()
                        .then((asset) => {
                            console.log(`(${imageNumber}) case study: ${caseStudy.case_study_id} - asset: ${asset.sys.id}`);
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve(asset);
                                }, 1000);
                            });
                        })
                        .then((asset) => updateCaseStudyEntry(asset, caseStudy, imageNumber))
                    )
                    .catch(console.error)
            }
        });
}

function updateCaseStudyEntry(asset: any, caseStudy: any, imageNumber: number) {
    client.getSpace('u962r8i34sue')
        .then((space) => space.getEnvironment('master_0910'))
        .then(async (environment) => {
            const entries = await environment.getEntries({
                'sys.id': `casestudy-${caseStudy.case_study_id}`
            });

            if (entries.items.length > 0) {
                const entry = entries.items[0];
                if (entry) {
                    const updatedFields = Object.assign({}, entry.fields, {
                            "images": {
                                en: [
                                    ...(imageNumber > 1 ? entry.fields.images?.en ?? [] : []),
                                    {
                                        "sys": {
                                            "type": "Link",
                                            "linkType": "Asset",
                                            "id": asset.sys.id
                                        }
                                    }
                                ]
                            }
                    });
                    entry.fields = updatedFields;
                    if (!entry.isArchived()) {
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
            }
        });
}
