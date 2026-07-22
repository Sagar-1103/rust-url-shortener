"use client";

import Image from "next/image";
import Link from "next/link";
import logoLight from "@/public/logo-light.png";
import logoDark from "@/public/logo-dark.png";

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
          src={logoLight}
          alt="TrimIt Logo"
          width={size}
          height={size}
          className="dark:hidden object-cover size-full"
          priority
          unoptimized
        />
        <Image
          src={logoDark}
          alt="TrimIt Logo"
          width={size}
          height={size}
          className="hidden dark:block object-cover size-full"
          priority
          unoptimized
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
