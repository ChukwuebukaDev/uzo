import Dashboard from "./Dashboard";
import { Suspense } from "react";
export default function RenderBoard(){
return <Suspense fallback = {<div>Dashboard Loading.....</div>}><Dashboard/></Suspense>
}