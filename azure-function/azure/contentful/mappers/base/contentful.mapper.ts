import { generateContentfulId, kebabToCamel } from '../../../util/contentful.util';
import { ContentModel } from "../../models/content-model";

export class ContentfulMapper {
    private readonly spaceId: string;
    private readonly environment: string;
    private contentModel: ContentModel;
    constructor(spaceId: string, environment: string, entry: ContentModel) {
        this.spaceId = spaceId;
        this.environment = environment;
        this.contentModel = entry;
    }

    static createContentModelBase(spaceId: string, environment: string, contentModel: string, id: string | number): ContentfulMapper {
        const contentModelBase = {
            metadata: {
                tags: []
            },
            sys: {
                space: {
                    sys: {
                        type: 'Link',
                        linkType: 'Space',
                        id: spaceId
                    }
                },
                id: generateContentfulId(contentModel, id),
                type: 'Entry',
                createdAt: new Date().toUTCString(),
                updatedAt: new Date().toUTCString(),
                environment: {
                    sys: {
                        id: environment,
                        type: 'Link',
                        linkType: 'Environment'
                    }
                },
                revision: 1,
                contentType: {
                    sys: {
                        type: 'Link',
                        linkType: 'ContentType',
                        id: kebabToCamel(contentModel)
                    }
                }
            },
            fields: {}
        }

        return new ContentfulMapper(spaceId, environment, contentModelBase);
    }

    addFields(fields: any): ContentfulMapper {
        this.contentModel.fields = fields;

        return this;
    }

    build(): ContentModel {
        return this.contentModel;
    }
}
