import Dashboard from "./Dashboard";
import { Suspense } from "react";
import Link from "next/link";
export default function RenderBoard(){
return <Link href='/dashboard'><Suspense fallback = {<div>Dashboard Loading.....</div>}><Dashboard/></Suspense></Link>
}