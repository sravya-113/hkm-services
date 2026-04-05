import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WhatsAppButtonProps {
  isLoading?: boolean;
  onSend: (template: string) => void;
  defaultTemplate?: string;
  showTemplateSelection?: boolean;
  label?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  className?: string;
}

export function WhatsAppButton({
  isLoading,
  onSend,
  defaultTemplate = "Order Confirmed",
  showTemplateSelection = false,
  label = "Send via WhatsApp",
  variant = "outline",
  className = "",
}: WhatsAppButtonProps) {
  const templates = [
    "Order Confirmed",
    "Payment Received",
    "Ready for Delivery",
    "Invoice",
  ];

  if (showTemplateSelection) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            className={`border-green-600 text-green-700 hover:bg-green-50 ${className}`}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MessageCircle className="mr-2 h-4 w-4" />
            )}
            {label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {templates.map((template) => (
            <DropdownMenuItem
              key={template}
              onClick={() => onSend(template)}
              className="cursor-pointer font-medium text-slate-700"
            >
              <MessageCircle className="mr-2 h-3.5 w-3.5 text-green-600" />
              {template}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      variant={variant}
      onClick={() => onSend(defaultTemplate)}
      disabled={isLoading}
      className={`border-green-600 text-green-700 hover:bg-green-50 bg-green-50/50 ${className}`}
      type="button"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <MessageCircle className="mr-2 h-4 w-4 text-green-600" />
      )}
      {label}
    </Button>
  );
}
