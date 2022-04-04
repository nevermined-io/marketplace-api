export const serviceExample = [
  {
    index: 0,
    service: 'SecretStore',
    serviceEndpoint: 'http://localhost:12001',
    type: 'authorization',
  },
  {
    index: 1,
    purchaseEndpoint: 'http://localhost:8030/api/v1/gateway/services/access/initialize',
    serviceEndpoint: 'http://localhost:8030/api/v1/gateway/services/consume',
    type: 'access',
  },
  {
    attributes: {
      additionalInformation: {
        copyrightHolder: 'Met Office',
        description: 'Weather information of UK including temperature and humidity',
        inLanguage: 'en',
        links: [
          {
            name: 'Sample of Asset Data',
            type: 'sample',
            url: 'https://foo.com/sample.csv',
          },
        ],
        tags: ['weather', 'uk', '2011', 'temperature', 'humidity'],
        workExample:
          'stationId,latitude,longitude,datetime, ' +
          'temperature,humidity/n423432fsd,51.509865,-0.118092, 2011-01-01T10:55:11+00:00,7.2,68',
      },
      curation: {
        numVotes: 123,
        rating: 0.93,
        schema: 'Binary Voting',
      },
      main: {
        author: 'Met Office',
        dateCreated: '2012-02-01T10:55:11Z',
        encryptedFiles: '0x098213xzckasdf089723hjgdasfkjgasfv',
        files: [
          {
            compression: 'zip',
            contentLength: 4535431,
            contentType: 'text/csv',
            encoding: 'UTF-8',
            index: 0,
            resourceId: 'access-log2018-02-13-15-17-29-18386C502CAEA932',
          },
        ],
        license: 'CC-BY',
        name: 'UK Weather information 2011',
        price: 10,
        type: 'dataset',
      },
    },
    index: 2,
    serviceEndpoint:
      'http://mymetadata.org/api/v1/provider/assets/metadata/' +
      'did:nv:0c184915b07b44c888d468be85a9b28253e80070e5294b1aaed81c2f0264e430',
    type: 'metadata',
  },
];
