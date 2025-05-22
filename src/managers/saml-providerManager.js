import {
    CreateSAMLProviderCommand,
    DeleteSAMLProviderCommand,
    ListSAMLProvidersCommand,
} from "@aws-sdk/client-iam"
import { iamClient } from "../aws/iamClient.js"
import { handleIamError } from "../aws/exceptionClient.js"
import { readFileSync } from "node:fs"
import * as path from "node:path"

const sampleMetadataDocument = readFileSync(path.join("./sample_saml_metadata.xml"))

export const createSAMLProvider = async (providerName) => {
    try {
        const cmd = new CreateSAMLProviderCommand({
            Name: providerName,
            SAMLMetadataDocument: sampleMetadataDocument.toString(),
        })
        const response = await iamClient.send(cmd)
        console.log(response)
    } catch (error) { handleIamError(error) }
}

export const deleteSAMLProvider = async (providerArn) => {
    try {
        const cmd = new DeleteSAMLProviderCommand({
            SAMLProviderArn: providerArn,
        })
        const response = await iamClient.send(cmd)
        console.log(response)
    } catch (error) { handleIamError(error) }
}

export const listSAMLProviders = async () => {
    try {
        const cmd = new ListSAMLProvidersCommand({})
        const response = await iamClient.send(cmd)
        console.log(response)
    } catch (error) { handleIamError(error) }
}