
import inquirer from 'inquirer'
import { listUsers, createUser, updateUser, deleteUser } from './aws/iamUserManager.js'
import { listPolicies, createPolicy, updatePolicy, deletePolicy } from './aws/iamPolicyManager.js'
import { listRoles, createRole, updateRole, deleteRole } from './aws/iamRoleManager.js'

async function subMenu(name, actions) {
    while (true) {
        const { op } = await inquirer.prompt({
            type: 'list',
            name: 'op',
            message: `--- ${name} Management ---`,
            choices: [
                ...actions.map(a => ({ name: a.label, value: a.value })),
                new inquirer.Separator(),
                { name: '← Volver al menú principal', value: 'back' }
            ],
        })
        if (op === 'back') return
        await actions.find(a => a.value === op).handler()
        console.log('\n')
    }
}

async function mainMenu() {
    const mainChoices = [
        { name: '👤 Users', value: 'users' },
        { name: '📄 Policies', value: 'policies' },
        { name: '🔑 Roles', value: 'roles' },
        new inquirer.Separator(),
        { name: '🚪 Salir', value: 'exit' },
    ]

    const userActions = [
        { label: 'Listar Users', value: 'list', handler: listUsers },
        {
            label: 'Crear User', value: 'create', handler: async () => {
                const { name } = await inquirer.prompt({
                    type: 'input', name: 'name', message: 'Nombre de user:'
                })
                await createUser(name)
            }
        },
        {
            label: 'Actualizar User', value: 'update', handler: async () => {
                const { oldName, newName } = await inquirer.prompt([
                    { type: 'input', name: 'oldName', message: 'User actual:' },
                    { type: 'input', name: 'newName', message: 'Nuevo nombre:' },
                ])
                await updateUser(oldName, newName)
            }
        },
        {
            label: 'Eliminar User', value: 'delete', handler: async () => {
                const { name } = await inquirer.prompt({
                    type: 'input', name: 'name', message: 'Nombre de user a borrar:'
                })
                await deleteUser(name)
            }
        },
    ]

    const policyActions = [
        { label: 'Listar Policies', value: 'list', handler: () => listPolicies('Local') },
        {
            label: 'Crear Policy', value: 'create', handler: async () => {
                const { file } = await inquirer.prompt({
                    type: 'input', name: 'file', message: 'Ruta archivo JSON:'
                })
                await createPolicy(file)
            }
        },
        {
            label: 'Actualizar Policy', value: 'update', handler: async () => {
                const { arn, file } = await inquirer.prompt([
                    { type: 'input', name: 'arn', message: 'ARN de la policy:' },
                    { type: 'input', name: 'file', message: 'Ruta nuevo JSON:' },
                ])
                await updatePolicy(arn, file)
            }
        },
        {
            label: 'Eliminar Policy', value: 'delete', handler: async () => {
                const { arn } = await inquirer.prompt({
                    type: 'input', name: 'arn', message: 'ARN de policy a borrar:'
                })
                await deletePolicy(arn)
            }
        },
    ]

    const roleActions = [
        { label: 'Listar Roles', value: 'list', handler: listRoles },
        {
            label: 'Crear Role', value: 'create', handler: async () => {
                const { name } = await inquirer.prompt({
                    type: 'input', name: 'name', message: 'Nombre de role:'
                })
                await createRole(name)
            }
        },
        {
            label: 'Actualizar Role', value: 'update', handler: async () => {
                const { oldName, newName } = await inquirer.prompt([
                    { type: 'input', name: 'oldName', message: 'Role actual:' },
                    { type: 'input', name: 'newName', message: 'Nuevo nombre:' },
                ])
                await updateRole(oldName, newName)
            }
        },
        {
            label: 'Eliminar Role', value: 'delete', handler: async () => {
                const { name } = await inquirer.prompt({
                    type: 'input', name: 'name', message: 'Nombre de role a borrar:'
                })
                await deleteRole(name)
            }
        },
    ]

    while (true) {
        const { section } = await inquirer.prompt({
            type: 'list', name: 'section', message: 'Seleccione sección:', choices: mainChoices
        })
        if (section === 'exit') {
            console.log('👋 ¡Adiós!')
            process.exit(0)
        }
        if (section === 'users') await subMenu('User', userActions)
        if (section === 'policies') await subMenu('Policy', policyActions)
        if (section === 'roles') await subMenu('Role', roleActions)
    }
}

mainMenu()
