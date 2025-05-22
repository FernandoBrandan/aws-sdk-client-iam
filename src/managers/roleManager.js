import {
    CreateRoleCommand,
    paginateListRoles,
    GetRoleCommand,
    UpdateRoleCommand,
    DeleteRoleCommand
} from "@aws-sdk/client-iam"
import { iamClient } from "../aws/iamClient.js"
import { handleIamError } from "../aws/exceptionClient.js"

export const createRole = async (roleName, optionRole) => {
    console.log(optionRole)

    try {
        const cmd = new CreateRoleCommand({
            RoleName: roleName,
            AssumeRolePolicyDocument: JSON.stringify({
                Version: "2012-10-17",
                Statement: [{
                    Effect: "Allow",
                    Principal: { Service: optionRole },
                    Action: "sts:AssumeRole"
                }]
            })
        })
        const res = await iamClient.send(cmd)
        console.log("Role created:", res.Role.RoleName)
    } catch (error) { handleIamError(error) }
}

export const listRoles = async () => {
    try {
        const paginator = paginateListRoles(
            { client: iamClient, pageSize: 10 },
            {}
        )
        try {
            console.log("Roles in your account:")
            let count = 0
            for await (const page of paginator) {
                if (page.Roles) {
                    for (const role of page.Roles) {
                        console.log(`- ${role.RoleName}`)
                        count++
                    }
                }
            }
            console.log(`Total: ${count} listed roles.`)
        } catch (error) { handleIamError(error) }
    } catch (error) { handleIamError(error) }
}

export const getRole = async (roleName) => {
    try {
        const command = new GetRoleCommand({ RoleName: roleName, })
        const role = await iamClient.send(command)
        console.log('Role detail:', JSON.stringify(role, null, 2))
    } catch (error) { handleIamError(error) }
}

export const updateRole = async (oldName, newName, newPath) => {
    try {
        throw new Error("Not implemented yet")
    } catch (error) { handleIamError(error) }
}

export const deleteRole = async (roleName) => {
    try {
        const cmd = new DeleteRoleCommand({ RoleName: roleName })
        await iamClient.send(cmd)
        console.log("Role deleted:", roleName)
    } catch (error) { handleIamError }
}

