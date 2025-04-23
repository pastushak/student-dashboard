import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jhuwkklgszqiupzqithf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpodXdra2xnc3pxaXVwenFpdGhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzODY1NTEsImV4cCI6MjA2MDk2MjU1MX0.EWPxl6sJ2f-UI66bx-nizUutwdDA7KTMLoPb30gVLNk'

// Ці значення можна знайти в розділі Project Settings > API
export const supabase = createClient(supabaseUrl, supabaseKey)

