import {createClient} from "contentful-management";
import {DelayedQueue} from "../../util/delayed.queue.util";
import {OptionValues} from "commander";

const fetchImage = require("node-fetch");

let client;
const queueInterval = 1500;
const numberOfCaseStudyImages = 4;

export async function importCaseStudyImages(
  options: OptionValues,
  caseStudies: any[]
) {
  const delayedQueue = new DelayedQueue(caseStudies, 6000);

  client = createClient({
    accessToken: options.apiKey,
  });

  await delayedQueue.dequeue(async (caseStudy: any) => {
    processCaseStudies(options, caseStudy);
  });
  return true
}

async function processCaseStudies(options: OptionValues, caseStudy: any) {
  const queueData = [];

  for (let index = 1; index <= numberOfCaseStudyImages; index++) {
    queueData.push({ imageNumber: index, caseStudy: caseStudy });
  }

  if (queueData.length > 1) {
    const delayedQueue = new DelayedQueue(queueData, queueInterval);

    await delayedQueue.dequeue(async (item: any) => {
      processCaseStudyByImageId(options, item.caseStudy, item.imageNumber);
    });
  }
}

function processCaseStudyByImageId(
  options: OptionValues,
  caseStudy: any,
  imageNumber: number
) {
  fetchImage(
    `https://www.teamdesk.net/secure/api/v2/79298/Case Study/image${imageNumber}/attachment?key=${caseStudy.case_study_id}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer D6C37959547F4F4ABB12A25D4BF09C9A",
      },
    }
  )
    .then((response) => {
      return response.buffer();
    })
    .then((arrayBuffer) => {
      if (arrayBuffer.includes(0)) {
        client
          .getSpace(options.spaceId)
          .then((space) => space.getEnvironment(options.environment))
          .then(async (environment) => {
            const query = {
              "fields.title": `${
                caseStudy.case_study_id
              }-${caseStudy.Application.replace(
                / /g,
                "-"
              ).toLowerCase()}-image-${imageNumber}`,
            };
            const assets = await environment.getAssets(query);

            if (assets.items.length > 0) {
              environment
                .getAsset(assets.items[0].sys.id)
                .then((asset) => asset.unpublish())
                .then((asset) => asset.delete());
              console.log("Asset already existed, asset deleted");
            }

            return environment;
          })
          .then((environment) =>
            environment.createAssetFromFiles({
              fields: {
                title: {
                  en: `${
                    caseStudy.case_study_id
                  }-${caseStudy.Application.replace(
                    / /g,
                    "-"
                  ).toLowerCase()}-image-${imageNumber}`,
                },
                description: {
                  en: "-",
                },
                file: {
                  en: {
                    contentType: "image/jpeg",
                    fileName: `image-${imageNumber}-${caseStudy.case_study_id}.jpg`,
                    file: arrayBuffer,
                  },
                },
              },
            })
          )
          .then((asset) => asset.processForAllLocales())
          .then((asset) =>
            asset
              .publish()
              .then((asset) => {
                console.log(
                  `(${imageNumber}) case study: ${caseStudy.case_study_id} - asset: ${asset.sys.id}`
                );
                return new Promise((resolve) => {
                  setTimeout(() => {
                    resolve(asset);
                  }, 1000);
                });
              })
              .then((asset) =>
                updateCaseStudyEntry(options, asset, caseStudy, imageNumber)
              )
          )
          .catch(console.error);
      }
    });
}

function updateCaseStudyEntry(
  options: OptionValues,
  asset: any,
  caseStudy: any,
  imageNumber: number
) {
  client
    .getSpace(options.spaceId)
    .then((space) => space.getEnvironment(options.environment))
    .then(async (environment) => {
      const entries = await environment.getEntries({
        "sys.id": `casestudy-${caseStudy.case_study_id}`,
      });

      if (entries.items.length > 0) {
        const entry = entries.items[0];
        if (entry) {
            entry.fields = Object.assign({}, entry.fields, {
              images: {
                  en: [
                      ...(imageNumber > 1 ? entry.fields.images?.en ?? [] : []),
                      {
                          sys: {
                              type: "Link",
                              linkType: "Asset",
                              id: asset.sys.id,
                          },
                      },
                  ],
              },
          });
          if (!entry.isArchived()) {
            try {
              const updatedEntry = await entry.update();
              await updatedEntry
                .publish()
                .then(() => {
                  console.log("Asset published");
                })
                .catch((error: any) => {
                  console.log("Error occurred while publishing asset:", error);
                });
              console.log(`entry ${entry.sys?.id} updated`);
            } catch (e) {
              console.log("Error occurred while publishing asset:", e);
            }
          } else {
            console.log(`entry ${entry.sys?.id} is not published`);
          }
        }
      }
    });
}
