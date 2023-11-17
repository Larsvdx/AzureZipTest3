import { createClient } from "contentful-management";
import { OptionValues } from "commander";
import { ContentfulDeletedMapperService } from "../services/contentfulDeletedMapperService";
import { DifferenceInterface } from "../../shared/models/general";

export async function archiveContent(
  options: OptionValues,
  input: { endpoint: string; diff: DifferenceInterface; teamDeskData: any[] }[],
) {
  const { spaceId, environment, apiKey } = options;

  const importService = new ContentfulDeletedMapperService(
    spaceId,
    environment,
  );
  const data = importService.map(input);

  await archiveEntries(spaceId, environment, apiKey, data.entries);
}

async function archiveEntries(
  spaceId: string,
  environmentId: string,
  apiKey: string,
  entries: any,
): Promise<void> {
  const client = createClient({
    accessToken: apiKey,
  });

  for (const item of entries) {
    try {
      const space = await client.getSpace(spaceId);
      const environment = await space.getEnvironment(environmentId);
      const entry = await environment.getEntry(item.sys.id);

      const unpublished = await entry.unpublish();
      unpublished.archive();
      console.log(`Entry ${entry.sys.id} archived.`);
    } catch (error) {
      console.error(error);
    }
  }
}
