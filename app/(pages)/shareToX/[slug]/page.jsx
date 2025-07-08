"use client"

import { useSearchParams } from 'next/navigation'
import Head from 'next/head'

export default function ShareToX() {
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug') || 'default-slug'
  const title = searchParams.get('title') || `My Cool Site | ${slug}`
  const description = searchParams.get('description') || 'Default description'
  const imageUrl = searchParams.get('image') || `${process.env.NEXT_PUBLIC_WEB_URL}/api/og?title=TOKEN%20NAME`

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@YourTwitterHandle" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:image:alt" content="Alt text for the image" />
      </Head>
    </>
  )
}
