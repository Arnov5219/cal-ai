import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://owxobihiluqphoqntntn.supabase.co'
const supabaseAnonKey = 'sb_publishable_ctIaDvFHcKm2wVTZtcfYRg_Ug_7jSdv'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
