import {
  SliceSimulator,
  SliceSimulatorParams,
  getSlices,
} from "@prismicio/next";
import { SliceZone } from "@prismicio/react";
import type { Metadata } from "next";

import { components } from "@/slices";

/** Prismic tooling, not a page for visitors. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function SliceSimulatorPage({
  searchParams,
}: SliceSimulatorParams) {
  const { state } = await searchParams;
  const slices = getSlices(state);

  return (
    <SliceSimulator>
      <SliceZone slices={slices} components={components} />
    </SliceSimulator>
  );
}
