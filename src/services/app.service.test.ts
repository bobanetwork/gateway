import appService from './app.service'
import store from 'store'
import { Network, NetworkType } from 'util/network/network.util'

jest.mock('store', () => ({
  dispatch: jest.fn(),
}))

describe('appService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('App Services', () => {
    test('fetchAddresses - should return addresses for specified network and network type for TESTNET', () => {
      const addresses = appService.fetchAddresses({
        networkType: NetworkType.TESTNET,
        network: Network.ETHEREUM,
      })

      expect(addresses).toBeDefined()
      expect(addresses).toEqual({
        AddressManager: '0x6FF9c8FF8F0B6a0763a3030540c21aFC721A9148',
        AggregatorHCHepler: '0x45c5dB3F5AC1579DD43404e47562641b61A6AC77',
        AtomicSwap: '0x8B0eF5250b5d6EfA877eAc15BBdfbD3C8069242F',
        AuthenticatedFaucet: '0x4E98bAbe5364452cD02FC8E0AD7d9E526B68a5D6',
        AvalancheBridgeToEth: '0x7eD586Db48CB0b60b821462Be6e925CA1b5D271D',
        Avalanche_TK_BOBA: '0xDA72d93c5645E70437D733d55DdE9CCb5403E4b1',
        BASE_V1_VOTER: '0x8A52a736F632334459e2D710c9C73e07391dae06',
        BNBBridgeToEth: '0xc614A66f82e71758Fa7735C91dAD1088c8362f15',
        BNB_TK_BOBA: '0x89d7128C93933012F0d36D9A5bCae82414318A0D',
        BOBAUSD_Aggregator: '0xbcA151440F29c10BeBA5a410c52914e236Fc9845',
        BobaBillingContract: '0x3CE051cB75e2b5c13BDe8a40Fe7305Ca42e4eEcf',
        BobaFixedSavings: '0x6105B7cF3b227e78b8792EfcE9ac75bC1b72D2cE',
        BobaMonsters: '0x240D31b369B4F5494fF6F04237B3E93bE52fAcb8',
        BobaTuringCredit: '0x4200000000000000000000000000000000000021',
        Boba_GasPriceOracle: '0x4200000000000000000000000000000000000025',
        BondManager: '0xF84979ADeb8D2Dd25f54cF8cBbB05C08eC188e11',
        CanonicalTransactionChain: '0x8B0eF5250b5d6EfA877eAc15BBdfbD3C8069242F',
        'ChainStorageContainer-CTC-batches':
          '0x01c9DC8B9c66D61a56Db7bF3F5303Cd9E9c85B1F',
        'ChainStorageContainer-CTC-queue':
          '0x42356f071B65FD0FBA2b74566EB1D3634F008CDa',
        'ChainStorageContainer-SCC-batches':
          '0xc6B47b2f5DF0C84fa91Ae2bBA733Ee72a6c4830e',
        DiscretionaryExitFee: '0xF39fC83ccd7D01c3F276Ab35d1F80bdB34F40c89',
        ETHUSD_Aggregator: '0x47b45765ee4e270dE60852295bB0Dd105E1A4Df0',
        ETHUSD_AggregatorHC: '0x300f35972189d5FbEe140E552Dac80df85E6521C',
        EthBridgeToAvalanche: '0x2C4Ec0725D9b795A90de46326C7dDb57C1437019',
        EthBridgeToBNB: '0xCb91c5157024618FC90017c28fa83F36f266Eb4e',
        EthBridgeToFantom: '0xa0fDeB9c88178E35D336042A076CeC12b55054a2',
        EthBridgeToMoonbase: '0x66c8283aECcAbB15f3359961a91783ff8553ee1B',
        Eth_TK_BOBA: '0xeCCD355862591CBB4bB7E7dD55072070ee3d0fC1',
        FantomBridgeToEth: '0x7B23c975195503C9Eb1972e900ac4799B5A504Cb',
        Fantom_TK_BOBA: '0x44DcA16c6940D74d12ABFa586E0b6caAC0ceDeF8',
        FeedRegistry: '0xE84AAb853C4FBaafd3eD795F67494d4Da1539492',
        GovernorBravoDelegate: '0x22FDcc02fBBF24d829F7A0A69329d8d27477b0Df',
        GovernorBravoDelegator: '0xf3b489cCC93A9B74F17113E323E4Db2b1FdE2Cb8',
        GovernorBravoDelegatorV2: '0xf3b489cCC93A9B74F17113E323E4Db2b1FdE2Cb8',
        HybridComputeHelperFactory:
          '0xFeED2Dc24E3CCd9594B5122318F1b6c037492652',
        L1CrossDomainMessengerFast:
          '0x93f605b2f42d0380E35E50671153fbB8f0A1d257',
        L1ERC1155Bridge: '0x95C41a85d3aA7dB78D80d288f05Cd49D12c549DD',
        L1LPAddress: '0x1F32017A84dE07A524b9C6993D35B4bF70e8Dc93',
        L1LiquidityPool: '0x8Ae3F240eE2BB4e0eb017D3689871301695AD73e',
        L1Message: '0x6105B7cF3b227e78b8792EfcE9ac75bC1b72D2cE',
        L1MultiMessageRelayer: '0xebE42F5cEA2184F6b416bFFAB0744b11281AE95b',
        L1MultiMessageRelayerFast: '0xf3b489cCC93A9B74F17113E323E4Db2b1FdE2Cb8',
        L1NFTBridge: '0x8f60bafdfdB9c2b65Eb5411ead31Fd2E9e831669',
        L1Teleportation: '0xB93d9748808A5cC7dC6b61b31F15b87F50BfcAd0',
        L1_ETH_Address: '0x0000000000000000000000000000000000000000',
        L2ERC1155Bridge: '0xB8870075005C26FBf01246f89816d1190702BC18',
        L2ERC721: '0x4CFeADc728fD25F2d88b23F3C3834a103330D9A1',
        L2ERC721Reg: '0x7Bb4cfa36F9F3880e18a46B74bBb9B334F6600F3',
        L2LPAddress: '0xF121Fd008A17c8C76DF1f003f19523130060B5BA',
        L2LiquidityPool: '0xCb1bdcBDf6D0929A8B819b768E772568D5F83a91',
        L2Message: '0xc6B47b2f5DF0C84fa91Ae2bBA733Ee72a6c4830e',
        L2MessengerAddress: '0x4200000000000000000000000000000000000007',
        L2NFTBridge: '0xa45Ae6a5291e11Ca307e8171A80E0f1F66651F4c',
        L2StandardBridgeAddress: '0x4200000000000000000000000000000000000010',
        L2StandardTokenFactory: '0xD2ae16D8c66ac7bc1Cf3c9e5d6bfE5f76BeDb826',
        L2Teleportation: '0x95ec63aE2573bD5e70C223E075D9483573968699',
        L2TokenPool: '0xc00933D40Cc84139075acf332f575CFB3846D408',
        L2_BOBA_Address: '0x4200000000000000000000000000000000000006',
        L2_ETH_Address: '0x4200000000000000000000000000000000000006',
        Layer_Zero_ChainId: '10121',
        Layer_Zero_Endpoint: '0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23',
        MoonbaseBridgeToEth: '0xBe9813929AD03bE8955fab157D64f5f784ADfc30',
        Moonbase_TK_BOBA: '0x0F59e146b557c2168025E576C2A52f782e88cC6D',
        NETWORK_NATIVE: '0x4200000000000000000000000000000000000006',
        OVM_L1CrossDomainMessenger:
          '0x6d849602Ed00D3680e1820929B6Bdc86169cbE21',
        Proxy__AvalancheBridgeToEth:
          '0xec4DE3D3bCbCe89875C1C5d2d7FAd8B2AF5080a7',
        Proxy__BNBBridgeToEth: '0x37152D3D998ED163f4253FDaBDD9E545F0Ec7c07',
        Proxy__BobaBillingContract:
          '0x04A6e2AB38BB53bD82ae1Aa0521633D640304ab9',
        Proxy__BobaFixedSavings: '0xDBD71249Fe60c9f9bF581b3594734E295EAfA9b2',
        Proxy__BobaTuringCredit: '0x4200000000000000000000000000000000000020',
        Proxy__Boba_GasPriceOracle:
          '0x4200000000000000000000000000000000000024',
        Proxy__ETHUSD_AggregatorHC:
          '0x9e28dE704435871af476460B456Ec741fE5DE24f',
        Proxy__EthBridgeToAvalanche:
          '0x1b588Adb7Ec795f45D9c8BDdc2eA49efAE37AB6a',
        Proxy__EthBridgeToBNB: '0x88F8cD148A4B68d250B62EeB75D9Cccd99624E2C',
        Proxy__EthBridgeToFantom: '0x46Df4761959BC78867e1Af47cA8bC7B40B3Cb1A6',
        Proxy__EthBridgeToMoonbase:
          '0x3BB2954d2c2AaeE4832e4a89974DC4E5a5a53C0a',
        Proxy__FantomBridgeToEth: '0x01F93E4EFa199d4D42A248Db90716214f7283DCb',
        Proxy__L1CrossDomainMessenger:
          '0xA6fA0867F39f3A3af7433C8A43f23bf26Efd1a48',
        Proxy__L1CrossDomainMessengerFast:
          '0x8b5A2d6aE932e8224B15c2C87dc8A972301c1B5d',
        Proxy__L1ERC1155Bridge: '0x1dF39152AC0e81aB100341cACC4dE4c372A550cb',
        Proxy__L1LiquidityPool: '0x1F32017A84dE07A524b9C6993D35B4bF70e8Dc93',
        Proxy__L1NFTBridge: '0xa2232D3c81EFd46815c1adf48Ed86C5C377cb6e2',
        Proxy__L1StandardBridge: '0xDBD71249Fe60c9f9bF581b3594734E295EAfA9b2',
        Proxy__L1Teleportation: '0x84b22166366a6f7E0cD0c3ce9998f2913Bf17A13',
        Proxy__L2ERC1155Bridge: '0x1dF39152AC0e81aB100341cACC4dE4c372A550cb',
        Proxy__L2LiquidityPool: '0xF121Fd008A17c8C76DF1f003f19523130060B5BA',
        Proxy__L2NFTBridge: '0xF84979ADeb8D2Dd25f54cF8cBbB05C08eC188e11',
        Proxy__L2Teleportation: '0xB43EE846Aa266228FeABaD1191D6cB2eD9808894',
        Proxy__MoonbaseBridgeToEth:
          '0xc60e797bf8166EEF92681fc47cDdd7517293F025',
        StateCommitmentChain: '0x7Bb4cfa36F9F3880e18a46B74bBb9B334F6600F3',
        TK_L1BOBA: '0xeCCD355862591CBB4bB7E7dD55072070ee3d0fC1',
        TK_L1ETH: '0x0000000000000000000000000000000000000000',
        TK_L1OMG: '0xCb9b561c91dDA1A9bAc33F7716a4d5586B7F5649',
        TK_L1USDC: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
        TK_L2BOBA: '0x4200000000000000000000000000000000000023',
        TK_L2ETH: '0x4200000000000000000000000000000000000006',
        TK_L2OMG: '0x080bf38b43a1441873116002d36CCB583464cF45',
        TK_L2USDC: '0x429582bDe1B0E011C48d883354050938f194743F',
        TK_L2WETH9: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
        TK_L2xBOBA: '0x01c9DC8B9c66D61a56Db7bF3F5303Cd9E9c85B1F',
        Timelock: '0x66C893019bC366eB497f49c8Df79e63AF73124eA',
        Ve_BOBA: '0x247571C8151eB78d4fDc8AAb233C2734BDB811c5',
        Ve_Dispatcher: '0x126301CCbdd780Cd129e47594938FB17B3Da43DE',
        Ve_Gauge: '0x72f30dBB4457a72C688da25A05D333A3ef065C2b',
        Ve_Voter: '0xA107508264aB36eFDc50C51a278B9286C6cB5ABB',
        layerZeroTargetChainID: '10121',
      })
    })
    test('fetchAddresses - should return addresses for specified network and network type for TESTNET', () => {
      const addresses = appService.fetchAddresses({
        networkType: NetworkType.MAINNET,
        network: Network.ETHEREUM,
      })

      expect(addresses).toBeDefined()
      expect(addresses).toEqual({
        AggregatorHCHepler: '0x45c5dB3F5AC1579DD43404e47562641b61A6AC77',
        AvalancheBridgeToEth: '0xBFcB8A6eD80Ef99a5265B72fdC87f4B4dAA598D3',
        Avalanche_TK_BOBA: '0x3cD790449CF7D187a143d4Bd7F4654d4f2403e02',
        BNBBridgeToEth: '0x62C1275bf5484d940BF46d1fCC1e1Ad5DbdD5AE5',
        BNB_TK_BOBA: '0xE0DB679377A0F5Ae2BaE485DE475c9e1d8A4607D',
        BobaAirdropL1: '0xF5dBd4Cedc64f97Cbc01aB4A9210e41864aac17a',
        BobaAirdropL2: '0x0A1f3CB6E19083C5d72046489487077Beae4D469',
        BobaBillingContract: '0x4a792F51CCc616b82EF74d2478C732e161c5E6b1',
        BobaFixedSavings: '0xA9F76f4556044ACE32Af0989A10eB8CF40963128',
        BobaMonsters: '0xce458FC7cfC322cDd65eC77Cf7B6410002E2D793',
        BobaStraw_BOBAUSD: '0x987AEd89f5BDC3eb863282DBB76065bFe398be17',
        BobaStraw_ETHUSD: '0x50E383121021F4E8060C794d79Ada77195532c7a',
        BobaStraw_OMGUSD: '0x6696F07d9D2b0Cac59bf877077f4325079cbd806',
        BobaStraw_WBTCUSD: '0xaee724B39B947A3d009FE9FE0EF61785B45540F8',
        BobaTuringCredit: '0xd8E006702bdCbE2582dF13f900bCF750129bB449',
        Boba_GasPriceOracle: '0x5d0763cf905DA3689B072FD19baD8dF823b2c349',
        DiscretionaryExitBurn: '0x3256BD6Fc8b5fA48DB95914d0dF314465F3F7879',
        DiscretionaryExitFee: '0x8b91cE1859F2B4F3D8e7514F1D7598dbAa10A721',
        ERC721Registry: '0xcDcDa7D2a78AD9e74fD343d28Cad1Af6187014fc',
        ETHUSD_AggregatorHC: '0xdB633569e3E6c420e06c15544076333504b18b94',
        EthBridgeToAvalanche: '0x51C3db474B023e4924133F36152f40a7b6E27f3F',
        EthBridgeToBNB: '0x5d7824051Ea90F05eC1c6EcfEF05d5234B59040F',
        EthBridgeToFantom: '0xd5c567aC6571aB35568A8E8C73470dFf8Eed939e',
        EthBridgeToMoonbeam: '0x6482767251d24f309C0C9985E2EA1262465400dE',
        Eth_TK_BOBA: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
        FantomBridgeToEth: '0x2164dFc94E0f2EE6C2982045950ed052298D12a0',
        Fantom_TK_BOBA: '0x4389b230D15119c347B9E8BEA6d930A21aaDF6BA',
        FeedRegistry: '0x01a109AB8603ad1B6Ef5f3B2B00d4847e6E554b1',
        GovernorBravoDelegate: '0xD3071443DdB9f98Ec11BD420c3a7df0C64e5030e',
        GovernorBravoDelegator: '0x2CC555B5B1a4Cf7fA5401B29ab46fc5ba2e205b0',
        GovernorBravoDelegatorV2: '0x2CC555B5B1a4Cf7fA5401B29ab46fc5ba2e205b0',
        L1CrossDomainMessenger: '0x12Acf6E3ca96A60fBa0BBFd14D2Fe0EB6ae47820',
        L1CrossDomainMessengerFast:
          '0x4CD1948de677e6f791B463daaB807645D3460996',
        L1ERC1155Bridge: '0x72c455C20eF23CCe31f47e636Bf67a9B8749c8cE',
        L1LPAddress: '0x1A26ef6575B7BBB864d984D9255C069F6c361a14',
        L1LiquidityPool: '0xd24484926f1d130778B9ebd7ec594548b2D53CB1',
        L1MultiMessageRelayerFast: '0x2d6134Ac3e480fBDD263B7163d333dCA285f9622',
        L1NFTBridge: '0xbF313aD6e476FF4ab6c01B76DfC74A47f2c9a582',
        L1_ETH_Address: '0x0000000000000000000000000000000000000000',
        L2ERC1155Bridge: '0x61A52269287dF03e6aA452Fd9fcFDa7ef84C1e60',
        L2LPAddress: '0x3A92cA39476fF84Dc579C868D4D7dE125513B034',
        L2LiquidityPool: '0x92B78e9B8d0D53a06Bb8c2A585E126c631c481aF',
        L2MessengerAddress: '0x4200000000000000000000000000000000000007',
        L2NFTBridge: '0x031Cb8734755833F95Ef5B9Fdb1776d69d14971D',
        L2StandardBridgeAddress: '0x4200000000000000000000000000000000000010',
        L2StandardTokenFactory: '0xD2ae16D8c66ac7bc1Cf3c9e5d6bfE5f76BeDb826',
        L2_BOBA_Address: '0x4200000000000000000000000000000000000006',
        L2_ETH_Address: '0x4200000000000000000000000000000000000006',
        Layer_Zero_ChainId: '101',
        Layer_Zero_Endpoint: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675',
        Lib_AddressManager: '0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089',
        MoonbeamBridgeToEth: '0x05469d879dF44cD83f6923Be12f46E2871dA2DAf',
        Moonbeam_TK_BOBA: '0x18D17A9fD652D7d6a59903E23792ab97F832Ed6C',
        NETWORK_NATIVE: '0x4200000000000000000000000000000000000006',
        NFT_L1BOBA: '0xD3782AB15fA9983Cb4208de1B49ccA00f1332b43',
        NFT_L2BOBA: '0x22AB0eaBe9db0F30B8066F61D893b4b966F01A7d',
        OVM_L1CrossDomainMessenger:
          '0x12Acf6E3ca96A60fBa0BBFd14D2Fe0EB6ae47820',
        OVM_L1CrossDomainMessengerFast:
          '0x4CD1948de677e6f791B463daaB807645D3460996',
        Proxy__AvalancheBridgeToEth:
          '0x351F4853A0E94DB055ed6ad5DF1b3590791c1F71',
        Proxy__BNBBridgeToEth: '0x819FF4d9215C9dAC76f5eC676b1355973157eBBa',
        Proxy__BobaBillingContract:
          '0x29F373e4869e69faaeCD3bF747dd1d965328b69f',
        Proxy__BobaFixedSavings: '0x9Fb3051148ff6EFCD0B5bA0Afa22EB0B9fC67A69',
        Proxy__BobaTuringCredit: '0xF8D2f1b0292C0Eeef80D8F47661A9DaCDB4b23bf',
        Proxy__Boba_GasPriceOracle:
          '0xeE06ee2F239d2ab11792D77f3C347d919ddA0d51',
        Proxy__ETHUSD_AggregatorHC:
          '0x9e28dE704435871af476460B456Ec741fE5DE24f',
        Proxy__EthBridgeToAvalanche:
          '0xB0003eB166654f7e57c0463F8D1a438eB238c490',
        Proxy__EthBridgeToBNB: '0x1A36E24D61BC1aDa68C21C2Da1aD53EaB8E03e55',
        Proxy__EthBridgeToFantom: '0x9DD4202AA5ee9625d1eaa671E2294014dd434E7E',
        Proxy__EthBridgeToMoonbeam:
          '0x6F537839714761388B6d7ED61Bc09579d5dA2F41',
        Proxy__FantomBridgeToEth: '0x409e3693A23D4331F613c36f6D5f439a5b9834e8',
        Proxy__L1CrossDomainMessenger:
          '0x6D4528d192dB72E282265D6092F4B872f9Dff69e',
        Proxy__L1CrossDomainMessengerFast:
          '0xD05b8fD53614e1569cAC01c6D8d41416d0a7257E',
        Proxy__L1ERC1155Bridge: '0x1dF39152AC0e81aB100341cACC4dE4c372A550cb',
        Proxy__L1LiquidityPool: '0x1A26ef6575B7BBB864d984D9255C069F6c361a14',
        Proxy__L1NFTBridge: '0xC891F466e53f40603250837282eAE4e22aD5b088',
        Proxy__L1StandardBridge: '0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00',
        Proxy__L2ERC1155Bridge: '0x1dF39152AC0e81aB100341cACC4dE4c372A550cb',
        Proxy__L2LiquidityPool: '0x3A92cA39476fF84Dc579C868D4D7dE125513B034',
        Proxy__L2NFTBridge: '0xFB823b65D0Dc219fdC0d759172D1E098dA32f9eb',
        Proxy__MoonbeamBridgeToEth:
          '0x9F868333DB1720Fb1412AFfb1AeF47e8C6cFc8c3',
        TK_L1BAT: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
        TK_L1BNB: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
        TK_L1BOBA: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
        TK_L1BUSD: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
        TK_L1DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
        TK_L1DODO: '0x43Dfc4159D86F3A37A5A4B3D4580b888ad7d4DDd',
        TK_L1DOM: '0xef5fa9f3dede72ec306dfff1a7ea0bb0a2f7046f',
        TK_L1ETH: '0x0000000000000000000000000000000000000000',
        TK_L1FRAX: '0x853d955acef822db058eb8505911ed77f175b99e',
        TK_L1FTM: '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
        TK_L1FXS: '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0',
        TK_L1LINK: '0x514910771af9ca656af840dff83e8264ecf986ca',
        TK_L1MATIC: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
        TK_L1OMG: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
        TK_L1REP: '0x221657776846890989a759ba2973e427dff5c9bb',
        TK_L1SUSHI: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
        TK_L1TEST: '0xB68a38D3a10F28948EBf0f2450Fef348680F4714',
        TK_L1UMA: '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828',
        TK_L1UNI: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
        TK_L1USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        TK_L1USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        TK_L1UST: '0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
        TK_L1WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        TK_L1ZRX: '0xe41d2489571d322189246dafa5ebde1f4699f498',
        TK_L2BAT: '0xc0C16dF1ee7dcEFb88C55003C49F57AA416A3578',
        TK_L2BNB: '0x68ac1623ACf9eB9F88b65B5F229fE3e2c0d5789e',
        TK_L2BOBA: '0xa18bF3994C0Cc6E3b63ac420308E5383f53120D7',
        TK_L2BUSD: '0x352F2Fdf653A194B42e3311f869237c66309b69E',
        TK_L2DAI: '0xf74195Bb8a5cf652411867c5C2C5b8C2a402be35',
        TK_L2DODO: '0x572c5B5BF34f75FB62c39b9BFE9A75bb0bb47984',
        TK_L2DOM: '0xF56FbEc7823260D7510D63B63533153b58A01921',
        TK_L2ETH: '0x4200000000000000000000000000000000000006',
        TK_L2FRAX: '0xAb2AF3A98D229b7dAeD7305Bb88aD0BA2c42f9cA',
        TK_L2FTM: '0x841979bbC06Be7BFE28d9FadDac1A73e1Fb495C1',
        TK_L2FXS: '0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00',
        TK_L2LINK: '0xD5D5030831eE83e22a2C9a5cF99931A50c676433',
        TK_L2MATIC: '0x26b664736217407E0FA252b4578DB23B1E3819F3',
        TK_L2OMG: '0xe1E2ec9a85C607092668789581251115bCBD20de',
        TK_L2REP: '0x8b5B1E971862015bc058234FC11ce6C4a4c536dD',
        TK_L2SUSHI: '0x5fFccc55C0d2fd6D3AC32C26C020B3267e933F1b',
        TK_L2TEST: '0xeDB79B0FD84c81E870b2fCB1D3CcF366179bA6D2',
        TK_L2UMA: '0x780f33Ad21314d9A1Ffb6867Fe53d48a76Ec0D16',
        TK_L2UNI: '0xDBDE1347fED5dC03C74059010D571a16417d307e',
        TK_L2USDC: '0x66a2A913e447d6b4BF33EFbec43aAeF87890FBbc',
        TK_L2USDT: '0x5DE1677344D3Cb0D7D465c10b72A8f60699C062d',
        TK_L2UST: '0xE5Ef1407928eBCe28a6f1a0759251b7187fEa726',
        TK_L2WBTC: '0xdc0486f8bf31DF57a952bcd3c1d3e166e3d9eC8b',
        TK_L2ZRX: '0xf135f13Db3B114107dCB0B32B6c9e10fFF5a6987',
        TK_L2xBOBA: '0x5747a93C87943A9567c6db00b38F1E78bF14b7C0',
        Timelock: '0xCc72f566Fd5C7EDeB8dAA4Fe394967f5546eC5B8',
        layerZeroTargetChainID: '101',
      })
    })
    test('fetchSupportedAssets - should return supported assets for specified network and network type for TESTNET', () => {
      const supportedAssets = appService.fetchSupportedAssets({
        networkType: NetworkType.TESTNET,
        network: Network.ETHEREUM,
      })

      expect(supportedAssets).toBeDefined()
      expect(supportedAssets).toEqual({
        altL1Chains: ['BNB'],
        tokenAddresses: {},
        tokens: ['BOBA', 'USDC', 'OMG', 'xBOBA'],
      })
    })

    test('fetchSupportedAssets - should return supported assets for specified network and network type for MAINNET', () => {
      const supportedAssets = appService.fetchSupportedAssets({
        networkType: NetworkType.MAINNET,
        network: Network.ETHEREUM,
      })

      expect(supportedAssets).toBeDefined()
      expect(supportedAssets).toEqual({
        altL1Chains: ['BNB'],
        tokenAddresses: {
          CGT: {
            L1: '0xf56b164efd3cfc02ba739b719b6526a6fa1ca32a',
            L2: '0xf56b164efd3cfc02ba739b719b6526a6fa1ca32a',
          },
          OLO: {
            L1: 'OLO',
            L2: '0x5008F837883EA9a07271a1b5eB0658404F5a9610',
          },
          WAGMIv0: {
            L1: 'WAGMIv0',
            L2: '0x8493C4d9Cd1a79be0523791E3331c78Abb3f9672',
          },
          WAGMIv1: {
            L1: 'WAGMIv1',
            L2: '0xCe055Ea4f29fFB8bf35E852522B96aB67Cbe8197',
          },
          WAGMIv2: {
            L1: 'WAGMIv2',
            L2: '0x76B5908ecd0ae3DB23011ae96b7C1f803D63136c',
          },
          'WAGMIv2-Oolong': {
            L1: 'WAGMIv2-Oolong',
            L2: '0x49a3e4a1284829160f95eE785a1A5FfE2DD5Eb1D',
          },
          WAGMIv3: {
            L1: 'WAGMIv3',
            L2: '0xC6158B1989f89977bcc3150fC1F2eB2260F6cabE',
          },
          'WAGMIv3-Oolong': {
            L1: 'WAGMIv3-Oolong',
            L2: '0x70bf3c5B5d80C4Fece8Bde0fCe7ef38B688463d4',
          },
        },
        tokens: [
          'USDT',
          'DAI',
          'USDC',
          'WBTC',
          'REP',
          'BAT',
          'ZRX',
          'SUSHI',
          'LINK',
          'UNI',
          'BOBA',
          'xBOBA',
          'OMG',
          'FRAX',
          'FXS',
          'DODO',
          'UST',
          'BUSD',
          'BNB',
          'FTM',
          'MATIC',
          'UMA',
          'DOM',
          'OLO',
          'WAGMIv0',
          'WAGMIv1',
          'WAGMIv2',
          'WAGMIv2-Oolong',
          'WAGMIv3',
          'WAGMIv3-Oolong',
          'CGT',
        ],
      })
    })
    test('setupInitState - Should Initialize state for tokens', () => {
      const l1Token = 'WAGMIv0'
      const l1TokenName = 'WAGMI Version 0'

      appService.setupInitState({ l1Token, l1TokenName })

      expect(store.dispatch).toHaveBeenCalledWith({
        type: 'TOKEN/GET/INITIALIZE',
        payload: {
          currency: '0x0000000000000000000000000000000000000000',
          addressL1: '0x0000000000000000000000000000000000000000',
          addressL2: '0x4200000000000000000000000000000000000023',
          symbolL1: l1Token,
          symbolL2: l1Token,
          decimals: 18,
          name: l1TokenName,
          redalert: false,
        },
      })
    })
  })
})
