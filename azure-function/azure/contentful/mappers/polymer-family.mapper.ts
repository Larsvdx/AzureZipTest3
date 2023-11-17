import { PolymerFamily } from "../../teamdesk/models/polymer-family";
import { ContentfulMapper } from "./base/contentful.mapper";

export class PolymerFamilyMapper {
  private spaceId: string;
  private environment: string;

  constructor(spaceId: string, environment: string) {
    this.spaceId = spaceId;
    this.environment = environment;
  }

  map(family: PolymerFamily): any {
    return ContentfulMapper.createContentModelBase(
      this.spaceId,
      this.environment,
      "polymer-family",
      family.polymer_family_id,
    )
      .addFields({
        name: {
          en: family["Polymer Family"],
        },
      })
      .build();
  }
}
