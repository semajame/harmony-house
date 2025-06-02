// scripts/run-sql.ts
import 'reflect-metadata'
import * as fs from 'fs'
import * as path from 'path'
import { AppDataSource } from '@/app/lib/data-source'

async function runSqlFile(filename: string) {
  try {
    console.log(`🚀 Running ${filename}...`)
    
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
    }
    console.log('✅ Database connected')

    // Read SQL file
    const sqlPath = path.join(__dirname, filename)
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)
    
    console.log(`📄 Found ${statements.length} SQL statements`)
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement) {
        try {
          await AppDataSource.query(statement)
          console.log(`✅ Statement ${i + 1} executed`)
        } catch (error) {
          console.error(`❌ Error in statement ${i + 1}:`, statement.substring(0, 100) + '...')
          console.error(error)
          throw error
        }
      }
    }

    console.log(`🎉 ${filename} completed successfully!`)
    
  } catch (error) {
    console.error(`❌ Error running ${filename}:`, error)
    throw error
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy()
    }
  }
}

// Get command line argument
const filename = process.argv[2]
if (!filename) {
  console.error('❌ Usage: tsx scripts/run-sql.ts <filename>')
  console.error('Example: tsx scripts/run-sql.ts sqlinsert.sql')
  process.exit(1)
}

runSqlFile(filename)