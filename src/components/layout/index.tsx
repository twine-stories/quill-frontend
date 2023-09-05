import React from 'react'
import Navbar from './Navbar.tsx'


type LayoutProps = {
    isViewChapterPage?:boolean
}
export function Layout({isViewChapterPage = true}:LayoutProps){
    return (
          <Navbar isViewChapterPage={isViewChapterPage}  />
    )
}