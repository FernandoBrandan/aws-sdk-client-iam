---
title: client-iam
description: aws-sdk/client-iam
---

## IAM Manager (Node.js CLI + AWS SDK)

Una aplicación de consola para gestionar IAM de forma segura, siguiendo buenas prácticas.

## Funcionalidades del proyecto

- Listar políticas
  - Soporte para Scope: "Local" y Scope: "AWS" (administradas por AWS).
  - Opción para filtrar por nombre o path.
- Ver detalles de una política
  - Incluye versiones, permisos (PolicyDocument) y fecha de creación.
- Crear política IAM
  - Crear desde un JSON de permisos (suministrado por CLI o archivo externo).
- Eliminar políticas no asociadas
  - Detecta y permite borrar políticas huérfanas (sin usuarios, roles o grupos).
- Asumir rol con MFA
  - Usa @aws-sdk/client-sts para obtener credenciales temporales con MFA.
- Exportar/respaldar políticas
  - Guarda todas tus políticas IAM en archivos .json.

## Secuencia de uso

1. Desde root
2. Crear usuario
3. Crear grupo
4. Asignar usuario a grupo

---

5. Crear rol - credenciales temporales
6. Crear política - permisos
7. Asignar política a rol
8. Asignar rol a usuario

## Estructura del proyecto

```sh
iam-policy-manager/
├── .env
├── index.js
├── aws/
│ ├── iamClient.js                 # Cliente IAM configurado
│ ├── stsClient.js                 # Cliente STS para asunción de roles
│ ├────────────────────────────────────────────────────────────────────────
│ ├── createEntity.js              # Crear usuario, rol o política
│ ├── listEntities.js              # Listar usuarios, roles, políticas, grupos
│ ├── updateEntity.js              # Actualizar (attach/detach)
│ ├── deleteEntity.js              # Borrar usuario, rol o política
│ ├── getDetails.js                # Detalles de un recurso (policy, user, role)
│ ├────────────────────────────────────────────────────────────────────────
│ ├── exportBackup.js              # Exportar configuración a JSON
│ ├── assumeRole.js
│ ├── deleteUnusedPolicies.js
│ ├────────────────────────────────────────────────────────────────────────
├── utils/
│ └── logger.js
│ └── config.js                    # Carga y valida .env
└── policies/
  └── backup/
```

```sh
node index.js list --scope Local
node index.js view --name MyCustomPolicy
node index.js create --file ./my-policy.json
node index.js delete-unused
node index.js export
```

```sh
npm install dotenv prompt-sync winston commander
npm install @aws-sdk/client-iam @aws-sdk/client-sts

# Rol + MFA vía STS
```
