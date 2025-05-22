import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts"
import { defaultProvider } from "@aws-sdk/credential-provider-node"

async function validateCredentials() {

    const sts = new STSClient({
        region: process.env.AWS_REGION,
        credentials: defaultProvider()
    })

    const cmd = new GetCallerIdentityCommand({})
    try {
        const res = await sts.send(cmd)
        console.log("Credenciales válidas para:", res.Arn)
    } catch (err) {
        console.error("Validación fallida:", err.name, err.message)
    }
}
validateCredentials()
