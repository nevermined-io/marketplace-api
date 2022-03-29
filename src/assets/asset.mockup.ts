export const asset = {
  '@context': 'https://w3id.org/did/v1',
  id: 'did:nv:0c184915b07b44c888d468be85a9b28253e80070e5294b1aaed81c2f0264e429',
  created: new Date().toDateString(),
  authentication: [
    {
      publicKey: 'did:nv:0c184915b07b44c888d468be85a9b28253e80070e5294b1aaed81c2f0264e430',
      type: 'RsaSignatureAuthentication2018',
    },
  ],
  proof: {
    created: '2022-01-08T16:02:20Z',
    creator: '2022-01-08T16:02:20Z',
    signatureValue:
      '0xbd7b46b3ac664167bc70ac211b1a1da0baed9ead91613a5f02dfc25c1bb' +
      '6e3ff40861b455017e8a587fd4e37b703436072598c3a81ec88be28bfe33b61554a471b',
    type: 'DDOIntegritySignature',
  },
  publicKey: [
    {
      id: 'did:nv:0c184915b07b44c888d468be85a9b28253e80070e5294b1aaed81c2f0264e430',
      owner: '0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e',
      type: 'EthereumECDSAKey',
    },
  ],
  service: [
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
              contentLength: '4535431',
              contentType: 'text/csv',
              encoding: 'UTF-8',
              index: 0,
              resourceId: 'access-log2018-02-13-15-17-29-18386C502CAEA932',
            },
          ],
          license: 'CC-BY',
          name: 'UK Weather information 2011',
          price: '10',
          type: 'dataset',
        },
      },
      index: 2,
      serviceEndpoint:
        'http://mymetadata.org/api/v1/provider/assets/metadata/' +
        'did:nv:0c184915b07b44c888d468be85a9b28253e80070e5294b1aaed81c2f0264e430',
      type: 'metadata',
    },
  ],
};
