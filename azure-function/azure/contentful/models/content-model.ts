export interface ContentModel {
    metadata: {
        tags: any[]; // This could be a more specific type if desired
    };
    sys: {
        space: {
            sys: {
                type: string;
                linkType: string;
                id: string;
            };
        };
        id: string;
        type: string;
        createdAt: string;
        updatedAt: string;
        environment: {
            sys: {
                id: string;
                type: string;
                linkType: string;
            };
        };
        revision: number;
        contentType: {
            sys: {
                type: string;
                linkType: string;
                id: string;
            };
        };
    };
    fields?: any;
}
