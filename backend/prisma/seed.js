require('dotenv').config()

const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const seedUser = {
    username: 'testuser',
    email: 'testuser@local.dev',
    password: 'Test1234!'
}

async function main() {
    const activeStatus = await prisma.userStatus.upsert({
        where: { code: 'ACTIVE' },
        update: { title: 'Active' },
        create: { code: 'ACTIVE', title: 'Active' }
    })

    const passwordHash = await bcrypt.hash(seedUser.password, 10)
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ username: seedUser.username }, { email: seedUser.email }]
        }
    })

    if (existingUser) {
        await prisma.user.update({
            where: { id: existingUser.id },
            data: {
                username: seedUser.username,
                email: seedUser.email,
                password: passwordHash,
                userStatusId: activeStatus.id
            }
        })
    } else {
        await prisma.user.create({
            data: {
                username: seedUser.username,
                email: seedUser.email,
                password: passwordHash,
                userStatusId: activeStatus.id
            }
        })
    }

    console.log('Seed completed')
    console.log(`Username: ${seedUser.username}`)
    console.log(`Email: ${seedUser.email}`)
    console.log(`Password: ${seedUser.password}`)
}

main()
    .catch((error) => {
        console.error('Seed failed')
        console.error(error)
        process.exitCode = 1
    })
    .finally(async () => {
        await prisma.$disconnect()
    })