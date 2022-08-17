document.addEventListener('pageScriptsLoaded', (e) => {
  Highcharts.chart('container', {
    title: {
      text: 'CMS churn'
    },
    accessibility: {
      point: {
        valueDescriptionFormat: '{index}. From {point.from} to {point.to}: {point.weight}.'
      }
    },
    series: [{
        keys: ['from', 'to', 'weight'],
        data: [
          [
              "Joomla",
              "WordPress",
              2832
          ],
          [
              "Drupal",
              "WordPress",
              2180
          ],
          [
              "Wix",
              "WordPress",
              789
          ],
          [
              "Squarespace",
              "WordPress",
              628
          ],
          [
              "WordPress",
              "Drupal",
              624
          ],
          [
              "WordPress",
              "Wix",
              559
          ],
          [
              "WordPress",
              "Squarespace",
              550
          ],
          [
              "TYPO3 CMS",
              "WordPress",
              459
          ],
          [
              "WordPress",
              "Joomla",
              285
          ],
          [
              "DNN",
              "WordPress",
              214
          ],
          [
              "WordPress",
              "Duda",
              206
          ],
          [
              "WordPress",
              "Craft CMS",
              186
          ],
          [
              "WordPress",
              "1C-Bitrix",
              179
          ],
          [
              "Duda",
              "WordPress",
              163
          ],
          [
              "WordPress",
              "Tilda",
              159
          ],
          [
              "GoDaddy Website Builder",
              "WordPress",
              155
          ],
          [
              "WordPress",
              "TYPO3 CMS",
              141
          ],
          [
              "Weebly",
              "WordPress",
              137
          ],
          [
              "WebsPlanet",
              "Mono.net",
              136
          ],
          [
              "WordPress",
              "Contentful",
              130
          ],
          [
              "1C-Bitrix",
              "WordPress",
              129
          ],
          [
              "Joomla",
              "Drupal",
              118
          ],
          [
              "Drupal",
              "Brightspot",
              118
          ],
          [
              "Drupal",
              "Adobe Experience Manager",
              115
          ],
          [
              "Craft CMS",
              "WordPress",
              107
          ],
          [
              "WordPress",
              "Adobe Experience Manager",
              107
          ],
          [
              "Microsoft SharePoint",
              "WordPress",
              106
          ],
          [
              "Squarespace",
              "Wix",
              99
          ],
          [
              "Joomla",
              "1C-Bitrix",
              96
          ],
          [
              "WebsPlanet",
              "Duda",
              95
          ],
          [
              "SilverStripe",
              "WordPress",
              92
          ],
          [
              "Business Catalyst",
              "WordPress",
              91
          ],
          [
              "Jimdo",
              "WordPress",
              86
          ],
          [
              "WordPress",
              "October CMS",
              85
          ],
          [
              "Kentico CMS",
              "WordPress",
              83
          ],
          [
              "Wix",
              "Squarespace",
              79
          ],
          [
              "Sitefinity",
              "WordPress",
              76
          ],
          [
              "Tilda",
              "WordPress",
              73
          ],
          [
              "Contao",
              "WordPress",
              68
          ],
          [
              "DataLife Engine",
              "WordPress",
              66
          ],
          [
              "WordPress",
              "Odoo",
              66
          ],
          [
              "WordPress",
              "GoDaddy Website Builder",
              65
          ],
          [
              "Drupal",
              "Contentful",
              64
          ],
          [
              "Liferay",
              "WordPress",
              62
          ],
          [
              "Mono.net",
              "Wix",
              61
          ],
          [
              "MODX",
              "WordPress",
              58
          ],
          [
              "SPIP",
              "WordPress",
              57
          ],
          [
              "1C-Bitrix",
              "Tilda",
              57
          ],
          [
              "WordPress",
              "Sitecore",
              56
          ],
          [
              "TYPO3 CMS",
              "Drupal",
              54
          ],
          [
              "Microsoft SharePoint",
              "Drupal",
              52
          ],
          [
              "Drupal",
              "1C-Bitrix",
              51
          ]
        ],
        type: 'dependencywheel',
        name: 'CMS churn',
        dataLabels: {
            color: '#333',
            textPath: {
                enabled: true,
                attributes: {
                    dy: 5
                }
            },
            distance: 10
        },
        size: '95%'
    }]
  });
});
