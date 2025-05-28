"use client"

import Image from "next/image"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type CartItem as CartItemType, useCart } from "@/providers/cart-provider"
import { formatCurrency } from "@/lib/utils"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  const decreaseQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1)
    }
  }

  const increaseQuantity = () => {
    updateQuantity(item.id, item.quantity + 1)
  }

  return (
    <div className="flex gap-4 rounded-lg border p-4">
      <div className="relative h-20 w-20 overflow-hidden rounded-md bg-muted">
        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-muted-foreground">
              {item.color} • {item.variant}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(item.id)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={decreaseQuantity}
              disabled={item.quantity <= 1}
            >
              <span className="font-medium">-</span>
              <span className="sr-only">Decrease quantity</span>
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={increaseQuantity}>
              <span className="font-medium">+</span>
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>
          <div className="text-right">
            <div className="font-medium">{formatCurrency(item.price)}</div>
            {item.originalPrice && (
              <div className="text-sm text-muted-foreground line-through">{formatCurrency(item.originalPrice)}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
