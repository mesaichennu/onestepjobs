//erpservice.ts
import { supabase } from './supabase'
export type ERPClient={id:string;client_name:string;company_name:string;contact_person:string;phone:string;email:string;gst_number:string;address:string;status:'Active'|'Inactive';created_at:string;updated_at:string}
export type ERPClientInput=Omit<ERPClient,'id'|'created_at'|'updated_at'>
export type ERPBranch={id:string;branch_code:string;branch_name:string;branch_manager:string;phone:string;email:string;address:string;status:'Active'|'Upcoming'|'Temporarily Closed';created_at:string;updated_at:string}
export type ERPBranchInput=Omit<ERPBranch,'id'|'created_at'|'updated_at'>
export type ERPActivity={id:string;action:string;entity_type:string;entity_id:string|null;description:string;performed_by:string|null;created_at:string}
function data<T>(r:{data:T|null;error:{message:string}|null}):T{if(r.error)throw new Error(r.error.message);return r.data as T}
export async function fetchERPClients(){return data(await supabase.from('erp_clients').select('*').order('created_at',{ascending:false})) as ERPClient[]}
export async function saveERPClient(v:ERPClientInput,id?:string){return data(id?await supabase.from('erp_clients').update({...v,updated_at:new Date().toISOString()}).eq('id',id).select().single():await supabase.from('erp_clients').insert(v).select().single()) as ERPClient}
export async function deleteERPClient(id:string){return data(await supabase.from('erp_clients').delete().eq('id',id))}
export async function fetchERPBranches(){return data(await supabase.from('erp_branches').select('*').order('created_at',{ascending:false})) as ERPBranch[]}
export async function saveERPBranch(v:ERPBranchInput,id?:string){return data(id?await supabase.from('erp_branches').update({...v,updated_at:new Date().toISOString()}).eq('id',id).select().single():await supabase.from('erp_branches').insert(v).select().single()) as ERPBranch}
export async function deleteERPBranch(id:string){return data(await supabase.from('erp_branches').delete().eq('id',id))}
export async function fetchERPActivity(){return data(await supabase.from('erp_activity_logs').select('*').order('created_at',{ascending:false}).limit(8)) as ERPActivity[]}
export async function fetchERPCounts(){const [c,b,p,s]=await Promise.all([supabase.from('erp_clients').select('id',{count:'exact',head:true}),supabase.from('erp_branches').select('id',{count:'exact',head:true}),supabase.from('erp_projects').select('id',{count:'exact',head:true}),supabase.from('staff').select('id',{count:'exact',head:true})]);for(const x of [c,b,p,s])if(x.error)throw new Error(x.error.message);return {clients:c.count??0,branches:b.count??0,projects:p.count??0,employees:s.count??0}}
export async function logERPActivity(action:string,entity_type:string,entity_id:string,description:string){const {data:{user}}=await supabase.auth.getUser();const {error}=await supabase.from('erp_activity_logs').insert({action,entity_type,entity_id,description,performed_by:user?.id??null});if(error)console.warn('Activity log:',error.message)}
