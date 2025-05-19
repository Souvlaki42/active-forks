// TODO: Implement social share buttons using the "next-share" package

"use client";

import { CopyIcon } from "lucide-react";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  PinterestIcon,
  PinterestShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "next-share";
import { cn, copyToClipboard } from "~/lib/utils";
import { Button } from "./ui/button";

export function Toolbar({
  pathName,
  url = window.location.origin,
  title = "Active Forks",
  imageUrl = window.location.origin + "/favicon.ico",
  size = 32,
  hashtags = ["active-forks"],
  summary,
  className,
}: {
  pathName: string;
  url?: string;
  title?: string;
  imageUrl?: string;
  size?: number;
  hashtags?: string[];
  summary?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant={"secondary"}
        onClick={() =>
          copyToClipboard(
            `Find active forks for ${pathName === "/" ? "a git repo" : pathName.substring(1)}: ${window.location.origin}${pathName}`
          )
        }
      >
        <CopyIcon className="h-4 w-4" />
        <span className="sr-only">Copy</span>
      </Button>
      <FacebookShareButton
        url={url}
        quote={summary}
        hashtag={`#${hashtags[0]}`}
      >
        <FacebookIcon size={size} round />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={title} hashtags={hashtags}>
        <TwitterIcon size={size} round />
      </TwitterShareButton>
      <LinkedinShareButton url={url} title={title} summary={summary}>
        <LinkedinIcon size={size} round />
      </LinkedinShareButton>
      <PinterestShareButton url={url} media={imageUrl}>
        <PinterestIcon size={size} round />
      </PinterestShareButton>
      <EmailShareButton url={url} subject={title} body={summary}>
        <EmailIcon size={size} round />
      </EmailShareButton>
    </div>
  );
}
