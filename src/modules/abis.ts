import { Provider, Network, HexString, AptosAccount, TxnBuilderTypes, BCS } from "aptos";
import { MoveModule, MoveModuleBytecode } from "aptos/src/generated";
import { config } from "dotenv";
import { printJSON } from "./utils";
config();

const provider = new Provider(Network.DEVNET);
let resourceAccountAddress = new HexString(
    "0x959c7822c20404e3429a328b6ebac0e8a262abf95876a27f459591a2f2ba77de",
);
const mintMachineModule = await provider.getAccountModule(
    resourceAccountAddress,
    "mint_machine",
);
const packageManagerModule = await provider.getAccountModule(
    resourceAccountAddress,
    "package_manager",
);
const whitelistModule = await provider.getAccountModule(
    resourceAccountAddress,
    "whitelist",
);
const auidManagerModule = await provider.getAccountModule(
    resourceAccountAddress,
    "auid_manager",
);

const getModules = async (address: HexString): Promise<Array<MoveModule>> => {
    return (await provider.getAccountModules(address)).map((module) => {
        return module.abi!;
    });
};

const modules = await getModules(resourceAccountAddress);

const structs = modules.map((module) => {
    const { exposed_functions, ...rest } = module;
    return rest;
});

const entryFunctions = modules.map((module) => {
    return {
        exposed_functions: module.exposed_functions.filter(
            (func) => func.is_entry, // func.is_entry || func.is_view
        ),
    };
});

const viewFunctions = modules.map((module) => {
    return {
        exposed_functions: module.exposed_functions.filter(
            (func) => func.is_view, // func.is_entry || func.is_view
        ),
    };
});

//printJSON(structs);
printJSON(entryFunctions);
// printJSON(viewFunctions);

// async publishPackage(sender, packageMetadata, modules, extraArgs) {
//     const codeSerializer = new Serializer();
//     serializeVector(modules, codeSerializer);
//     const payload = new aptos_types_exports.TransactionPayloadEntryFunction(
//       aptos_types_exports.EntryFunction.natural(
//         "0x1::code",
//         "publish_package_txn",
//         [],
//         [bcsSerializeBytes(packageMetadata), codeSerializer.getBytes()]
//       )
//     );
//     return this.generateSignSubmitTransaction(sender, payload, extraArgs);
//   }
