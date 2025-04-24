import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zrbyorgyfkvscaawaeyp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyYnlvcmd5Zmt2c2NhYXdhZXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MjA2MDYsImV4cCI6MjA2MTA5NjYwNn0.FgEorzhFrHqsjH6_6GcmY1HJSMjqMSvm3f_dvNsnev4'

// Ці значення можна знайти в розділі Project Settings > API
export const supabase = createClient(supabaseUrl, supabaseKey);

