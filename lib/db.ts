import fs from 'fs'; import path from 'path'; import { v4 as uuidv4 } from 'uuid'
const DIR = process.env.NODE_ENV === 'production' ? '/tmp' : path.join(process.cwd(), '.data')
function ensure() { if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true }) }
function read(f: string): any[] { ensure(); const p = path.join(DIR,f); if (!fs.existsSync(p)) return []; try { return JSON.parse(fs.readFileSync(p,'utf-8')) } catch { return [] } }
function write(f: string, d: any[]) { ensure(); fs.writeFileSync(path.join(DIR,f), JSON.stringify(d,null,2)) }
export const getUsers = () => read('users.json')
export const saveUsers = (u: any[]) => write('users.json', u)
export const getVideos = () => read('videos.json')
export const saveVideos = (v: any[]) => write('videos.json', v)
export const generateId = () => uuidv4()