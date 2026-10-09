import { createElement } from "react"
import type { ImageProps } from "next/image"

export default function TestImage({
  alt,
  src,
  width,
  height,
  className,
}: ImageProps) {
  return createElement("img", {
    alt,
    src: typeof src === "string" ? src : "",
    width,
    height,
    className,
  })
}
