import {
  AttachRolePolicyCommand,
  DetachRolePolicyCommand,
  DeleteRolePolicyCommand,
  ListRolePoliciesCommand,
  paginateListRolePolicies,
  ListAttachedRolePoliciesCommand,
  paginateListAttachedRolePolicies,
  PutRolePolicyCommand
} from "@aws-sdk/client-iam"
import { iamClient } from "../aws/iamClient.js"
import { handleIamError } from "../aws/exceptionClient.js"


export const attachRolePolicy = async (roleName, policyArn) => {
  try {
    const command = new AttachRolePolicyCommand({
      RoleName: roleName,
      PolicyArn: policyArn,
    })
    const response = await iamClient.send(command)
    console.log(response)
  } catch (err) {
    handleIamError(err)
  }
}

export const detachRolePolicy = async (roleName, policyArn) => {
  try {
    const command = new DetachRolePolicyCommand({
      RoleName: roleName,
      PolicyArn: policyArn,
    })
    const response = await iamClient.send(command)
    console.log(response)
  } catch (err) {
    handleIamError(err)
  }
}

export const deleteRolePolicy = async (roleName, policyName) => {
  try {
    const command = new DeleteRolePolicyCommand({
      RoleName: roleName,
      PolicyName: policyName,
    })
    const response = await iamClient.send(command)
    console.log(response)
  } catch (err) {
    handleIamError(err)
  }
}

export const listRolePolicies = async () => {
  try {
    // use paginateListRolePolicies
    const command = new ListRolePoliciesCommand({
      RoleName: "ROLE_NAME",
    })
    const response = await iamClient.send(command)
    console.log(response)
  } catch (err) { handleIamError(err) }
}

export const listAttachedRolePolicies = async (roleName) => {
  try {
    const paginator = paginateListAttachedRolePolicies(
      { client: iamClient, pageSize: 10 },
      { RoleName: roleName },
    )
    console.log("Policies attached to role:")
    let count = 0
    for await (const policy of paginator) {
      if (policy.AttachedPolicies) {
        for (const policy of policy.AttachedPolicies) {
          console.log(`- ${policy.PolicyName}`)
          count++
        }
      }
    }
    console.log(`Total: ${count} attached policies.`)
  } catch (err) { handleIamError(err) }
}


export const putRolePolicy = async (roleName, policyName, policyDocument) => {
  try {
    const command = new PutRolePolicyCommand({
      RoleName: roleName,
      PolicyName: policyName,
      PolicyDocument: policyDocument,
    })
    const response = await iamClient.send(command)
    console.log(response)
  } catch (err) {
    handleIamError(err)
  }
}

const examplePolicyDocument = JSON.stringify({
  Version: "2012-10-17",
  Statement: [
    {
      Sid: "VisualEditor0",
      Effect: "Allow",
      Action: [
        "s3:ListBucketMultipartUploads",
        "s3:ListBucketVersions",
        "s3:ListBucket",
        "s3:ListMultipartUploadParts",
      ],
      Resource: "arn:aws:s3:::amzn-s3-demo-bucket",
    },
    {
      Sid: "VisualEditor1",
      Effect: "Allow",
      Action: [
        "s3:ListStorageLensConfigurations",
        "s3:ListAccessPointsForObjectLambda",
        "s3:ListAllMyBuckets",
        "s3:ListAccessPoints",
        "s3:ListJobs",
        "s3:ListMultiRegionAccessPoints",
      ],
      Resource: "*",
    },
  ],
})