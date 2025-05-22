import {
    AddUserToGroupCommand,
    RemoveUserFromGroupCommand,
} from "@aws-sdk/client-iam"
import { iamClient } from "../aws/iamClient.js"
import { handleIamError } from "../aws/exceptionClient.js"

export const addUserToGroup = async (userName, groupName) => {
    try {
        const cmd = new AddUserToGroupCommand({ GroupName: groupName, UserName: userName })
        await iamClient.send(cmd)
        console.log(`User ${userName} added to the group ${groupName}`)
    } catch (error) { handleIamError(error) }
}

export const removeUserFromGroup = async (userName, groupName) => {
    try {
        const cmd = new RemoveUserFromGroupCommand({ GroupName: groupName, UserName: userName })
        await iamClient.send(cmd)
        console.log(`User ${userName} removed from the group ${groupName}`)
    } catch (error) { handleIamError(error) }
}
