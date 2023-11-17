const fetch = require('node-fetch');

export class TeamDeskHttpService {
  private readonly apiToken: string;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
  }

  async getTeamDeskData(url: string): Promise<unknown> {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    });
    return await response.json();
  }
}
