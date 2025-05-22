import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts"


export const assumeRole = async () => {

    const sts = new STSClient({ region: process.env.AWS_REGION })
    const { Credentials } = await sts.send(new AssumeRoleCommand({
        RoleArn: process.env.ROLE_ARN,
        RoleSessionName: "IAMManagerSession",
        SerialNumber: process.env.SERIAL_NUMBER,
        TokenCode: process.env.TOKEN_CODE,
        DurationSeconds: 3600
    }))

    return {
        accessKeyId: Credentials.AccessKeyId,
        secretAccessKey: Credentials.SecretAccessKey,
        sessionToken: Credentials.SessionToken
    }
}
