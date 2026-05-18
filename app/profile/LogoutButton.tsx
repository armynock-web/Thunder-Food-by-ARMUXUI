"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/actions/auth"

export default function LogoutButton() {
  return (
    <form action={logout}>
      <Button 
        type="submit"
        variant="outline" 
        className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive bg-transparent"
      >
        <LogOut className="mr-2 h-4 w-4" />
        ออกจากระบบ
      </Button>
    </form>
  )
}
