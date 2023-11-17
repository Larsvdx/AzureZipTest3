import { Form } from '../../teamdesk/models/form';
import { ContentfulMapper } from "./base/contentful.mapper";

export class FormMapper {
    private spaceId: string;
    private environment: string;

    constructor(spaceId: string, environment: string) {
        this.spaceId = spaceId;
        this.environment = environment;
    }

    map(form: Form): any {
        return ContentfulMapper
            .createContentModelBase(this.spaceId, this.environment, 'form', form.code_id)
            .addFields({
                "name": {
                    "en": form['code description']
                }
            })
            .build();
    }
}
