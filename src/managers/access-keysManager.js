import {
    CreateAccessKeyCommand,
    paginateListAccessKeys,
    GetAccessKeyLastUsedCommand,
    UpdateAccessKeyCommand,
    StatusType,
    DeleteAccessKeyCommand
} from "@aws-sdk/client-iam"
import { iamClient } from "../aws/iamClient.js"
import { handleIamError } from "../aws/exceptionClient.js"


export const createAccessKey = async (alias) => {
    try {
        const cmd = new CreateAccessKeyCommand({ AccountAlias: alias })
        const res = await client.send(cmd)
        console.log("AccessKeyId:", res.AccessKey.AccessKeyId)
        console.log("SecretAccessKey:", res.AccessKey.SecretAccessKey)
    } catch (err) { handleIamError(err) }
}

export const listAccessKeys = async (userName) => {
    try {
        // usar paginateListAccessKeys
        const paginator = paginateListAccessKeys(
            { client: iamClient, pageSize: 10 },
            {}
        )
        console.log("AccessKeys in your account:")
        let count = 0
        for await (const page of paginator) {
            if (page.AccessKeyMetadata) {
                for (const key of page.AccessKeyMetadata) {
                    console.log(`- ${key.AccessKeyId}`)
                    count++
                }
            }
        }
        console.log(`Total: ${count} listed access keys.`)
    } catch (err) { handleIamError(err) }
}

export const getAccessKeyLastUsed = async (accessKeyId) => {
    try {
        const command = new GetAccessKeyLastUsedCommand({ AccessKeyId: accessKeyId, })
        const response = await client.send(command)
        if (response.AccessKeyLastUsed?.LastUsedDate) {
            console.log(`${accessKeyId} was last used by ${response.UserName}`)
            console.log(`Via the ${response.AccessKeyLastUsed.ServiceName}`)
            console.log(`Service on ${response.AccessKeyLastUsed.LastUsedDate.toISOString()}`)
        }
    } catch (err) { handleIamError(err) }
}

export const updateAccessKey = async (userName, accessKeyId, status = null) => {
    try {
        const cmd = new UpdateAccessKeyCommand({
            UserName: userName,
            AccessKeyId: accessKeyId,
            Status: status || StatusType.Inactive
        })
        await client.send(cmd)
        console.log("Access Key actualizada:", accessKeyId)
    } catch (err) { handleIamError(err) }
}

export const deleteAccessKey = async (accessKeyId) => {
    try {
        //const cmd = new DeleteAccountAliasCommand({ AccountAlias: alias })
        const cmd = new DeleteAccessKeyCommand({
            AccessKeyId: accessKeyId
        })
        await client.send(cmd)
        console.log("Access Key eliminada:", accessKeyId)
    } catch (err) { handleIamError(err) }
}
