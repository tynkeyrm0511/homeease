#!/usr/bin/env node
// Usage: node scripts/create_notification.js "Tiêu đề" "Nội dung thông báo"
require('dotenv').config()
const prisma = require('../prismaClient')

const [, , titleArg, ...rest] = process.argv
const title = titleArg || 'Thông báo test'
const content = rest.length ? rest.join(' ') : 'Đây là nội dung thông báo test.'

async function run() {
  try {
    const n = await prisma.notification.create({
      data: {
        title,
        content,
        target: 'all'
      }
    })
    console.log('Created notification:', n)
    process.exit(0)
  } catch (err) {
    console.error('Failed to create notification', err)
    process.exit(1)
  }
}

run()
