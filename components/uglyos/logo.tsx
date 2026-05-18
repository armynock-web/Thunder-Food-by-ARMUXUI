"use client"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function UglyosLogo({ size = "md", className = "" }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: "text-lg" },
    md: { icon: 32, text: "text-2xl" },
    lg: { icon: 48, text: "text-4xl" },
  }

  const { icon, text } = sizes[size]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon - Stylized fruit/vegetable with smile */}
      <div className="relative">
        <svg
          width={icon}
          height={icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main shape - imperfect circle/fruit */}
          <path
            d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4Z"
            fill="#FF5341"
          />
          {/* Leaf/stem */}
          <path
            d="M24 4C24 4 28 0 32 2C36 4 34 8 34 8C34 8 30 6 26 6C22 6 24 4 24 4Z"
            fill="#4CAF50"
          />
          {/* Left eye */}
          <circle cx="17" cy="20" r="3" fill="#121212" />
          {/* Right eye */}
          <circle cx="31" cy="20" r="3" fill="#121212" />
          {/* Smile */}
          <path
            d="M16 28C16 28 20 34 24 34C28 34 32 28 32 28"
            stroke="#121212"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {/* Logo Text */}
      <span className={`font-bold ${text} text-foreground`}>
        <span className="text-primary">Ugly</span>
        <span className="text-secondary">os</span>
      </span>
    </div>
  )
}
