import { IAMServiceException } from "@aws-sdk/client-iam"

export function handleIamError(error) {
    if (error instanceof IAMServiceException) {
        console.error(`[IAM ERROR] ${error.name}: ${error.message}`)
        switch (error.name) {
            case "NoSuchEntityException":
                console.error("El recurso solicitado no existe.")
                break
            case "EntityAlreadyExistsException":
                console.error("Ya existe un recurso con ese nombre.")
                break
            case "LimitExceededException":
                console.error("Límite alcanzado. Revisa tus recursos.")
                break
            case "AccessDeniedException":
                console.error("Permisos insuficientes para esta operación.")
                break
            default:
                console.error(`Código: ${error.$metadata?.httpStatusCode || "desconocido"}`)
        }
    } else {
        console.error("Error inesperado:", error)
    }
}
