import { IAMClient, CreateAccessKeyCommand, ListAccessKeysCommand, DeleteAccessKeyCommand } from "@aws-sdk/client-iam"
import { defaultProvider } from "@aws-sdk/credential-provider-node"

export const iamClient = new IAMClient({
    region: process.env.AWS_REGION,
    credentials: defaultProvider(),
})
