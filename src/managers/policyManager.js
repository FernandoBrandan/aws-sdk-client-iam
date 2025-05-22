import {
    CreatePolicyCommand,
    paginateListPolicies,
    GetPolicyCommand,

    DeletePolicyCommand
} from "@aws-sdk/client-iam"
import { iamClient } from "../aws/iamClient.js"
import { handleIamError } from "../aws/exceptionClient.js"

export const createPolicy = async (policyName, policyDocument) => {
    try {
        const cmd = new CreatePolicyCommand({
            PolicyDocument: JSON.stringify({
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Action: "*",
                        Resource: "*",
                    },
                ],
            }),
            PolicyName: policyName,
        })
        const res = await iamClient.send(cmd)
        console.log("Policy created:", res.Policy.PolicyName)
    } catch (error) { handleIamError(error) }
}

export const listPolicies = async () => {
    try {
        const paginator = paginateListPolicies(
            { client: iamClient, pageSize: 10 },
            {}
        )
        try {
            console.log("Policies in your account:")
            let count = 0
            for await (const page of paginator) {
                if (page.Policies) {
                    for (const policy of page.Policies) {
                        console.log(`- ${policy.PolicyName}`)
                        count++
                    }
                }
            }
            console.log(`Total: ${count} listed policies.`)
        } catch (error) { handleIamError(error) }
    } catch (error) { handleIamError(error) }
}

export const getPolicy = async (policyName) => {
    try {
        const cmd = new GetPolicyCommand({ PolicyArn: policyName })
        const res = await iamClient.send(cmd)
        console.log("Policy details:", res.Policy)
    } catch (error) { handleIamError(error) }
}

export const updatePolicy = async (policyName, policyDocument) => {
    try {
        throw new Error("Not implemented yet")
    } catch (error) { handleIamError(error) }
}

export const deletePolicy = async (policyName) => {
    try {
        const cmd = new DeletePolicyCommand({ PolicyArn: policyName })
        await iamClient.send(cmd)
        console.log("Policy deleted:", policyName)
    } catch (error) { handleIamError(error) }
}