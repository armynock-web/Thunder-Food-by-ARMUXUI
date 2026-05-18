"use client";

import { useState } from "react";
import { MapPin, ChevronDown, Check, Plus, Home, Building, Briefcase } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Address {
  id: string;
  label: string;
  address: string;
  icon: typeof Home;
}

const savedAddresses: Address[] = [
  {
    id: "1",
    label: "บ้าน",
    address: "123 ถ.สุขุมวิท ซ.31 แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพ 10110",
    icon: Home,
  },
  {
    id: "2",
    label: "ที่ทำงาน",
    address: "456 อาคารสาทรสแควร์ ชั้น 15 ถ.สาทรเหนือ แขวงสีลม เขตบางรัก กรุงเทพ 10500",
    icon: Building,
  },
  {
    id: "3",
    label: "ออฟฟิศใหม่",
    address: "789 อาคารซีพีทาวเวอร์ ถ.สีลม แขวงสุริยวงศ์ เขตบางรัก กรุงเทพ 10500",
    icon: Briefcase,
  },
];

export function AddressSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-left">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">ส่งไปที่</p>
            <div className="flex items-center gap-1">
              <p className="font-semibold text-sm truncate">
                {selectedAddress.label}
              </p>
              <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>เลือกที่อยู่จัดส่ง</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          {savedAddresses.map((address) => {
            const isSelected = selectedAddress.id === address.id;
            return (
              <button
                key={address.id}
                onClick={() => {
                  setSelectedAddress(address);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-start gap-3 p-4 rounded-xl border transition-all text-left",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    isSelected ? "bg-primary" : "bg-muted"
                  )}
                >
                  <address.icon
                    className={cn(
                      "w-5 h-5",
                      isSelected
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{address.label}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                    {address.address}
                  </p>
                </div>
                {isSelected && (
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
        <Button variant="outline" className="w-full mt-4 gap-2 bg-transparent">
          <Plus className="w-4 h-4" />
          เพิ่มที่อยู่ใหม่
        </Button>
      </DialogContent>
    </Dialog>
  );
}
