const { LCDClient, MsgStoreCode, MnemonicKey, isTxError, MsgInstantiateContract, MsgExecuteContract } = require('@terra-money/terra.js');
const fs = require('fs')

// test1 key from localterra accounts
const mk = new MnemonicKey({
    mnemonic: 'notice oak worry limit wrap speak medal online prefer cluster roof addict wrist behave treat actual wasp year salad speed social layer crew genius'
})

// connect to localterra
const terra = new LCDClient({
    URL: 'http://localhost:1317',
    chainID: 'localterra'
});
const wallet = terra.wallet(mk);

async function main() {


    let code_id_nft = await storeCode("contracts/astrohero", "astrohero");
    //init 
    let init_msg_nft = {
        "name": "Astro_hero",
        "symbol": "ASTRO",
        "minter": wallet.key.accAddress,
        "token_supply": 10000
    } // InitMsg
    let contract_address_nft = await initContract(init_msg_nft, code_id_nft);
    console.log("Address of contract NFT: " + contract_address_nft);


    let code_id_whitelist = await storeCode("", "whitelist_airdrop");

    let init_msg_whitelist = {
        "owner": wallet.key.accAddress,
        "treasury": wallet.key.accAddress,
        "nft_token_address": contract_address_nft.toString(),
        "collection_name": "Astro_collection",
        "collection_symbol": "ASTRO_CLT",
        "price": {
            "amount": "3000000",
            "denom": "uluna"
        },

    }
    let contract_address_whitelist = await initContract(init_msg_whitelist, code_id_whitelist);
    console.log("Address of contract NFT: " + contract_address_whitelist);

    //set minter for whitelist address 

    const setMinterMsg = new MsgExecuteContract(
        wallet.key.accAddress,
        contract_address_nft.toString(),
        {
            "set_minter": {
                "minter": contract_address_whitelist.toString()
            }
        },

    )

    const executeSetMinterTx = await wallet.createAndSignTx({
        msgs: [setMinterMsg]
    });

    console.log(executeSetMinterTx)


    // // start stage 1 with rootHash = 58c5bdd60d4756014bd044fa9e75e11632114399f83564a01f91b834293ec594

    const registerRootHashMsg = new MsgExecuteContract(
        wallet.key.accAddress,
        contract_address_whitelist.toString(),
        {
            "register_merkle_root": {
                "merkle_root": "58c5bdd60d4756014bd044fa9e75e11632114399f83564a01f91b834293ec594"
            }
        }
    )

    const executeRegisterRootHash = await wallet.createAndSignTx({
        msgs: [registerRootHashMsg]
    })
    console.log(executeRegisterRootHash)

    // const result = await terra.wasm.contractQuery(
    //     contract_address_whitelist.toString(),
    //     {  "merkle_root":{
    //         "stage" : 1
    //     }} // query msg
    //   );
    //   console.log(resul)
    // // address mint NFT 

    // const mintMsg =  {
    //         "token_id": "test",
    //         "owner": wallet.key.accAddress,
    //         "token_uri": "https://starships.example.com/Starship/Enterprise.json",
    //         "extension": {}
    // }
    // const mintingWhitelistMsg = new MsgExecuteContract(
    //     wallet.key.accAddress,
    //     contract_address_whitelist.toString(),
    //     {
    //         "claim": {
    //             "stage": 0,
    //             "amount": "1",
    //             "proof": [
    //                 "696630081d29ff40030fe020e4dd5a95dd1641dd0eb8137932a41afd28325cc9",
    //                 "bcf281fa21a6acfcc9c37eb37a39780b87f5fba68fcdfa3a8cc837af50303275",
    //                 "baa8af1a0ae73464dcc7d814e074302fdf63da3e52ff9dcd7f79eaa68324986c"
    //             ],
    //             "mint_msg": {
    //                 "token_id": "test",
    //                 "owner" : wallet.key.accAddress.toString(),
                    
    //             }
    //         }
    //     },
    //     {
    //         uluna: 3000000
    //     }
    // )

    // console.log("111", mintingWhitelistMsg)

    // const executeAirdropWhitelist = await wallet.createAndSignTx({
    //     msgs: [mintingWhitelistMsg]
    // })
    // console.log(executeAirdropWhitelist)

}

async function storeCode(path, code) {
    const storeCode = new MsgStoreCode(
        wallet.key.accAddress,
        fs.readFileSync(`./${path}/artifacts/${code}.wasm`).toString('base64')
    );
    const storeCodeTx = await wallet.createAndSignTx({
        msgs: [storeCode],
    });
    const storeCodeTxResult = await terra.tx.broadcast(storeCodeTx);

    if (isTxError(storeCodeTxResult)) {
        throw new Error(
            `store code failed. code: ${storeCodeTxResult.code}, codespace: ${storeCodeTxResult.codespace}, raw_log: ${storeCodeTxResult.raw_log}`
        );
    }

    const {
        store_code: { code_id },
    } = storeCodeTxResult.logs[0].eventsByType;

    return code_id;

}

async function initContract(msg, code_id) {
    const instantiate = new MsgInstantiateContract(
        wallet.key.accAddress,
        wallet.key.accAddress,

        code_id[0], // code ID
        msg,
        { uluna: 10000000, ukrw: 1000000 }
    );
    console.log("Deploy contract by address: " + wallet.key.accAddress)


    const instantiateTx = await wallet.createAndSignTx({
        msgs: [instantiate],
    });

    const instantiateTxResult = await terra.tx.broadcast(instantiateTx);

    if (isTxError(instantiateTxResult)) {
        throw new Error(
            `instantiate failed. code: ${instantiateTxResult.code}, codespace: ${instantiateTxResult.codespace}, raw_log: ${instantiateTxResult.raw_log}`
        );
    }

    const {
        instantiate_contract: { contract_address },
    } = instantiateTxResult.logs[0].eventsByType;
    return contract_address
}


main()