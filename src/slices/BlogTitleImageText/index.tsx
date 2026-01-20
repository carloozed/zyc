import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `BlogTitleImageText`.
 */
export type BlogTitleImageTextProps =
  SliceComponentProps<Content.BlogTitleImageTextSlice>;

/**
 * Component for "BlogTitleImageText" Slices.
 */
const BlogTitleImageText: FC<BlogTitleImageTextProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for blog_title_image_text (variation:{" "}
      {slice.variation}) Slices
    </section>
  );
};

export default BlogTitleImageText;
