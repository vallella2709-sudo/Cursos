import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hgpmknzzqefvnzrxlceu.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhncG1rbnp6cWVmdm56cnhsY2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MTQxOTAsImV4cCI6MjEwNjE5MDE5MH0.9AhIs3yCsuYA_CVoPrl-yhmWD5bUYv6i1PhdBHE5eNE"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)