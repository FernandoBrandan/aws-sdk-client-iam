import {
    CreateGroupCommand,
    paginateListGroups,
    UpdateGroupCommand,
    DeleteGroupCommand
} from "@aws-sdk/client-iam"
import { iamClient } from "../aws/iamClient.js"
import { handleIamError } from "../aws/exceptionClient.js"

export const createGroup = async (groupName) => {
    try {
        const cmd = new CreateGroupCommand({ GroupName: groupName })
        const res = await iamClient.send(cmd)
        console.log("Grupo created:", res.Group.GroupName)
    } catch (error) { handleIamError(error) }
}
export const listGroups = async () => {
    try {
        const paginator = paginateListGroups(
            { client: iamClient, pageSize: 10 },
            {}
        )
        console.log("Groups in your account:")
        let count = 0
        for await (const page of paginator) {
            if (page.Groups) {
                for (const group of page.Groups) {
                    console.log(`- ${group.GroupName}`)
                    count++
                }
            }
        }
        console.log(`Total: ${count} listed groups.`)
    } catch (error) { handleIamError(error) }
}
export const updateGroup = async (oldName, newName, newPath) => {
    try {
        const params = { GroupName: oldName, NewGroupName: newName }
        if (newPath) params.NewPath = newPath
        const cmd = new UpdateGroupCommand(params)
        await iamClient.send(cmd)
        console.log(`Group renamed to: ${newName}`)
    } catch (error) { handleIamError(error) }
}
export const deleteGroup = async (groupName) => {
    try {
        const cmd = new DeleteGroupCommand({ GroupName: groupName })
        await iamClient.send(cmd)
        console.log("Grupo deleted:", groupName)
    } catch (error) { handleIamError(error) }
}

/**
 * *******************************
 * Metodos extras
 * *******************************
 */
