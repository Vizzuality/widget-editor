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
    let widgets = [];
    let stopped = false;
    let page = 1;
    // Run through each widget page untill we run out of widgets 
    while (!stopped) {
      const res = await fetch(`${apiService.baseUrl}/widget?${apiService.query}&page[size]=500&page[number]=${page}&time=${+(new Date())}`);
      const { data, meta } = await res.json();
      widgets = [
        ...widgets,
        ...data.filter(widget => apiService.script.needsMigration(widget))
      ]
      page += 1
      stopped = data.length === 0 || page === meta['total-pages'];
    }
    return widgets;
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
