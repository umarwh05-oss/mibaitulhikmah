"use client";
import {useState} from "react";
import {createBrowserClient} from "@supabase/ssr";
import {useRouter} from "next/navigation";
export default function Login(){const[r,setR]=useState("");const[e,setE]=useState("");const router=useRouter();const sb=createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
async function go(ev:React.FormEvent<HTMLFormElement>){ev.preventDefault();const f=new FormData(ev.currentTarget);const x=await sb.auth.signInWithPassword({email:String(f.get("email")),password:String(f.get("password"))});if(x.error)setE(x.error.message);else router.push("/admin")}
return <section><div className="wrap"><form className="card" style={{maxWidth:430,margin:"80px auto"}} onSubmit={go}><h1 style={{fontSize:34}}>Login Admin</h1>{e&&<div className="notice">{e}</div>}<div className="field"><label>Email</label><input name="email" type="email" required/></div><div className="field"><label>Password</label><input name="password" type="password" required/></div><button className="btn">Masuk</button></form></div></section>}