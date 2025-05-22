import {
    CreateServiceLinkedRoleCommand,
    GetRoleCommand,
    GetServiceLinkedRoleDeletionStatusCommand,
    DeleteServiceLinkedRoleCommand
} from "@aws-sdk/client-iam"
import { iamClient } from "../aws/iamClient.js"
import { handleIamError } from "../aws/exceptionClient.js"

export const createServiceLinkedRole = async (serviceName) => {
    try {
        const cmd = new CreateServiceLinkedRoleCommand({ AWSServiceName: serviceName })
        const response = await iamClient.send(cmd)
        console.log(response)
    } catch (caught) {
        if (
            caught instanceof Error &&
            caught.name === "InvalidInputException" &&
            caught.message.includes(
                "Service role name AWSServiceRoleForElasticBeanstalk has been taken in this account",
            )
        ) {
            console.warn(caught.message)
            return client.send(
                new GetRoleCommand({ RoleName: "AWSServiceRoleForElasticBeanstalk" }),
            )
        }
        throw caught
    }
}

export const deleteServiceLinkedRole = async (roleName) => {
    try {
        const cmd = new DeleteServiceLinkedRoleCommand({ RoleName: roleName })
        const response = await iamClient.send(cmd)
        console.log(response)
    } catch (error) { handleIamError(error) }
}

export const getServiceLinkedRoleDeletionStatus = async (deletionTaskId) => {
    try {
        const cmd = new GetServiceLinkedRoleDeletionStatusCommand({
            DeletionTaskId: deletionTaskId,
        })
        const response = await iamClient.send(cmd)
        console.log(response)
    } catch (error) { handleIamError(error) }
}