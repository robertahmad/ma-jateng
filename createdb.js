const { Client } = require('pg')

async function createDb() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_5YH3cVuFWSMi@ep-spring-tree-at60vadx.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require"
  })
  
  await client.connect()
  console.log("Connected to neondb!")
  
  try {
    await client.query('CREATE DATABASE ma_jateng')
    console.log("Database ma_jateng created successfully!")
  } catch (e) {
    console.error("Error creating db:", e.message)
  }
  
  await client.end()
}

createDb()
