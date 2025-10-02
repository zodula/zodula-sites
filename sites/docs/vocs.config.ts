import { defineConfig } from 'vocs'

export default defineConfig({
  title: 'Zodula Documentation',
  description: 'Modern full-stack framework for building business applications',
  sidebar: [
    {
      text: 'Getting Started',
      link: '/getting-started',
    },
    {
      text: 'Create App',
      link: '/create-app',
    },
        {
          text: 'Core Concepts',
          items: [
            {
              text: 'Doctypes',
              link: '/core/doctypes',
            },
            {
              text: 'Field Types',
              link: '/core/field-types',
            },
            {
              text: 'Actions',
              link: '/core/actions',
            },
          ],
        },
    {
      text: 'CLI Commands',
      items: [
        {
          text: 'scaffold',
          link: '/cli/scaffold',
        },
        {
          text: 'dev',
          link: '/cli/dev',
        },
        {
          text: 'prepare',
          link: '/cli/prepare',
        },
        {
          text: 'migrate',
          link: '/cli/migrate',
        },
        {
          text: 'generate',
          link: '/cli/generate',
        },
        {
          text: 'build',
          link: '/cli/build',
        },
        {
          text: 'backup',
          link: '/cli/backup',
        },
        {
          text: 'restore',
          link: '/cli/restore',
        },
        {
          text: 'push',
          link: '/cli/push',
        },
        {
          text: 'install-app',
          link: '/cli/install-app',
        },
        {
          text: 'admin',
          link: '/cli/admin',
        },
      ],
    },
    {
      text: 'API Reference',
      link: '/api-reference',
    },
  ],
})
