import {
    GetServerCertificateCommand,
    ListServerCertificatesCommand,
    paginateListServerCertificates,
    UpdateServerCertificateCommand,
    UploadServerCertificateCommand,
    DeleteServerCertificateCommand
} from "@aws-sdk/client-iam"
import { iamClient } from "../aws/iamClient.js"
import { handleIamError } from "../aws/exceptionClient.js"


export const getServerCertificate = async (certificateName) => {
    try {
        const cmd = new GetServerCertificateCommand({
            ServerCertificateName: certificateName,
        })
        const response = await iamClient.send(cmd)
        console.log(response)
    } catch (error) { handleIamError(error) }
}

export const listServerCertificates = async () => {
    try {
        const command = new ListServerCertificatesCommand({})
        let response = await client.send(command)

        while (response.ServerCertificateMetadataList?.length) {
            for await (const cert of response.ServerCertificateMetadataList) {
                yield cert
            }

            if (response.IsTruncated) {
                response = await client.send(new ListServerCertificatesCommand({}))
            } else {
                break
            }
        }
    } catch (error) { handleIamError(error) }
}

export const paginatedListServerCertificates = async () => {
    try {
        const cmd = new ListServerCertificatesCommand({})
        const response = paginateListServerCertificates({ client: iamClient, command: cmd })
        for await (const cert of response) {
            console.log(cert)
        }
    } catch (error) { handleIamError(error) }
}

export const updateServerCertificate = async (certificateName, newCertificateName) => {
    try {
        const cmd = new UpdateServerCertificateCommand({
            ServerCertificateName: certificateName,
            NewServerCertificateName: newCertificateName,
        })
        const response = await iamClient.send(cmd)
        console.log(response)
    } catch (error) { handleIamError(error) }
}

export const deleteServerCertificate = async (certificateName) => {
    try {
        const cmd = new DeleteServerCertificateCommand({
            ServerCertificateName: certificateName,
        })
        const response = await iamClient.send(cmd)
        console.log(response)
    } catch (error) { handleIamError(error) }
}

export const uploadServerCertificate = async (certificateName) => {
    try {

        const { cert, key } = getCertAndKey()
        const cmd = new UploadServerCertificateCommand({
            ServerCertificateName: certificateName,
            CertificateBody: cert.toString(),
            PrivateKey: key.toString(),
        })
        const response = await iamClient.send(cmd)
        console.log(response)
    } catch (error) { handleIamError(error) }
}

const getCertAndKey = () => {
    try {
        const cert = readFileSync(path.join("./example.crt"),)
        const key = readFileSync(path.join("./example.key"),)
        return { cert, key }
    } catch (err) {
        if (err.code === "ENOENT") {
            throw new Error(
                `Certificate and/or private key not found. ${certMessage}`,
            )
        }
        throw err
    }
}

const certMessage = `Generate a certificate and key with the following command, or the equivalent for your system.
openssl req -x509 -newkey rsa:4096 -sha256 -days 3650 -nodes \
-keyout example.key -out example.crt -subj "/CN=example.com" \
-addext "subjectAltName=DNS:example.com,DNS:www.example.net,IP:10.0.0.1"
`