import { ImageResponse } from "next/og";
import SocialPreviewCard, {
  socialPreviewAlt,
  socialPreviewSize,
} from "@/components/SocialPreviewCard";

export const alt = socialPreviewAlt;
export const size = socialPreviewSize;
export const contentType = "image/png";
export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export default function OpenGraphImage() {
  return new ImageResponse(<SocialPreviewCard />, size);
}
