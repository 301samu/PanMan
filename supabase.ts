
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uwadaqmjxgiptbgzxoqm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3YWRhcW1qeGdpcHRiZ3p4b3FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MTIxODMsImV4cCI6MjA4NjA4ODE4M30.7Yx7wZy7hmgoie1rnLvGLNaKZAS_w7tnfRbg38nJd3k';

export const supabase = createClient(supabaseUrl, supabaseKey);
