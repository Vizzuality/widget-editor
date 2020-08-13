/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const fetch = require('node-fetch');

const migrations = require('../../migrations');

module.exports = {
  createAPIService({ url, applications, env, token, version }) {
    return {
      baseUrl: `${url}`,
      query: `app=${applications}&env=${env}`,
      token,
      script: migrations.find(migration => migration.version === version)
    };
  },

  async getWidgetsToMigrate(apiService) {
    const res = await fetch(`${apiService.baseUrl}/widget?${apiService.query}&page[size]=999999&time=${+(new Date())}`);
    const { data } = await res.json();
    return data.filter(widget => apiService.script.needsMigration(widget));
  },

  async performDryRunMigration(apiService, progress) {
    const widgets = [...progress.remaining];
    for (const widget of widgets) {
      await apiService.script.migrate(widget);
      progress.migrated.push(widget);
      progress.remaining.shift();
    }
  },

  async performMigration(apiService, progress) {
    const widgets = [...progress.remaining];
    for (const widget of widgets) {
      const newWidget = await apiService.script.migrate(widget);
      const body = {
        widget: {
          widgetConfig: newWidget.attributes.widgetConfig
        }
      };

      const res = await fetch(`${apiService.baseUrl}/dataset/${widget.attributes.dataset}/widget/${widget.id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiService.token}`
        }
      });

      if (!res.ok) {
        throw new Error(`${res.url} - ${res.status} (${res.statusText})`);
      }

      const data = await res.json();
      if (data.errors) {
        throw new Error(`${res.url} - ${data.errors[0].detail}`);
      }

      progress.migrated.push(widget);
      progress.remaining.shift();
    }
  }
};
