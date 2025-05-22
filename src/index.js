import 'dotenv/config'
// import "./aws/validatedClient.js"

/**
 * Create a .env file with the following variables:
 * APP_NAME=
 * AWS_ACCESS_KEY_ID=
 * AWS_SECRET_ACCESS_KEY=
 * AWS_REGION="us-east-1"
 */

import inquirer from 'inquirer'
import { userActions, groupActions, rolActions, policyActions, accessKeysActions, actions } from './manager.js'

async function subMenu(name, actions) {
    while (true) {
        const { op } = await inquirer.prompt({
            type: 'list',
            name: 'op',
            message: `--- ${name} Management --- \n`,
            choices: [
                ...actions.map(a => ({ name: a.label, value: a.value })),
                new inquirer.Separator(),
                { name: '← Back to main menu', value: 'back' }
            ],
        })
        if (op === 'back') return
        await actions.find(a => a.value === op).handler()
        console.log('\n')
    }
}

async function mainMenu() {

    const mainChoices = [
        { name: 'Users', value: 'users' },
        { name: 'Groups', value: 'groups' },
        { name: 'Roles', value: 'roles' },
        { name: 'Policies', value: 'policies' },
        { name: 'AccessKeys', value: 'accessKeys' },
        { name: 'Actions', value: 'actions' },
        new inquirer.Separator(),
        { name: 'Exit', value: 'exit' },
    ]

    while (true) {
        const { section } = await inquirer.prompt({
            type: 'list',
            name: 'section',
            message: 'Select option:',
            choices: mainChoices
        })
        if (section === 'users') await subMenu('User', userActions)
        if (section === 'groups') await subMenu('Groups', groupActions)
        if (section === 'roles') await subMenu('Roles', rolActions)
        if (section === 'policies') await subMenu('Policies', policyActions)
        if (section === 'accessKeys') await subMenu('AccessKeys', accessKeysActions)
        if (section === 'actions') await subMenu('Actions', actions)
        if (section === 'exit') { process.exit(0) }
    }
}

mainMenu()
