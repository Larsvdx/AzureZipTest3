import { Producer } from "../../teamdesk/models/producer";
import { ContentfulMapper } from "./base/contentful.mapper";

export class ProducerMapper {
  private spaceId: string;
  private environment: string;

  constructor(spaceId: string, environment: string) {
    this.spaceId = spaceId;
    this.environment = environment;
  }

  map(producer: Producer): any {
    return ContentfulMapper.createContentModelBase(
      this.spaceId,
      this.environment,
      "producer",
      producer.producer_id,
    )
      .addFields({
        name: {
          en: producer.Producer,
        },
      })
      .build();
  }
}
