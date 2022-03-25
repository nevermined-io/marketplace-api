export const asset = {
  '@context': 'https://w3id.org/did/v1',
  id: 'did:nv:0c184915b07b44c888d468be85a9b28253e80070e5294b1aaed81c2f0264e429',
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

export const assetAccess = {
  '@context': 'https://w3id.org/did/v1',
  authentication: [
    {
      publicKey: 'did:nv:3b5607872397a527cd69e41743b07ddbeeb8aa865f3decd1fab4be679e6c6eef',
      type: 'RsaSignatureAuthentication2018',
    },
  ],
  created: '2020-09-03T13:31:02Z',
  id: 'did:nv:3b5607872397a527cd69e41743b07ddbeeb8aa865f3decd1fab4be679e6c6eef',
  proof: {
    checksum: {
      '0': 'e8cf331dc623f4c470698fea8eec786f5e77850e9b5119bbe1eef3f1fc3fa8a5',
      '1': 'e4ac07c241b4a113e1ad6ef046b8fdf61c5e2c6e6a1745d352f8f30ffa84d704',
      '2': 'f6c642676664b242efb5417d49728fb05a8ca998494156409c66dafcdbbb2a2a',
      '3': '9f2faa3d43dc5a1b093911125678a77b2d1dbd78746a2ba277f25b9695eb4ebd',
    },
    created: '2020-09-03T13:31:02Z',
    creator: '0xA99D43d86A0758d5632313b8fA3972B6088A21BB',
    signatureValue:
      '0xe9e3bf87a7659c7eaa1b1ee0c140abd9faeba3543f9943c836fbbbc4088609c74b8' +
      '9e9db74e164797361e708090e85e351809539f528451b5b672e3ab8b40f0b1b',
    type: 'DDOIntegritySignature',
  },
  publicKey: [
    {
      id: '0xA99D43d86A0758d5632313b8fA3972B6088A21BB',
      owner: '0xA99D43d86A0758d5632313b8fA3972B6088A21BB',
      type: 'EthereumECDSAKey',
    },
  ],
  service: [
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
            {
              name: 'Data Format Definition',
              type: 'format',
              url: 'https://foo.com/sampl2.csv',
            },
          ],
          tags: ['weather', 'uk', '2011', 'temperature', 'humidity'],
          workExample: '423432fsd,51.509865,-0.118092,2011-01-01T10:55:11+00:00,7.2,68',
        },
        curation: {
          rating: 0,
          numVotes: 0,
          isListed: true,
        },
        encryptedFiles:
          '0x754c42427249666b6774504a6f4a317a314a4a5576394956472b572b6e4e5346785632416545597' +
          'a4d52797937376e4b633065416255512f4f6c43307465654d617a795731326f486f77614758363357' +
          '30736170716e656b6f557453373939452f784352306e376652566c4853726339384e42596e5245546' +
          '2726561586379734f3571764a4661786d364a42596944645269794b4b51717865374f3978554c7734' +
          '6753675475504e73345269377a6a657968354d50666e4f39725554527a57582f4370644e454233534' +
          'a415a737a35366a72735869704f597a594476765855645536386a6457746d576c52684e654f4a486b' +
          '664978545767324b6d774b535242775a746a4f355371354e75486848614c666c4b394c6555644d535' +
          '87743435154665032435466314a5171783956506e78325646325152346c752b6a4368665533703231' +
          '593875536370785a4c366536474152766d4562737a614f7a71386c6869726f6a3662797a714e75317' +
          '4726b322b76766e70494262695630416e2b615832|0x7c44d4bb6169f6eee3686135fbe2d00947b01' +
          '0dd1763ca963899c7f418713c7c8b003e3e38d07090a2f551dab568a08121754d32a751c0b6bf7bc8' +
          'c0e561589353ab728a670271cb4a6d1912beb876044a6e343bc65af4ddc30af9f71eb236990299634' +
          'b6680b84d3b90efe962825ae72b809c02464bb23799b8cd12ad90d235',
        main: {
          author: 'Met Office',
          dateCreated: '2020-09-03T13:31:01Z',
          datePublished: '2019-02-08T08:13:49Z',
          files: [
            {
              url:
                'https://raw.githubusercontent.com/tbertinmahieux/MSongsDB/' +
                'master/Tasks_Demos/CoverSongs/shs_dataset_test.txt',
              checksum: 'efb2c764274b745f5fc37f97c6b0e761',
              compression: 'zip',
              contentLength: '4535431',
              contentType: 'text/csv',
              encoding: 'UTF-8',
              index: 0,
            },
          ],
          license: 'CC-BY',
          name: 'UK Weather information 2011',
          price: '1',
          type: 'dataset',
        },
      },
      index: 0,
      serviceEndpoint:
        'http://172.15.0.15:5000/api/v1/metadata/assets/ddo/' +
        'did:nv:3b5607872397a527cd69e41743b07ddbeeb8aa865f3decd1fab4be679e6c6eef',
      immutableServiceEndpoint: 'cid://QmVT3wfySvZJqAvkBCyxoz3EvD3yeLqf3cvAssFDpFFXNm',
      type: 'metadata',
    },
    {
      attributes: {
        additionalInformation: {
          links: [],
        },
        main: {
          files: [],
          service: 'provenance',
        },
      },
      index: 1,
      serviceEndpoint:
        'http://172.15.0.15:5000/api/v1/metadata/assets/ddo/' +
        'did:nv:3b5607872397a527cd69e41743b07ddbeeb8aa865f3decd1fab4be679e6c6eef',
      type: 'provenance',
    },
    {
      attributes: {
        additionalInformation: {
          links: [],
        },
        main: {
          files: [],
          publicKey:
            'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC2qIisJyMd6YXJNzs23zKLajtPC7w6aO9mXq+' +
            'Ukr6d3cVmPCx8XJRTT3IV7PmHb3o4XFc8ZGX5/SSg7tp5/cfAIg9XF13yjssJttaDTa4srhLJvx' +
            'yjR8cHEJ39GevFTgrtbYzXTZ723ROJP4NEDxtp8a0f5l7W3NTH8v39k3G50QIDAQAB',
          service: 'PSK-RSA',
        },
      },
      index: 2,
      serviceEndpoint: 'http://localhost:8030',
      type: 'authorization',
    },
    {
      attributes: {
        additionalInformation: {
          links: [],
        },
        main: {
          creator: '0xA99D43d86A0758d5632313b8fA3972B6088A21BB',
          datePublished: '2020-09-03T13:31:02Z',
          files: [],
          name: 'dataAssetAccessServiceAgreement',
          price: '1',
        },
        serviceAgreementTemplate: {
          conditionDependency: {
            access: [],
            escrowPayment: ['lockPayment', 'access'],
            execCompute: [],
            lockPayment: [],
          },
          conditions: [
            {
              contractName: 'LockPaymentCondition',
              events: [
                {
                  actorType: 'publisher',
                  handler: {
                    functionName: 'fulfillAccessCondition',
                    moduleName: 'lockPaymentConditon',
                    version: '0.1',
                  },
                  name: 'Fulfilled',
                },
              ],
              functionName: 'fulfill',
              name: 'lockPayment',
              parameters: [
                {
                  name: '_did',
                  type: 'bytes32',
                  value: '',
                },
                {
                  name: '_rewardAddress',
                  type: 'address',
                  value: '0x886dE2b3F8F27eEd43bA2FD4bC2AabDc14E0d9dD',
                },
                {
                  name: '_tokenAddress',
                  type: 'address',
                  value: '0x0',
                },
                {
                  name: '_amounts',
                  type: 'uint256[]',
                  value: ['10', '2'],
                },
                {
                  name: '_receivers',
                  type: 'address[]',
                  value: ['0xa99d43d86a0758d5632313b8fa3972b6088a21bb', '0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0'],
                },
              ],
              timelock: 0,
              timeout: 0,
            },
            {
              contractName: 'AccessCondition',
              events: [
                {
                  actorType: 'publisher',
                  handler: {
                    functionName: 'fulfillEscrowPaymentCondition',
                    moduleName: 'access',
                    version: '0.1',
                  },
                  name: 'Fulfilled',
                },
                {
                  actorType: 'consumer',
                  handler: {
                    functionName: 'fulfillEscrowPaymentCondition',
                    moduleName: 'access',
                    version: '0.1',
                  },
                  name: 'TimedOut',
                },
              ],
              functionName: 'fulfill',
              name: 'access',
              parameters: [
                {
                  name: '_did',
                  type: 'bytes32',
                  value: '3b5607872397a527cd69e41743b07ddbeeb8aa865f3decd1fab4be679e6c6eef',
                },
                {
                  name: '_grantee',
                  type: 'address',
                  value: '',
                },
              ],
              timelock: 0,
              timeout: 0,
            },
            {
              contractName: 'EscrowPaymentCondition',
              events: [
                {
                  actorType: 'publisher',
                  handler: {
                    functionName: 'verifyRewardTokens',
                    moduleName: 'escrowPaymentConditon',
                    version: '0.1',
                  },
                  name: 'Fulfilled',
                },
              ],
              functionName: 'fulfill',
              name: 'escrowPayment',
              parameters: [
                {
                  name: '_did',
                  type: 'bytes32',
                  value: '',
                },
                {
                  name: '_amounts',
                  type: 'uint256[]',
                  value: ['10', '2'],
                },
                {
                  name: '_receivers',
                  type: 'address[]',
                  value: ['0xa99d43d86a0758d5632313b8fa3972b6088a21bb', '0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0'],
                },
                {
                  name: '_sender',
                  type: 'address',
                  value: '',
                },
                {
                  name: '_tokenAddress',
                  type: 'address',
                  value: '0x0',
                },
                {
                  name: '_lockCondition',
                  type: 'bytes32',
                  value: '0xBDB91cF0a8449a2848Ba6194eE45579E81B1A0F9',
                },
                {
                  name: '_releaseCondition',
                  type: 'bytes32',
                  value: '0xFF3a12191A703939b1466eC1Fc7679AbbFf88545',
                },
              ],
              timelock: 0,
              timeout: 0,
            },
          ],
          contractName: 'EscrowAccessSecretStoreTemplate',
          events: [
            {
              actorType: 'consumer',
              handler: {
                functionName: 'fulfillLockPaymentCondition',
                moduleName: 'escrowAccessSecretStoreTemplate',
                version: '0.1',
              },
              name: 'AgreementCreated',
            },
          ],
          fulfillmentOrder: ['lockPayment.fulfill', 'access.fulfill', 'escrowPayment.fulfill'],
        },
      },
      index: 3,
      serviceEndpoint: 'http://localhost:8030/api/v1/gateway/services/access',
      templateId: '0xB4d05b7D929dD241b79e06FF1AeA033159693931',
      type: 'access',
    },
  ],
  updated: '2020-09-03T13:31:02Z',
};

export const assetAlgorithm = {
  '@context': 'https://w3id.org/did/v1',
  authentication: [
    {
      type: 'RsaSignatureAuthentication2018',
      publicKey: 'did:nv:0ebed8226ada17fde24b6bf2b95d27f8f05fcce09139ff5cec31f6d81a7cd2ea',
    },
  ],
  created: '2019-02-08T08:13:49Z',
  id: 'did:nv:0bc278fee025464f8012b811d1bce8e22094d0984e4e49139df5d5ff7a028bdf',
  proof: {
    created: '2019-02-08T08:13:41Z',
    creator: '0x37BB53e3d293494DE59fBe1FF78500423dcFd43B',
    signatureValue: 'did:nv:0bc278fee025464f8012b811d1bce8e22094d0984e4e49139df5d5ff7a028bdf',
    type: 'DDOIntegritySignature',
    checksum: {
      '0': '0x52b5c93b82dd9e7ecc3d9fdf4755f7f69a54484941897dc517b4adfe3bbc3377',
      '1': '0x999999952b5c93b82dd9e7ecc3d9fdf4755f7f69a54484941897dc517b4adfe3',
      '2': 'f6c642676664b242efb5417d49728fb05a8ca998494156409c66dafcdbbb2a2a',
      '3': '9f2faa3d43dc5a1b093911125678a77b2d1dbd78746a2ba277f25b9695eb4ebd',
    },
  },
  publicKey: [
    {
      id: 'did:nv:b6e2eb5eff1a093ced9826315d5a4ef6c5b5c8bd3c49890ee284231d7e1d0aaa#keys-1',
      type: 'RsaVerificationKey2018',
      owner: 'did:nv:6027c1e7cbae06a91fce0557ee53195284825f56a7100be0c53cbf4391aa26cc',
      publicKeyPem: '-----BEGIN PUBLIC KEY...END PUBLIC KEY-----\r\n',
    },
    {
      id: 'did:nv:b6e2eb5eff1a093ced9826315d5a4ef6c5b5c8bd3c49890ee284231d7e1d0aaa#keys-2',
      type: 'Ed25519VerificationKey2018',
      owner: 'did:nv:4c27a254e607cdf91a1206480e7eb8c74856102316c1a462277d4f21c02373b6',
      publicKeyBase58: 'H3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV',
    },
    {
      id: 'did:nv:b6e2eb5eff1a093ced9826315d5a4ef6c5b5c8bd3c49890ee284231d7e1d0aaa#keys-3',
      type: 'RsaPublicKeyExchangeKey2018',
      owner: 'did:nv:5f6b885202ffb9643874be529302eb00d55e226959f1fbacaeda592c5b5c9484',
      publicKeyPem: '-----BEGIN PUBLIC KEY...END PUBLIC KEY-----\r\n',
    },
  ],
  verifiableCredential: [
    {
      '@context': ['https://www.w3.org/2018/credentials/v1', 'https://www.w3.org/2018/credentials/examples/v1'],
      id: '1872',
      type: ['read', 'update', 'deactivate'],
      issuer: '0x610D9314EDF2ced7681BA1633C33fdb8cF365a12',
      issuanceDate: '2019-01-01T19:73:24Z',
      credentialSubject: {
        id: '0x89328493849328493284932',
      },
      proof: {
        type: 'RsaSignature2018',
        created: '2019-01-01T19:73:24Z',
        proofPurpose: 'assertionMethod',
        signatureValue: 'ABCJSDAO23...1tzjn4w==',
      },
    },
  ],
  service: [
    {
      index: 0,
      serviceEndpoint: 'http://localhost:5000/api/v1/metadata/assets/ddo/{did}',
      immutableServiceEndpoint: 'cid://QmVT3wfySvZJqAvkBCyxoz3EvD3yeLqf3cvAssFDpFFXNm',
      type: 'metadata',
      attributes: {
        main: {
          author: 'John Doe',
          checksum: '0x52b5c93b82dd9e7ecc3d9fdf4755f7f69a54484941897dc517b4adfe3bbc3377',
          dateCreated: '2019-02-08T08:13:49Z',
          license: 'CC-BY',
          name: 'Word count script',
          price: '0',
          files: [
            {
              index: 0,
              contentType: 'text/text',
              checksum: '52b5c93b82dd9e7ecc3d9fdf4755f7f69a544',
              checksumType: 'MD5',
              contentLength: '12057507',
              url:
                'https://raw.githubusercontent.com/keyko-io/nevermined-docs/' +
                'a46795b19ba61b240ff9dd403d88b069c0b51592/resources/word_count.py',
            },
          ],
          type: 'algorithm',
          algorithm: {
            language: 'python',
            format: 'py',
            version: '0.1',
            entrypoint: 'python word_count.py*',
            requirements: {
              container: {
                image: 'python',
                tag: '3.8-alpine',
                checksum: 'sha256:53ad3a03b2fb240b6c494339821e6638cd44c989bcf26ec4d51a6a52f7518c1d',
              },
            },
          },
        },
        additionalInformation: {
          description: 'script to calculate word count',
          tags: ['word', 'count', 'python', 'workflow', 'aggregation'],
          copyrightHolder: 'John Doe',
        },
      },
    },
    {
      attributes: {
        additionalInformation: {
          links: [],
        },
        main: {
          files: [],
          service: 'provenance',
        },
      },
      index: 1,
      serviceEndpoint:
        'http://172.15.0.15:5000/api/v1/metadata/assets/ddo/' +
        'did:nv:3b5607872397a527cd69e41743b07ddbeeb8aa865f3decd1fab4be679e6c6eef',
      type: 'provenance',
    },
    {
      attributes: {
        additionalInformation: {
          links: [],
        },
        main: {
          files: [],
          publicKey:
            'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC2qIisJyMd6YXJNzs23zKLajtPC7w6aO9mXq+Ukr6d3c' +
            'VmPCx8XJRTT3IV7PmHb3o4XFc8ZGX5/SSg7tp5/cfAIg9XF13yjssJttaDTa4srhLJvxyjR8cHEJ39GevF' +
            'TgrtbYzXTZ723ROJP4NEDxtp8a0f5l7W3NTH8v39k3G50QIDAQAB',
          service: 'PSK-RSA',
        },
      },
      index: 2,
      serviceEndpoint: 'http://localhost:8030',
      type: 'authorization',
    },
    {
      attributes: {
        additionalInformation: {
          links: [],
        },
        main: {
          creator: '0xA99D43d86A0758d5632313b8fA3972B6088A21BB',
          datePublished: '2020-09-03T13:31:02Z',
          files: [],
          name: 'dataAssetAccessServiceAgreement',
          price: '1',
        },
        serviceAgreementTemplate: {
          conditionDependency: {
            access: [],
            escrowPayment: ['lockPayment', 'access'],
            execCompute: [],
            lockPayment: [],
          },
          conditions: [
            {
              contractName: 'LockPaymentCondition',
              events: [
                {
                  actorType: 'publisher',
                  handler: {
                    functionName: 'fulfillAccessCondition',
                    moduleName: 'lockPaymentConditon',
                    version: '0.1',
                  },
                  name: 'Fulfilled',
                },
              ],
              functionName: 'fulfill',
              name: 'lockPayment',
              parameters: [
                {
                  name: '_did',
                  type: 'bytes32',
                  value: '',
                },
                {
                  name: '_rewardAddress',
                  type: 'address',
                  value: '0x886dE2b3F8F27eEd43bA2FD4bC2AabDc14E0d9dD',
                },
                {
                  name: '_tokenAddress',
                  type: 'address',
                  value: '0x0',
                },
                {
                  name: '_amounts',
                  type: 'uint256[]',
                  value: ['10', '2'],
                },
                {
                  name: '_receivers',
                  type: 'address[]',
                  value: ['0xa99d43d86a0758d5632313b8fa3972b6088a21bb', '0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0'],
                },
              ],
              timelock: 0,
              timeout: 0,
            },
            {
              contractName: 'AccessCondition',
              events: [
                {
                  actorType: 'publisher',
                  handler: {
                    functionName: 'fulfillEscrowPaymentCondition',
                    moduleName: 'access',
                    version: '0.1',
                  },
                  name: 'Fulfilled',
                },
                {
                  actorType: 'consumer',
                  handler: {
                    functionName: 'fulfillEscrowPaymentCondition',
                    moduleName: 'access',
                    version: '0.1',
                  },
                  name: 'TimedOut',
                },
              ],
              functionName: 'fulfill',
              name: 'access',
              parameters: [
                {
                  name: '_did',
                  type: 'bytes32',
                  value: '3b5607872397a527cd69e41743b07ddbeeb8aa865f3decd1fab4be679e6c6eef',
                },
                {
                  name: '_grantee',
                  type: 'address',
                  value: '',
                },
              ],
              timelock: 0,
              timeout: 0,
            },
            {
              contractName: 'EscrowPaymentCondition',
              events: [
                {
                  actorType: 'publisher',
                  handler: {
                    functionName: 'verifyRewardTokens',
                    moduleName: 'escrowPaymentConditon',
                    version: '0.1',
                  },
                  name: 'Fulfilled',
                },
              ],
              functionName: 'fulfill',
              name: 'escrowPayment',
              parameters: [
                {
                  name: '_did',
                  type: 'bytes32',
                  value: '',
                },
                {
                  name: '_amounts',
                  type: 'uint256[]',
                  value: ['10', '2'],
                },
                {
                  name: '_receivers',
                  type: 'address[]',
                  value: ['0xa99d43d86a0758d5632313b8fa3972b6088a21bb', '0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0'],
                },
                {
                  name: '_sender',
                  type: 'address',
                  value: '',
                },
                {
                  name: '_tokenAddress',
                  type: 'address',
                  value: '0x0',
                },
                {
                  name: '_lockCondition',
                  type: 'bytes32',
                  value: '0xBDB91cF0a8449a2848Ba6194eE45579E81B1A0F9',
                },
                {
                  name: '_releaseCondition',
                  type: 'bytes32',
                  value: '0xFF3a12191A703939b1466eC1Fc7679AbbFf88545',
                },
              ],
              timelock: 0,
              timeout: 0,
            },
          ],
          contractName: 'EscrowAccessSecretStoreTemplate',
          events: [
            {
              actorType: 'consumer',
              handler: {
                functionName: 'fulfillLockPaymentCondition',
                moduleName: 'escrowAccessSecretStoreTemplate',
                version: '0.1',
              },
              name: 'AgreementCreated',
            },
          ],
          fulfillmentOrder: ['lockPayment.fulfill', 'access.fulfill', 'escrowPayment.fulfill'],
        },
      },
      index: 3,
      serviceEndpoint: 'http://localhost:8030/api/v1/gateway/services/access',
      templateId: '0xB4d05b7D929dD241b79e06FF1AeA033159693931',
      type: 'access',
    },
  ],
};

export const assetCompute = {
  '@context': 'https://w3id.org/did/v1',
  authentication: [
    {
      publicKey: 'did:nv:d4c7a013002adfe2cedda8ff771c41f571dfe8a6d1a8d28d30933d5a81ad7794',
      type: 'RsaSignatureAuthentication2018',
    },
  ],
  created: '2020-09-03T13:35:42',
  id: 'did:nv:d4c7a013002adfe2cedda8ff771c41f571dfe8a6d1a8d28d30933d5a81ad7794',
  proof: {
    checksum: {
      '0': 'ca56bda3bb55eeae32ff918b32143333930ca71a0bb3f1c4973a7da4e71abe6e',
      '1': 'e4ac07c241b4a113e1ad6ef046b8fdf61c5e2c6e6a1745d352f8f30ffa84d704',
      '2': 'f6c642676664b242efb5417d49728fb05a8ca998494156409c66dafcdbbb2a2a',
      '4': '55ddd337fc6625b83c57955200e2ad9cc15f8a14676b0b27965acc7a8c420cf5',
    },
    created: '2020-09-03T13:35:42Z',
    creator: '0xA99D43d86A0758d5632313b8fA3972B6088A21BB',
    signatureValue:
      '0x9e16ce1055ea63249112ae61eec03ae653541f037d15fb491f938a0fcbd0a5ed' +
      '686332a9a32dd020088750b01d6ec1a3969e6cccde6c0ceeeb338f44ea0238351b',
    type: 'DDOIntegritySignature',
  },
  publicKey: [
    {
      id: '0xA99D43d86A0758d5632313b8fA3972B6088A21BB',
      owner: '0xA99D43d86A0758d5632313b8fA3972B6088A21BB',
      type: 'EthereumECDSAKey',
    },
  ],
  service: [
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
            {
              name: 'Data Format Definition',
              type: 'format',
              url: 'https://foo.com/sampl2.csv',
            },
          ],
          tags: ['weather', 'uk', '2011', 'temperature', 'humidity'],
          workExample: '423432fsd,51.509865,-0.118092,2011-01-01T10:55:11+00:00,7.2,68',
        },
        curation: {
          rating: 0,
          numVotes: 0,
          isListed: true,
        },
        main: {
          author: 'Met Office',
          dateCreated: '2020-09-03T13:35:42',
          datePublished: '2019-02-08T08:13:49Z',
          files: [
            {
              checksum: 'efb2c764274b745f5fc37f97c6b0e761',
              compression: 'zip',
              contentLength: '4535431',
              contentType: 'text/csv',
              encoding: 'UTF-8',
              index: 0,
            },
          ],
          license: 'CC-BY',
          name: 'UK Weather information 2011',
          price: '1',
          type: 'dataset',
        },
      },
      index: 0,
      serviceEndpoint:
        'http://172.15.0.15:5000/api/v1/metadata/assets/ddo/' +
        'did:nv:d4c7a013002adfe2cedda8ff771c41f571dfe8a6d1a8d28d30933d5a81ad7794',
      immutableServiceEndpoint: 'cid://QmVT3wfySvZJqAvkBCyxoz3EvD3yeLqf3cvAssFDpFFXNm',
      type: 'metadata',
    },
    {
      attributes: {
        additionalInformation: {
          links: [],
        },
        main: {
          files: [],
          service: 'provenance',
        },
      },
      index: 1,
      serviceEndpoint:
        'http://172.15.0.15:5000/api/v1/metadata/assets/ddo/' +
        'did:nv:d4c7a013002adfe2cedda8ff771c41f571dfe8a6d1a8d28d30933d5a81ad7794',
      type: 'provenance',
    },
    {
      attributes: {
        additionalInformation: {
          links: [],
        },
        main: {
          files: [],
          service: 'PSK-RSA',
        },
      },
      index: 2,
      serviceEndpoint: 'http://localhost:8030',
      type: 'authorization',
    },
    {
      attributes: {
        additionalInformation: {
          links: [],
        },
        main: {
          creator: '0xA99D43d86A0758d5632313b8fA3972B6088A21BB',
          datePublished: '2020-09-03T13:35:42Z',
          files: [],
          name: 'dataAssetComputeServiceAgreement',
          price: '1',
          provider: {
            description: '',
            environment: {
              cluster: {
                type: 'Kubernetes',
                url: 'http://10.0.0.17/xxx',
              },
              supportedContainers: [
                {
                  checksum: 'sha256:cb57ecfa6ebbefd8ffc7f75c0f00e57a7fa739578a429b6f72a0df19315deadc',
                  image: 'tensorflow/tensorflow',
                  tag: 'latest',
                },
                {
                  checksum: 'sha256:cb57ecfa6ebbefd8ffc7f75c0f00e57a7fa739578a429b6f72a0df19315deadc',
                  image: 'tensorflow/tensorflow',
                  tag: 'latest',
                },
              ],
              supportedServers: [
                {
                  cpu: '16',
                  disk: '160gb',
                  gpu: '0',
                  maxExecutionTime: 86400,
                  memory: '128gb',
                  price: '50',
                  serverId: '1',
                  serverType: 'xlsize',
                },
                {
                  cpu: '2',
                  disk: '80gb',
                  gpu: '0',
                  maxExecutionTime: 86400,
                  memory: '8gb',
                  price: '10',
                  serverId: '2',
                  serverType: 'medium',
                },
              ],
            },
            type: 'Azure',
          },
        },
        serviceAgreementTemplate: {
          conditionDependency: {
            access: [],
            escrowPayment: ['lockPayment', 'execCompute'],
            execCompute: [],
            lockPayment: [],
          },
          conditions: [
            {
              contractName: 'LockPaymentCondition',
              events: [
                {
                  actorType: 'publisher',
                  handler: {
                    functionName: 'fulfillExecComputeCondition',
                    moduleName: 'lockPaymentConditon',
                    version: '0.1',
                  },
                  name: 'Fulfilled',
                },
              ],
              functionName: 'fulfill',
              name: 'lockPayment',
              parameters: [
                {
                  name: '_did',
                  type: 'bytes32',
                  value: 'd4c7a013002adfe2cedda8ff771c41f571dfe8a6d1a8d28d30933d5a81ad7794',
                },
                {
                  name: '_rewardAddress',
                  type: 'address',
                  value: '0x886dE2b3F8F27eEd43bA2FD4bC2AabDc14E0d9dD',
                },
                {
                  name: '_tokenAddress',
                  type: 'address',
                  value: '0x0',
                },
                {
                  name: '_amounts',
                  type: 'uint256[]',
                  value: ['10', '2'],
                },
                {
                  name: '_receivers',
                  type: 'address[]',
                  value: ['0xa99d43d86a0758d5632313b8fa3972b6088a21bb', '0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0'],
                },
              ],
              timelock: 0,
              timeout: 0,
            },
            {
              contractName: 'ComputeExecutionCondition',
              events: [
                {
                  actorType: 'publisher',
                  handler: {
                    functionName: 'fulfillEscrowPaymentCondition',
                    moduleName: 'access',
                    version: '0.1',
                  },
                  name: 'Fulfilled',
                },
                {
                  actorType: 'consumer',
                  handler: {
                    functionName: 'fulfillEscrowPaymentCondition',
                    moduleName: 'execCompute',
                    version: '0.1',
                  },
                  name: 'TimedOut',
                },
              ],
              functionName: 'fulfill',
              name: 'execCompute',
              parameters: [
                {
                  name: '_did',
                  type: 'bytes32',
                  value: 'd4c7a013002adfe2cedda8ff771c41f571dfe8a6d1a8d28d30933d5a81ad7794',
                },
                {
                  name: '_grantee',
                  type: 'address',
                  value: '',
                },
              ],
              timelock: 0,
              timeout: 0,
            },
            {
              contractName: 'EscrowPaymentCondition',
              events: [
                {
                  actorType: 'publisher',
                  handler: {
                    functionName: 'verifyRewardTokens',
                    moduleName: 'escrowPaymentConditon',
                    version: '0.1',
                  },
                  name: 'Fulfilled',
                },
              ],
              functionName: 'fulfill',
              name: 'escrowPayment',
              parameters: [
                {
                  name: '_did',
                  type: 'bytes32',
                  value: 'd4c7a013002adfe2cedda8ff771c41f571dfe8a6d1a8d28d30933d5a81ad7794',
                },
                {
                  name: '_amounts',
                  type: 'uint256[]',
                  value: ['10', '2'],
                },
                {
                  name: '_receivers',
                  type: 'address[]',
                  value: ['0xa99d43d86a0758d5632313b8fa3972b6088a21bb', '0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0'],
                },
                {
                  name: '_sender',
                  type: 'address',
                  value: '',
                },
                {
                  name: '_tokenAddress',
                  type: 'address',
                  value: '0x0',
                },
                {
                  name: '_lockCondition',
                  type: 'bytes32',
                  value: '0xBDB91cF0a8449a2848Ba6194eE45579E81B1A0F9',
                },
                {
                  name: '_releaseCondition',
                  type: 'bytes32',
                  value: '0xF673Cd200CEa6FAB788979BD475cC595d5894767',
                },
              ],
              timelock: 0,
              timeout: 0,
            },
          ],
          contractName: 'EscrowComputeExecutionTemplate',
          events: [
            {
              actorType: 'consumer',
              handler: {
                functionName: 'fulfillLockPaymentCondition',
                moduleName: 'EscrowComputeExecutionTemplate',
                version: '0.1',
              },
              name: 'AgreementCreated',
            },
          ],
          fulfillmentOrder: ['lockPayment.fulfill', 'execCompute.fulfill', 'escrowPayment.fulfill'],
        },
      },
      index: 4,
      serviceEndpoint: 'http://localhost:8030/api/v1/gateway/services/execute',
      templateId: '0xcD6318Df0dB24E994783bFF2AB73d81F1533c499',
      type: 'compute',
    },
  ],
  updated: '2020-09-03T13:35:42Z',
};

export const assetService = {
  '@context': 'https://w3id.org/did/v1',
  authentication: [
    {
      type: 'RsaSignatureAuthentication2018',
      publicKey: 'did:nv:0ebed8226ada17fde24b6bf2b95d27f8f05fcce09139ff5cec31f6d81a7cd2ea',
    },
  ],
  created: '2019-02-08T08:13:49Z',
  id: 'did:nv:0bc278fee025464f8012b811d1bce8e22094d0984e4e49139df5d5ff7a028bdf',
  proof: {
    created: '2019-02-08T08:13:41Z',
    creator: '0x37BB53e3d293494DE59fBe1FF78500423dcFd43B',
    signatureValue: 'did:nv:0bc278fee025464f8012b811d1bce8e22094d0984e4e49139df5d5ff7a028bdf',
    type: 'DDOIntegritySignature',
    checksum: {
      '0': '0x52b5c93b82dd9e7ecc3d9fdf4755f7f69a54484941897dc517b4adfe3bbc3377',
      '1': '0x999999952b5c93b82dd9e7ecc3d9fdf4755f7f69a54484941897dc517b4adfe3',
    },
  },
  publicKey: [
    {
      id: 'did:nv:b6e2eb5eff1a093ced9826315d5a4ef6c5b5c8bd3c49890ee284231d7e1d0aaa#keys-1',
      type: 'RsaVerificationKey2018',
      owner: 'did:nv:6027c1e7cbae06a91fce0557ee53195284825f56a7100be0c53cbf4391aa26cc',
      publicKeyPem: '-----BEGIN PUBLIC KEY...END PUBLIC KEY-----\r\n',
    },
    {
      id: 'did:nv:b6e2eb5eff1a093ced9826315d5a4ef6c5b5c8bd3c49890ee284231d7e1d0aaa#keys-2',
      type: 'Ed25519VerificationKey2018',
      owner: 'did:nv:4c27a254e607cdf91a1206480e7eb8c74856102316c1a462277d4f21c02373b6',
      publicKeyBase58: 'H3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV',
    },
    {
      id: 'did:nv:b6e2eb5eff1a093ced9826315d5a4ef6c5b5c8bd3c49890ee284231d7e1d0aaa#keys-3',
      type: 'RsaPublicKeyExchangeKey2018',
      owner: 'did:nv:5f6b885202ffb9643874be529302eb00d55e226959f1fbacaeda592c5b5c9484',
      publicKeyPem: '-----BEGIN PUBLIC KEY...END PUBLIC KEY-----\r\n',
    },
  ],
  verifiableCredential: [
    {
      '@context': ['https://www.w3.org/2018/credentials/v1', 'https://www.w3.org/2018/credentials/examples/v1'],
      id: '1872',
      type: ['read', 'update', 'deactivate'],
      issuer: '0x610D9314EDF2ced7681BA1633C33fdb8cF365a12',
      issuanceDate: '2019-01-01T19:73:24Z',
      credentialSubject: {
        id: '0x89328493849328493284932',
      },
      proof: {
        type: 'RsaSignature2018',
        created: '2019-01-01T19:73:24Z',
        proofPurpose: 'assertionMethod',
        signatureValue: 'ABCJSDAO23...1tzjn4w==',
      },
    },
  ],
  service: [
    {
      index: 0,
      serviceEndpoint: 'http://localhost:5000/api/v1/metadata/assets/ddo/{did}',
      immutableServiceEndpoint: 'cid://QmVT3wfySvZJqAvkBCyxoz3EvD3yeLqf3cvAssFDpFFXNm',
      type: 'metadata',
      attributes: {
        main: {
          author: 'Met Office',
          checksum: '0x52b5c93b82dd9e7ecc3d9fdf4755f7f69a54484941897dc517b4adfe3bbc3377',
          dateCreated: '2019-02-08T08:13:49Z',
          license: 'CC-BY',
          name: 'UK Weather information 2011',
          price: '1',
          type: 'service',
          spec: 'https://my.service.inet:8080/spec',
          specChecksum: '859486596784567856758aaaa',
          definition: {
            auth: {
              type: 'basic',
              user: 'aitor',
              password: '1234',
              token: '89c06eb5a88f4bbbf4ac966d737593b36e61e885',
            },
            endpoints: [
              {
                index: 0,
                url: 'https://my.service.inet:8080/api/v1/weather',
                method: 'POST',
                contentTypes: ['application/json'],
              },
            ],
          },
        },

        additionalInformation: {
          description: 'Weather Service',
          tags: ['weather', 'uk', '2011', 'temperature', 'humidity'],
          copyrightHolder: 'Met Office',
        },
      },
    },
    {
      type: 'access',
      index: 1,
      serviceEndpoint: 'http://localhost:8030/api/v1/gateway/services/consume',
      templateId: '0x044852b2a670ade5407e78fb2863c51de9fcb96542a07186fe3aeda6bb8a116d',
      attributes: {
        main: {
          purchaseEndpoint: 'http://localhost:8030/api/v1/gateway/services/access/initialize',
          name: 'dataAssetAccessServiceAgreement',
          creator: '',
          datePublished: '2019-02-08T08:13:49Z',
          price: '10',
          timeout: 36000,
        },
        additionalInformation: {
          description: '',
        },
        serviceAgreementTemplate: {
          contractName: 'EscrowAccessSecretStoreTemplate',
          events: [
            {
              name: 'AgreementCreated',
              actorType: 'consumer',
              handler: {
                moduleName: 'escrowAccessSecretStoreTemplate',
                functionName: 'fulfillLockPaymentCondition',
                version: '0.1',
              },
            },
          ],
          fulfillmentOrder: ['lockPayment.fulfill', 'access.fulfill', 'escrowPayment.fulfill'],
          conditionDependency: {
            lockPayment: [],
            grantSecretStoreAccess: [],
            releaseReward: ['lockPayment', 'access'],
          },
          conditions: [
            {
              name: 'lockPayment',
              timelock: 0,
              timeout: 0,
              contractName: 'LockPaymentCondition',
              functionName: 'fulfill',
              parameters: [
                {
                  name: '_did',
                  type: 'bytes32',
                  value: '',
                },
                {
                  name: '_rewardAddress',
                  type: 'address',
                  value: '',
                },
                {
                  name: '_tokenAddress',
                  type: 'address',
                  value: '0x0',
                },
                {
                  name: '_amounts',
                  type: 'uint256[]',
                  value: ['10', '2'],
                },
                {
                  name: '_receivers',
                  type: 'address[]',
                  value: ['0xa99d43d86a0758d5632313b8fa3972b6088a21bb', '0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0'],
                },
              ],
              events: [
                {
                  name: 'Fulfilled',
                  actorType: 'publisher',
                  handler: {
                    moduleName: 'lockPaymentConditon',
                    functionName: 'fulfillAccessCondition',
                    version: '0.1',
                  },
                },
              ],
            },
            {
              name: 'access',
              timelock: 0,
              timeout: 0,
              contractName: 'AccessCondition',
              functionName: 'fulfill',
              parameters: [
                {
                  name: '_did',
                  type: 'bytes32',
                  value: '',
                },
                {
                  name: '_grantee',
                  type: 'address',
                  value: '',
                },
              ],
              events: [
                {
                  name: 'Fulfilled',
                  actorType: 'publisher',
                  handler: {
                    moduleName: 'access',
                    functionName: 'fulfillEscrowPaymentCondition',
                    version: '0.1',
                  },
                },
                {
                  name: 'TimedOut',
                  actorType: 'consumer',
                  handler: {
                    moduleName: 'access',
                    functionName: 'fulfillEscrowPaymentCondition',
                    version: '0.1',
                  },
                },
              ],
            },
            {
              name: 'escrowPayment',
              timelock: 0,
              timeout: 0,
              contractName: 'EscrowPaymentCondition',
              functionName: 'fulfill',
              parameters: [
                {
                  name: '_did',
                  type: 'bytes32',
                  value: '',
                },
                {
                  name: '_amounts',
                  type: 'uint256[]',
                  value: ['10', '2'],
                },
                {
                  name: '_receivers',
                  type: 'address[]',
                  value: ['0xa99d43d86a0758d5632313b8fa3972b6088a21bb', '0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0'],
                },
                {
                  name: '_sender',
                  type: 'address',
                  value: '',
                },
                {
                  name: '_tokenAddress',
                  type: 'address',
                  value: '0x0',
                },
                {
                  name: '_lockCondition',
                  type: 'bytes32',
                  value: '',
                },
                {
                  name: '_releaseCondition',
                  type: 'bytes32',
                  value: '',
                },
              ],
              events: [
                {
                  name: 'Fulfilled',
                  actorType: 'publisher',
                  handler: {
                    moduleName: 'escrowPaymentConditon',
                    functionName: 'verifyRewardTokens',
                    version: '0.1',
                  },
                },
              ],
            },
          ],
        },
      },
    },
  ],
};

export const assetWorflow = {
  '@context': 'https://w3id.org/did/v1',
  authentication: [
    {
      type: 'RsaSignatureAuthentication2018',
      publicKey: 'did:nv:0ebed8226ada17fde24b6bf2b95d27f8f05fcce09139ff5cec31f6d81a7cd2ea',
    },
  ],
  created: '2019-02-08T08:13:49Z',
  updated: '2019-06-30T14:53:09Z',
  id: 'did:nv:0bc278fee025464f8012b811d1bce8e22094d0984e4e49139df5d5ff7a028bdf',
  proof: {
    created: '2019-02-08T08:13:41Z',
    creator: '0x37BB53e3d293494DE59fBe1FF78500423dcFd43B',
    signatureValue: 'did:nv:0bc278fee025464f8012b811d1bce8e22094d0984e4e49139df5d5ff7a028bdf',
    type: 'DDOIntegritySignature',
    checksum: {
      '0': '0x52b5c93b82dd9e7ecc3d9fdf4755f7f69a54484941897dc517b4adfe3bbc3377',
    },
  },
  publicKey: [
    {
      id: 'did:nv:b6e2eb5eff1a093ced9826315d5a4ef6c5b5c8bd3c49890ee284231d7e1d0aaa#keys-1',
      type: 'RsaVerificationKey2018',
      owner: 'did:nv:6027c1e7cbae06a91fce0557ee53195284825f56a7100be0c53cbf4391aa26cc',
      publicKeyPem: '-----BEGIN PUBLIC KEY...END PUBLIC KEY-----\r\n',
    },
    {
      id: 'did:nv:b6e2eb5eff1a093ced9826315d5a4ef6c5b5c8bd3c49890ee284231d7e1d0aaa#keys-2',
      type: 'Ed25519VerificationKey2018',
      owner: 'did:nv:4c27a254e607cdf91a1206480e7eb8c74856102316c1a462277d4f21c02373b6',
      publicKeyBase58: 'H3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV',
    },
    {
      id: 'did:nv:b6e2eb5eff1a093ced9826315d5a4ef6c5b5c8bd3c49890ee284231d7e1d0aaa#keys-3',
      type: 'RsaPublicKeyExchangeKey2018',
      owner: 'did:nv:5f6b885202ffb9643874be529302eb00d55e226959f1fbacaeda592c5b5c9484',
      publicKeyPem: '-----BEGIN PUBLIC KEY...END PUBLIC KEY-----\r\n',
    },
  ],
  verifiableCredential: [
    {
      '@context': ['https://www.w3.org/2018/credentials/v1', 'https://www.w3.org/2018/credentials/examples/v1'],
      id: '1872',
      type: ['read', 'update', 'deactivate'],
      issuer: '0x610D9314EDF2ced7681BA1633C33fdb8cF365a12',
      issuanceDate: '2019-01-01T19:73:24Z',
      credentialSubject: {
        id: '0x89328493849328493284932',
      },
      proof: {
        type: 'RsaSignature2018',
        created: '2019-01-01T19:73:24Z',
        proofPurpose: 'assertionMethod',
        signatureValue: 'ABCJSDAO23...1tzjn4w==',
      },
    },
  ],
  service: [
    {
      index: 0,
      serviceEndpoint: 'http://localhost:5000/api/v1/metadata/assets/ddo/{did}',
      type: 'metadata',
      attributes: {
        main: {
          author: 'John Doe',
          checksum: '0x52b5c93b82dd9e7ecc3d9fdf4755f7f69a54484941897dc517b4adfe3bbc3377',
          dateCreated: '2019-02-08T08:13:49Z',
          datePublished: '2019-05-08T08:13:49Z',
          license: 'CC-BY',
          name: 'My workflow',
          price: '1',
          type: 'workflow',
          workflow: {
            stages: [
              {
                index: 0,
                stageType: 'Filtering',
                requirements: {
                  container: {
                    image: 'tensorflow/tensorflow',
                    tag: 'latest',
                    checksum: 'sha256:cb57ecfa6ebbefd8ffc7f75c0f00e57a7fa739578a429b6f72a0df19315deadc',
                  },
                },
                input: [
                  {
                    index: 0,
                    id: 'did:nv:12345',
                  },
                  {
                    index: 1,
                    id: 'did:nv:67890',
                  },
                ],
                transformation: {
                  id: 'did:nv:abcde',
                },
                output: {
                  metadataUrl: 'https://localhost:5000/api/v1/metadata/assets/ddo/',
                  secretStoreUrl: 'http://localhost:12001',
                  accessProxyUrl: 'https://localhost:8030/api/v1/gateway/',
                  metadata: {},
                },
              },
              {
                index: 1,
                stageType: 'Transformation',
                requirements: {
                  container: {
                    image: 'tensorflow/tensorflow',
                    tag: 'latest',
                    checksum: 'sha256:cb57ecfa6ebbefd8ffc7f75c0f00e57a7fa739578a429b6f72a0df19315deadc',
                  },
                },
                input: [
                  {
                    index: 0,
                    previousStage: 0,
                  },
                ],
                transformation: {
                  id: 'did:nv:999999',
                },
                output: {
                  metadataUrl: 'https://metadata.net:5000/api/v1/metadata/assets/ddo/',
                  secretStoreUrl: 'http://secretstore.org:12001',
                  accessProxyUrl: 'https://gateway.net:8030/api/v1/gateway/',
                  metadata: {},
                },
              },
            ],
          },
        },
        additionalInformation: {
          description: 'Workflow to aggregate weather information',
          tags: ['weather', 'uk', '2011', 'workflow', 'aggregation'],
          copyrightHolder: 'John Doe',
        },
      },
    },
  ],
};
