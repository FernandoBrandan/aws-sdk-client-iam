import inquirer from 'inquirer'

import { createUser, listUsers, updateUser, deleteUser } from './managers/userManager.js'
import { createGroup, listGroups, updateGroup, deleteGroup } from './managers/groupManager.js'
import { createRole, listRoles, getRole, updateRole, deleteRole } from './managers/roleManager.js'
import { createPolicy, listPolicies, getPolicy, updatePolicy, deletePolicy } from './managers/policyManager.js'
import { createAccessKey, listAccessKeys, getAccessKeyLastUsed, updateAccessKey, deleteAccessKey } from './managers/access-keysManager.js'

import { addUserToGroup, removeUserFromGroup } from './actions/userToGroup.js'
import { attachRolePolicy, detachRolePolicy, putRolePolicy } from './actions/roleToPolicy.js'


export const userActions = [
    { label: 'List', value: 'list', handler: listUsers },
    {
        label: 'Create', value: 'create', handler: async () => {
            const { name } = await inquirer.prompt({ type: 'input', name: 'name', message: 'Name user:' })
            await createUser(name)
        }
    },
    {
        label: 'Update', value: 'update', handler: async () => {
            const { oldName, newName } = await inquirer.prompt([
                { type: 'input', name: 'oldName', message: 'Current user:' },
                { type: 'input', name: 'newName', message: 'New user name:' },
            ])
            await updateUser(oldName, newName)
        }
    },
    {
        label: 'Delete', value: 'delete', handler: async () => {
            const { name } = await inquirer.prompt({
                type: 'input', name: 'name', message: 'User name to delete:'
            })
            await deleteUser(name)
        }
    },
]

export const groupActions = [
    { label: 'List', value: 'list', handler: listGroups },
    {
        label: 'Create', value: 'create', handler: async () => {
            const { name } = await inquirer.prompt({ type: 'input', name: 'name', message: 'Name group:' })
            await createGroup(name)
        }
    },
    {
        label: 'Update', value: 'update', handler: async () => {
            const { oldName, newName } = await inquirer.prompt([
                { type: 'input', name: 'oldName', message: 'Current group:' },
                { type: 'input', name: 'newName', message: 'New group name:' },
            ])
            await updateGroup(oldName, newName)
        }
    },
    {
        label: 'Delete', value: 'delete', handler: async () => {
            const { name } = await inquirer.prompt({
                type: 'input', name: 'name', message: 'Group name to delete:'
            })
            await deleteGroup(name)
        },
    }
]

export const rolActions = [
    { label: 'List', value: 'list', handler: listRoles },
    {
        label: 'Create', value: 'create', handler: async () => {
            const { roleName, service } = await inquirer.prompt([
                { type: 'input', name: 'roleName', message: 'Role Name:' },
                { type: 'input', name: 'service', message: 'Service (p.ej. ec2.amazonaws.com):' }
            ])
            await createRole(roleName, service)
        }
    },
    {
        label: 'Create with options(invalid)',
        value: 'create',
        handler: async () => {
            const { mode } = await inquirer.prompt({
                type: 'list',
                name: 'mode',
                message: 'How to set role?',
                choices: [
                    { name: 'Only set service: default', value: 'service' },
                    { name: 'Set with ARN:policy', value: 'arn' }
                ]
            })

            let param_arn, param_service
            if (mode === 'service') {
                const { service } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'service',
                        message: 'Write service (p.ej. ec2.amazonaws.com):',
                        default: ''
                    }
                ])
                param_service = service
                param_arn = null
            } else if (mode === 'arn') {
                const { arn, service } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'arn',
                        message: 'Write ARN: (p.ej. arn:aws:iam::123456789012:role/my-role):',
                        default: ''
                    }, {
                        type: 'input',
                        name: 'service',
                        message: 'Write service (p.ej. ec2.amazonaws.com):',
                        default: ''
                    }
                ])
                param_arn = arn
                param_service = service
            }
            const optionRole = { param_arn, param_service }

            // 3) Nombre del rol
            const { RoleName } = await inquirer.prompt({
                type: 'input',
                name: 'RoleName',
                message: 'Role Name:'
            })

            // 4) Llamada a tu función de creación
            await createRole(RoleName, optionRole)
        }
    },
    {
        label: 'Get Role', value: 'getRole', handler: async () => {
            const { name } = await inquirer.prompt({
                type: 'input', name: 'name', message: 'Rol name:'
            })
            await getRole(name)
        }
    },
    {
        label: 'Update', value: 'update', handler: async () => {
            const { oldName, newName } = await inquirer.prompt([
                { type: 'input', name: 'oldName', message: 'Current rol:' },
                { type: 'input', name: 'newName', message: 'New rol name:' },
            ])
            await updateRole(oldName, newName)
        }
    },
    {
        label: 'Delete', value: 'delete', handler: async () => {
            const { name } = await inquirer.prompt({
                type: 'input', name: 'name', message: 'Rol name to delete:'
            })
            await deleteRole(name)
        }
    }
]

export const policyActions = [
    { label: 'List', value: 'list', handler: listPolicies },
    {
        label: 'Create', value: 'create', handler: async () => {
            const { name } = await inquirer.prompt({ type: 'input', name: 'name', message: 'Policy name:' })
            await createPolicy(name)
        }
    },
    {
        label: 'Get Policy', value: 'getPolicy', handler: async () => {
            const { name } = await inquirer.prompt({
                type: 'input', name: 'name', message: 'Policy name:'
            })
            await getPolicy(name)
        }
    },
    {
        label: 'Update', value: 'update', handler: async () => {
            const { oldName, newName } = await inquirer.prompt([
                { type: 'input', name: 'oldName', message: 'Current policy:' },
                { type: 'input', name: 'newName', message: 'New policy name:' },
            ])
            await updatePolicy(oldName, newName)
        }
    },
    {
        label: 'Delete', value: 'delete', handler: async () => {
            const { name } = await inquirer.prompt({
                type: 'input', name: 'name', message: 'Policy name to delete:'
            })
            await deletePolicy(name)
        }
    }
]

export const accessKeysActions = [
    { label: 'List', value: 'list', handler: listAccessKeys },
    {
        label: 'Create', value: 'create', handler: async () => {
            const { user } = await inquirer.prompt({ type: 'input', name: 'user', message: 'User name:' })
            await createAccessKey(user)
        }
    },
    {
        label: 'Get Access Key', value: 'getAccessKey', handler: async () => {
            const { user, accessKeyId } = await inquirer.prompt([
                { type: 'input', name: 'user', message: 'User name:' },
                { type: 'input', name: 'accessKeyId', message: 'Access key ID:' },
            ])
            await getAccessKey(user, accessKeyId)
        }
    },
    {
        label: 'Update', value: 'update', handler: async () => {
            const { user, accessKeyId, status } = await inquirer.prompt([
                { type: 'input', name: 'user', message: 'User name:' },
                { type: 'input', name: 'accessKeyId', message: 'Access key ID:' },
                { type: 'select', name: 'status', message: 'Status:' },
            ])
            await updateAccessKey(user, accessKeyId, status)
        }
    },
    {
        label: 'Delete', value: 'delete', handler: async () => {
            const { user, accessKeyId } = await inquirer.prompt([
                { type: 'input', name: 'user', message: 'User name:' },
                { type: 'input', name: 'accessKeyId', message: 'Access key ID:' },
            ])
            await deleteAccessKey(user, accessKeyId)
        }
    }
]

export const actions = [
    /**
     * Users to groups
     */
    {
        label: 'Add user to group', value: 'add', handler: async () => {
            const { user, group } = await inquirer.prompt([
                { type: 'input', name: 'user', message: 'User name:' },
                { type: 'input', name: 'group', message: 'Group name:' },
            ])
            await addUserToGroup(user, group)
        }
    },
    {
        label: 'Remove user from group', value: 'remove', handler: async () => {
            const { user, group } = await inquirer.prompt([
                { type: 'input', name: 'user', message: 'User name:' },
                { type: 'input', name: 'group', message: 'Group name:' },
            ])
            await removeUserFromGroup(user, group)
        }
    },
    {
        label: '-----', handler: async () => { }
    },
    /**
     * Roles to policies
     */
    {
        label: 'Attach role policy', value: 'attach', handler: async () => {
            const { role, policy } = await inquirer.prompt([
                { type: 'input', name: 'role', message: 'Role name:' },
                { type: 'input', name: 'policy', message: 'Policy name:' },
            ])
            await attachRolePolicy(role, policy)
        }
    },
    {
        label: 'Detach role policy', value: 'detach', handler: async () => {
            const { role, policy } = await inquirer.prompt([
                { type: 'input', name: 'role', message: 'Role name:' },
                { type: 'input', name: 'policy', message: 'Policy name:' },
            ])
            await detachRolePolicy(role, policy)
        }
    },
    {
        label: 'Put role policy', value: 'putrolepolicy', handler: async () => {
            const { role, policy } = await inquirer.prompt([
                { type: 'input', name: 'role', message: 'Role name:' },
                { type: 'input', name: 'policy', message: 'Policy name:' },
            ])
            await putRolePolicy(role, policy)
        }
    }
]
