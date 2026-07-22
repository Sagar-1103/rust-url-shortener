"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textClassName?: string;
  href?: string;
}

export function Logo({
  className = "",
  size = 32,
  showText = true,
  textClassName = "text-base font-bold tracking-tight text-foreground",
  href,
}: LogoProps) {
  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="relative shrink-0 overflow-hidden rounded-xl shadow-sm transition-transform duration-200 hover:scale-105"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo-light.png"
          alt="TrimIt Logo"
          width={size}
          height={size}
          className="dark:hidden object-cover size-full"
          priority
        />
        <Image
          src="/logo-dark.png"
          alt="TrimIt Logo"
          width={size}
          height={size}
          className="hidden dark:block object-cover size-full"
          priority
        />
      </div>
      {showText && <span className={textClassName}>TrimIt</span>}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
