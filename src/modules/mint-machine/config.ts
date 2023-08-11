import { readFileSync } from "fs";
import { parse } from "yaml";
import { InitializeMintMachineProps } from "./mint-machine";
import { TierInfo } from "./types";
import { printView } from "../string-utils";

const parseYamlFile = (filePath: string): any => {
    const fileContent = readFileSync(filePath, "utf8");
    return parse(fileContent);
};

// Parses the config data from config.yaml
export const getConfig = (
    configFile: string = "config.yaml",
): [InitializeMintMachineProps, Array<TierInfo>, number] => {
    const config = parseYamlFile(configFile);
    const mintConfiguration: InitializeMintMachineProps = {
        ...config.MintConfiguration,
        mutableDescription: config.MintConfiguration.mutability.description,
        mutableRoyalty: config.MintConfiguration.mutability.royalty,
        mutableUri: config.MintConfiguration.mutability.uri,
        mutableTokenDescription: config.MintConfiguration.mutability.tokenDescription,
        mutableTokenName: config.MintConfiguration.mutability.tokenName,
        mutableTokenProperties: config.MintConfiguration.mutability.tokenProperties,
        mutableTokenUri: config.MintConfiguration.mutability.tokenUri,
    };
    const tiers: TierInfo[] = (config.Tiers as Array<TierInfo>).map((tier) => {
        return {
            ...tier,
            startTimestamp: new Date(tier.startTimestamp),
            endTimestamp: new Date(tier.endTimestamp),
        };
    });
    return [mintConfiguration, tiers, config.ChunkSize];
};
