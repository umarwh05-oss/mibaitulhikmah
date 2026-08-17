import {NextResponse} from "next/server";
import {supabaseAdmin} from "@/lib/supabase-admin";
export async function POST(req:Request){
 try{
  const fd=await req.formData();
  for(const k of ["nama_lengkap","nik","nama_wali","no_wa"]) if(!String(fd.get(k)||"").trim()) return NextResponse.json({error:`${k} wajib diisi`},{status:400});
  const db=supabaseAdmin(); const reg=`PPDB-${new Date().getFullYear()}-${crypto.randomUUID().slice(0,6).toUpperCase()}`;
  const base={registration_number:reg,nama_lengkap:String(fd.get("nama_lengkap")),nik:String(fd.get("nik")),jenis_kelamin:String(fd.get("jenis_kelamin")||""),ttl:String(fd.get("ttl")||""),nama_wali:String(fd.get("nama_wali")),no_wa:String(fd.get("no_wa")),asal_sekolah:String(fd.get("asal_sekolah")||""),alamat:String(fd.get("alamat")||""),status:"menunggu"};
  const {data,error}=await db.from("ppdb_applicants").insert(base).select("id").single(); if(error) throw error;
  const id=data.id;
  for(const field of ["kk","akta"]){const file=fd.get(field);if(file instanceof File&&file.size){if(file.size>5*1024*1024)return NextResponse.json({error:"Ukuran dokumen maksimal 5 MB"},{status:400});const ext=file.name.split(".").pop()?.toLowerCase()||"bin";const path=`${id}/${field}.${ext}`;const up=await db.storage.from("ppdb-documents").upload(path,file,{upsert:true,contentType:file.type});if(up.error)throw up.error;await db.from("ppdb_documents").insert({applicant_id:id,document_type:field,storage_path:path});}}
  return NextResponse.json({registration_number:reg});
 }catch(e:any){return NextResponse.json({error:e.message||"Server error"},{status:500})}
}