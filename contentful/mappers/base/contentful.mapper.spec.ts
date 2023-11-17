import {ContentfulMapper} from "./contentful.mapper";

describe("ContentfulFormat", () => {
    describe('createContentModelBase', () => {
        it('should create a content model base', () => {
            const contentModelBase = ContentfulMapper
                .createContentModelBase('spaceId', 'environment', 'contentModel', 'id').build();
            expect(contentModelBase).toBeUndefined();
        });
    });
});
