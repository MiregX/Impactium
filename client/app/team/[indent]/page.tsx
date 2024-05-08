'use client'
import { redirect } from "next/navigation";

export default function TeamIndentPage({ params }: { params: { indent: string } }) {
  if (!params.indent.startsWith('%40')) {
    redirect(`/team/@${params.indent}`);
  } else {
    params.indent = params.indent.replace('%40', '@');
  }
  return <p>{params.indent}</p>
}