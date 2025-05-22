import {
    CreateUserCommand,
    ListUsersCommand,
    paginateListUsers,
    UpdateUserCommand,
    DeleteUserCommand
} from "@aws-sdk/client-iam"
import { iamClient } from "../aws/iamClient.js"
import { handleIamError } from "../aws/exceptionClient.js"

export const createUser = async (userName) => {
    try {
        const cmd = new CreateUserCommand({ UserName: userName })
        const res = await iamClient.send(cmd)
        console.log("Usuario created:", res.User.UserName)
    } catch (error) { handleIamError(error) }
}

export const listUsers = async () => {
    try {
        const cmd = new ListUsersCommand({ MaxItems: 50 })
        const res = await iamClient.send(cmd)
        console.log("Users in the account:")
        res.Users.forEach(u => console.log(`- ${u.UserName}`))
    } catch (error) { handleIamError(error) }
}

export const updateUser = async (oldName, newName, newPath) => {
    try {
        const params = { UserName: oldName, NewUserName: newName }
        if (newPath) params.NewPath = newPath
        const cmd = new UpdateUserCommand(params)
        await iamClient.send(cmd)
        console.log(`User renamed to: ${newName}`)
    } catch (error) { handleIamError(error) }
}

export const deleteUser = async (userName) => {
    try {
        // Eliminar antes sus Access Keys y políticas asociadas)
        const cmd = new DeleteUserCommand({ UserName: userName })
        await iamClient.send(cmd)
        console.log("Usuario deleted:", userName)
    } catch (error) { handleIamError(error) }
}

/**
 * ********************************
 * Metodos extras
 * ********************************
 */

export const listUsersPaginate = async () => {
    const paginator = paginateListUsers(
        { client: iamClient, pageSize: 10 },
        {}
    )
    try {
        console.log("Users in your account:")
        let count = 0
        for await (const page of paginator) {
            if (page.Users) {
                for (const user of page.Users) {
                    console.log(`- ${user.UserName}`)
                    count++
                }
            }
        }
        console.log(`Total: ${count} listed users.`)
    } catch (error) { handleIamError(error) }
}